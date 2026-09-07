import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import chapters from './chapters.json'

import { makeIsland, spacing, zAt, shortLabel } from './landscapes'

type Props = { progress: React.RefObject<number>; active: number; reduced: boolean; onOpen: (index: number) => void }
export default function World({ progress, active, reduced, onOpen }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const pins = useRef<(HTMLElement | null)[]>([])
  const current = useRef({ active, reduced, onOpen })
  const [unavailable, setUnavailable] = useState(false)
  useEffect(() => { current.current = { active, reduced, onOpen } }, [active, reduced, onOpen])
  useEffect(() => {
    const container = host.current!
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) }
    catch { setUnavailable(true); return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-9, 9, 9, -9, 0.1, 120)
    scene.add(new THREE.HemisphereLight('#c4d5ef', '#354351', 2.1))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    const sun = new THREE.DirectionalLight('#ffe2b8', 2.8)
    sun.position.set(-8, 16, 9)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, far: 45 })
    sun.shadow.bias = -0.001
    scene.add(sun, sun.target)
    const islands = chapters.map((chapter, i) => makeIsland(chapter.kind, i))
    islands.forEach(({ group }) => scene.add(group))
    const route = new THREE.CatmullRomCurve3(chapters.flatMap((_, i) => [new THREE.Vector3(i * spacing - 4.8, -0.15, zAt(i) + 1.3), new THREE.Vector3(i * spacing, -0.2, zAt(i) + 2.7), new THREE.Vector3(i * spacing + 5, -0.15, zAt(i) + 1.3)]))
    const routeGeometry = new THREE.BufferGeometry().setFromPoints(route.getPoints(900))
    const routeMaterial = new THREE.LineDashedMaterial({ color: '#ad9875', dashSize: 0.2, gapSize: 0.22, transparent: true, opacity: 0.65 })
    const routeLine = new THREE.Line(routeGeometry, routeMaterial)
    routeLine.computeLineDistances()
    scene.add(routeLine)
    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      renderer.setSize(width, height)
      const aspect = width / Math.max(height, 1)
      const halfWidth = 7.7
      camera.left = -halfWidth
      camera.right = halfWidth
      camera.top = halfWidth / aspect
      camera.bottom = -halfWidth / aspect
      camera.updateProjectionMatrix()
      dirty = true
    }
    let dirty = true
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    const pointer = new THREE.Vector2(0, 0)
    const raycaster = new THREE.Raycaster()
    let hovered = -1
    const move = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1)
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(islands[current.current.active].beacons)[0]
      hovered = hit ? hit.object.userData.cardIndex as number : -1
      renderer.domElement.style.cursor = hovered >= 0 ? 'pointer' : 'default'
      dirty = true
    }
    const click = (event: MouseEvent) => { move(event); if (hovered >= 0) current.current.onOpen(hovered) }
    renderer.domElement.addEventListener('pointermove', move)
    renderer.domElement.addEventListener('click', click)
    const contextLost = (event: Event) => { event.preventDefault(); setUnavailable(true) }
    renderer.domElement.addEventListener('webglcontextlost', contextLost)
    let frame = 0
    let previous = -1
    let lastActive = -1
    let lastReduced = current.current.reduced
    const point = new THREE.Vector3()
    const draw = () => {
      frame = requestAnimationFrame(draw)
      if (document.hidden) return
      const { active: selected, reduced: still } = current.current
      const target = still ? selected : progress.current ?? 0
      if (Math.abs(previous - target) < 0.0001 && lastActive === selected && lastReduced === still && !dirty) return
      previous = target
      lastActive = selected
      lastReduced = still
      dirty = false
      const base = Math.floor(target)
      const mix = target - base
      const z = THREE.MathUtils.lerp(zAt(base), zAt(Math.min(base + 1, chapters.length - 1)), mix)
      const x = target * spacing
      camera.position.set(x + 8, 10.5, z + 14)
      camera.lookAt(x, 0.3, z)
      sun.position.set(x - 8, 16, z + 9)
      sun.target.position.set(x, 0, z)
      islands.forEach(({ group, beacons }, i) => {
        group.visible = Math.abs(i - target) < 1.5
        beacons.forEach((beacon, j) => beacon.scale.setScalar(i === selected && hovered === j ? 1.2 : 1))
      })
      renderer.render(scene, camera)
      const placed: { left: number; right: number; top: number; bottom: number }[] = []
      islands[selected].beacons.forEach((beacon, j) => {
        const pin = pins.current[j]
        if (!pin) return
        beacon.getWorldPosition(point)
        point.y += 0.85
        point.project(camera)
        const width = pin.offsetWidth, height = pin.offsetHeight
        const center = Math.max(width / 2 + 8, Math.min(container.clientWidth - width / 2 - 8, (point.x + 1) * container.clientWidth / 2))
        const anchor = (-point.y + 1) * container.clientHeight / 2
        let top = anchor - height - j % 2 * 36
        const left = center - width / 2, right = center + width / 2
        for (let attempt = 0; attempt < placed.length + 1; attempt++) {
          const collision = placed.find(rect => left < rect.right + 8 && right + 8 > rect.left && top < rect.bottom + 8 && top + height + 8 > rect.top)
          if (!collision) break
          top = collision.top - height - 8
        }
        placed.push({ left, right, top, bottom: top + height })
        pin.style.left = `${center}px`
        pin.style.top = `${top + height}px`
        pin.style.setProperty('--stem-height', `${20 + anchor - top - height}px`)
        const hidden = Math.abs(selected - target) > 0.37
        pin.style.opacity = hidden ? '0' : '1'
        pin.style.pointerEvents = hidden ? 'none' : 'auto'
        pin.style.visibility = hidden ? 'hidden' : 'visible'
      })
    }
    resize()
    draw()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      renderer.domElement.removeEventListener('pointermove', move)
      renderer.domElement.removeEventListener('click', click)
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) object.geometry.dispose()
      })
      islands.forEach(({ materials }) => materials.forEach(material => material.dispose()))
      routeGeometry.dispose()
      routeMaterial.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [progress]) // Mutable refs keep the scene alive while the reader scrolls.
  return <div className="world" ref={host} aria-label={`Miniature scene of ${chapters[active].place}`}>
    {unavailable ? <div className="world-fallback"><span>↝</span><p>{chapters[active].place}</p><small>The journey continues in the text below.</small></div> : <div className="world-pins">{chapters[active].cards.map((card, index) => 'href' in card && card.href
      ? <a key={`${active}-${index}`} ref={element => { pins.current[index] = element }} className="world-pin" href={card.href} target="_blank" rel="noopener noreferrer"><span>↗</span>{shortLabel(card.title)}</a>
      : <button key={`${active}-${index}`} ref={element => { pins.current[index] = element }} className="world-pin" onClick={() => onOpen(index)}><span>+</span>{shortLabel(card.title)}<span className="sr-only"> — open details</span></button>)}</div>}
  </div>
}
