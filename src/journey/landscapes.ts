import * as THREE from 'three'
import chapters from './chapters.json'

export const spacing = 19
export const zAt = (i: number) => Math.sin(i * 1.4) * 3
const colors = { ground: '#4b5550', rock: '#303a3f', stone: '#b5aa94', roof: '#a95740', tree: '#446c56', water: '#295b70', window: '#f1c880', iron: '#779293' }
export const shortLabel = (title: string) => ({
  'FEUP · Undergraduate teaching': 'FEUP · Teaching',
  'University of Porto': 'FEUP', 'Faculty of Engineering, University of Porto': 'FEUP · Teaching',
  'Grupo de Ação Social do Porto': 'G.A.S. Porto', 'Delft University of Technology': 'TU Delft',
  'Instituto Sekular Maun Allin iha Kristu': 'IS-MAIK', 'Quantic School of Business and Technology': 'Quantic',
}[title] ?? title)

export function makeIsland(kind: string, index: number) {
  const group = new THREE.Group()
  group.position.set(index * spacing, 0, zAt(index))
  const materials = new Map<string, THREE.MeshStandardMaterial>()
  const material = (color: string) => {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.85, flatShading: true, ...(color === colors.window ? { emissive: color, emissiveIntensity: 0.45 } : {}) }))
    return materials.get(color)!
  }
  const mesh = (geometry: THREE.BufferGeometry, color: string, x: number, y: number, z: number) => {
    const object = new THREE.Mesh(geometry, material(color))
    object.position.set(x, y, z)
    object.castShadow = true; object.receiveShadow = true
    group.add(object)
    return object
  }
  const box = (x: number, y: number, z: number, w: number, h: number, d: number, color: string) => mesh(new THREE.BoxGeometry(w, h, d), color, x, y, z)
  const cone = (x: number, y: number, z: number, r: number, h: number, color: string, sides = 4) => {
    const object = mesh(new THREE.ConeGeometry(r, h, sides), color, x, y, z)
    if (sides === 4) object.rotation.y = Math.PI / 4
    return object
  }
  const beam = (a: number[], b: number[], radius: number, color: string) => {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b)
    const object = mesh(new THREE.CylinderGeometry(radius, radius, start.distanceTo(end), 6), color, 0, 0, 0)
    object.position.copy(start.clone().add(end).multiplyScalar(0.5))
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize())
  }
  const tube = (points: THREE.Vector3[], radius: number, color: string) => mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 36, radius, 6, false), color, 0, 0, 0)
  const roof = (x: number, y: number, z: number, w: number, d: number, h: number, color = colors.roof) => {
    const shape = new THREE.Shape().moveTo(-w / 2, 0).lineTo(w / 2, 0).lineTo(0, h).closePath()
    return mesh(new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false }), color, x, y, z - d / 2)
  }
  const house = (x: number, z: number, h = 1.5, color = colors.stone, w = 0.72, base = 0, style = 'gable', includeDoor = true) => {
    box(x, base + h / 2, z, w, h, 0.85, color)
    if (style !== 'flat') roof(x, base + h, z, w + 0.09, style === 'dutch' ? 0.83 : 0.98, style === 'dutch' ? 0.65 : 0.33)
    else box(x, base + h, z, w + 0.06, 0.12, 0.9, '#42484c')
    if (style === 'dutch') {
      for (let j = 0; j < 3; j++) box(x, base + h + j * 0.17, z + 0.44, w * (1 - j * 0.26), 0.17, 0.08, color)
    }
    for (let row = 0; row < Math.floor(h / 0.45); row++) for (const side of [-1, 1]) {
      box(x + side * w * 0.25, base + 0.35 + row * 0.45, z + 0.431, 0.13, 0.23, 0.02, colors.window)
    }
    if (includeDoor) box(x, base + 0.23, z + 0.45, 0.18, 0.46, 0.05, '#344b50')
  }
  const tree = (x: number, z: number, h = 1.1, base = 0) => {
    box(x, base + h / 2, z, 0.12, h, 0.12, '#786348')
    mesh(new THREE.IcosahedronGeometry(h * 0.45, 1), colors.tree, x, base + h, z)
  }
  const tower = (x: number, z: number, h: number, color: string, base = 0, spire = true) => {
    box(x, base + h / 2, z, 0.7, h, 0.75, color)
    for (let j = 1; j < h / 0.65; j++) {
      box(x, base + j * 0.65, z, 0.79, 0.08, 0.81, colors.stone)
      box(x, base + j * 0.65 + 0.23, z + 0.381, 0.17, 0.29, 0.02, '#28383b')
    }
    if (spire) cone(x, base + h + 0.53, z, 0.43, 1.05, '#495963')
  }
  const river = (z: number, width: number) => {
    box(0, 0.07, z, 9.2, 0.1, width + 0.18, '#718383')
    box(0, 0.14, z, 9.1, 0.05, width, colors.water)
    for (let i = 0; i < 8; i++) box(-3.7 + i, 0.17, z + (i % 3 - 1) * width * 0.3, 0.42, 0.01, 0.025, '#56818c')
  }
  const bridge = (x: number, z: number, span: number, height: number, color: string, steel = false) => {
    for (const side of [-1, 1]) {
      const px = x + side * 0.36
      const points = Array.from({ length: 21 }, (_, i) => new THREE.Vector3(px, 0.22 + Math.sin(i / 20 * Math.PI) * height, z - span / 2 + i / 20 * span))
      tube(points, steel ? 0.065 : 0.09, color)
      if (steel) {
        box(px, height + 0.42, z, 0.07, 0.08, span + 0.3, color)
        for (let j = 0; j <= 10; j++) {
          const pz = z - span / 2 + j / 10 * span
          const py = 0.22 + Math.sin(j / 10 * Math.PI) * height
          beam([px, py, pz], [px, height + 0.42, pz], 0.025, color)
          if (j < 10) beam([px, py, pz], [px, height + 0.42, pz + span / 10], 0.02, color)
        }
      } else {
        tube(points.map(p => p.clone().add(new THREE.Vector3(0, 0.35, 0))), 0.025, color)
        for (let j = 0; j < points.length; j += 2) beam(points[j].toArray(), points[j].clone().add(new THREE.Vector3(0, 0.35, 0)).toArray(), 0.02, color)
      }
    }
    if (steel) {
      box(x, height + 0.3, z, 0.82, 0.12, span + 0.4, '#586a70')
      box(x, 0.3, z, 0.75, 0.1, span + 0.2, '#586a70')
    } else {
      for (let j = 0; j < 24; j++) box(x, 0.16 + Math.sin((j + 0.5) / 24 * Math.PI) * height, z - span / 2 + (j + 0.5) / 24 * span, 0.72, 0.09, span / 24 + 0.02, colors.stone)
    }
  }
  mesh(new THREE.CylinderGeometry(5.3, 4.9, 0.65, 12), colors.rock, 0, -0.43, 0)
  mesh(new THREE.CylinderGeometry(5.32, 5.3, 0.16, 12), colors.ground, 0, -0.02, 0)

  if (kind === 'porto' || kind === 'home') {
    // Ribeira terraces, the Douro and the double-deck iron arch of Dom Luís I.
    river(0.9, 2.1)
    box(-0.3, 0.34, -1.4, 9.4, 0.6, 2.1, '#67665c')
    box(-1, 0.65, -2.6, 5.8, 1.1, 1.1, '#67665c')
    for (let i = 0; i < 8; i++) {
      // Leave a clear corridor around the bridge deck, including the roof overhangs.
      const x = i >= 6 ? 3.1 + (i - 6) * 0.85 : -3.45 + i * 0.85
      house(x, -0.9, 1.05 + i % 3 * 0.28, ['#c19874', '#8faaa7', '#c5b889', '#b67e65'][i % 4], 0.69, 0.65)
    }
    for (let i = 0; i < 4; i++) house(-2.8 + i * 0.9, -2.5, 1.1, '#a4a296', 0.72, 1.2)
    tower(-2.15, -2.6, 2.5, '#c3b392', 1.2, false)
    // Baroque upper tiers distinguish Clérigos from a generic spire.
    box(-2.15, 3.82, -2.6, 0.55, 0.4, 0.55, '#c3b392')
    mesh(new THREE.SphereGeometry(0.28, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), '#b5aa90', -2.15, 4.02, -2.6)
    beam([-2.15, 4.25, -2.6], [-2.15, 4.57, -2.6], 0.025, '#b5aa90')
    beam([-2.28, 4.47, -2.6], [-2.02, 4.47, -2.6], 0.025, '#b5aa90')
    bridge(2.2, 0.7, 3.4, 1.35, colors.iron, true)
    box(-1.6, 0.26, 1, 1.25, 0.16, 0.3, '#885a39')
    for (let j = 0; j < 4; j++) mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.15, 8), '#a77d4c', -2 + j * 0.24, 0.4, 1)
    beam([-1.6, 0.3, 1], [-1.6, 1, 1], 0.025, '#b19771')
    if (kind === 'home') {
      house(-2.6, 2.65, 0.7, '#a8b2a4', 0.75)
      for (let j = 0; j < 4; j++) mesh(new THREE.CapsuleGeometry(0.07, j < 2 ? 0.3 : 0.15, 2, 5), j % 2 ? '#ba816b' : '#83aaa3', -3.3 + j * 0.22, j < 2 ? 0.25 : 0.17, 3.25)
    }
  } else if (kind === 'delft') {
    // Narrow canal, stepped brick gables and the Oude Kerk's leaning tower.
    box(0, 0.1, 0, 1.4, 0.1, 8.5, colors.water)
    for (const side of [-1, 1]) {
      box(side * 0.84, 0.16, 0, 0.35, 0.18, 8.4, '#95958c')
      for (let j = 0; j < 5; j++) {
        const before = group.children.length
        const x = side * 1.7, z = -2.7 + j * 1.15
        house(x, z, 1.4 + j % 2 * 0.35, ['#996f58', '#b49878', '#795b4a'][j % 3], 0.8, 0, 'dutch')
        const facade = new THREE.Group()
        facade.position.set(x, 0, z)
        const parts = group.children.slice(before)
        parts.forEach(part => { part.position.sub(facade.position); facade.add(part) })
        facade.rotation.y = -side * Math.PI / 2
        group.add(facade)
      }
      for (let j = 0; j < 3; j++) tree(side * 0.9, -2.5 + j * 2, 0.85)
    }
    box(0, 0.32, 1.35, 2.2, 0.16, 0.65, colors.stone)
    for (const z of [1.04, 1.66]) beam([-1.1, 0.65, z], [1.1, 0.65, z], 0.035, '#9fa4a0')
    const towerStart = group.children.length
    tower(-2.8, -2.5, 3.35, '#977c66')
    for (const x of [-3.1, -2.5]) for (const z of [-2.8, -2.2]) cone(x, 3.55, z, 0.13, 0.6, '#586369')
    const leaningTower = new THREE.Group()
    leaningTower.position.set(-2.8, 0, -2.5)
    group.children.slice(towerStart).forEach(part => { part.position.sub(leaningTower.position); leaningTower.add(part) })
    leaningTower.rotation.z = 0.025
    group.add(leaningTower)
    // Two bicycle wheels beside the canal.
    for (const x of [-0.1, 0.4]) mesh(new THREE.TorusGeometry(0.17, 0.025, 5, 16), '#b2b3a4', x, 0.57, 1.69)
    beam([-0.1, 0.57, 1.69], [0.2, 0.83, 1.69], 0.02, '#ae644d')
    beam([0.2, 0.83, 1.69], [0.4, 0.57, 1.69], 0.02, '#ae644d')
  } else if (kind === 'london') {
    river(1, 1.8)
    // Westminster's long facade and clock tower.
    box(-1.1, 0.8, -1, 4.6, 1.5, 1.15, '#a89a79')
    for (let j = 0; j < 14; j++) {
      box(-3.2 + j * 0.32, 0.85, -0.41, 0.12, 0.85, 0.03, colors.window)
      cone(-3.2 + j * 0.32, 1.73, -0.42, 0.1, 0.35, '#9c927e')
    }
    tower(-2.9, -0.6, 3.7, '#b5a582')
    for (const side of ['front', 'right']) {
      const clock = mesh(new THREE.CircleGeometry(0.26, 24), colors.window, side === 'right' ? -2.539 : -2.9, 3.3, side === 'front' ? -0.214 : -0.6)
      if (side === 'right') clock.rotation.y = Math.PI / 2
    }
    beam([-2.9, 3.3, -0.2], [-2.9, 3.48, -0.2], 0.015, '#34454a')
    beam([-2.9, 3.3, -0.2], [-2.74, 3.3, -0.2], 0.015, '#34454a')
    const wheelX = 2.4, wheelY = 2.2, wheelZ = -1.5
    mesh(new THREE.TorusGeometry(1.35, 0.055, 6, 64), '#cad1ca', wheelX, wheelY, wheelZ)
    for (let j = 0; j < 12; j++) {
      const a = j / 12 * Math.PI * 2, x = wheelX + Math.cos(a) * 1.35, y = wheelY + Math.sin(a) * 1.35
      beam([wheelX, wheelY, wheelZ], [x, y, wheelZ], 0.015, '#aab8ba')
      mesh(new THREE.SphereGeometry(0.12, 8, 6), '#aec7d1', x, y, wheelZ)
    }
    beam([1.6, 0, -1], [wheelX, wheelY, wheelZ], 0.06, '#b2bab4')
    beam([3.2, 0, -1], [wheelX, wheelY, wheelZ], 0.06, '#b2bab4')
    box(-0.1, 0.4, 2.25, 1.1, 0.65, 0.45, '#a4463d')
    for (let j = 0; j < 3; j++) box(-0.45 + j * 0.35, 0.56, 2.48, 0.23, 0.18, 0.015, '#bdd0cd')
  } else if (kind === 'dublin') {
    river(0.7, 1.8)
    bridge(-0.4, 0.7, 2.4, 0.4, '#c6c9b5')
    for (let j = 0; j < 6; j++) {
      house(-3.25 + j * 0.86, -1.35, 1.9, ['#846052', '#9e7760', '#a58c70'][j % 3], 0.78, 0, 'flat', false)
      // Use only the Georgian door: the generic door had a coplanar front face, causing z-fighting.
      box(-3.25 + j * 0.86, 0.32, -0.89, 0.23, 0.64, 0.03, ['#355f6a', '#9f4941', '#57836b'][j % 3])
      mesh(new THREE.CircleGeometry(0.13, 12, 0, Math.PI), colors.window, -3.25 + j * 0.86, 0.66, -0.87)
    }
    // Poolbeg's striped chimneys, beyond the low Georgian roofline.
    for (const x of [2.7, 3.35]) for (let j = 0; j < 8; j++) mesh(new THREE.CylinderGeometry(0.14 - j * 0.007, 0.15 - j * 0.007, 0.4, 12), j % 2 ? '#c5b9a5' : '#a45245', x, 0.2 + j * 0.4, -2.6)
    tree(-3.6, 2.1)
  } else if (kind === 'warsaw') {
    // Palace of Culture's stepped silhouette and spire behind the Old Town.
    box(0.5, 0.35, -1.8, 3.1, 0.7, 1.6, '#aea48e')
    box(0.5, 1.2, -1.8, 1.65, 1.7, 1.3, '#b6ac95')
    box(0.5, 2.45, -1.8, 1.03, 1.4, 0.95, '#c2b69b')
    box(0.5, 3.25, -1.8, 0.74, 0.3, 0.7, '#c2b69b')
    cone(0.5, 3.72, -1.8, 0.35, 0.65, '#74817b')
    beam([0.5, 3.9, -1.8], [0.5, 4.65, -1.8], 0.035, '#bac2b4')
    for (let j = 0; j < 8; j++) for (const x of [0.2, 0.5, 0.8]) box(x, 0.7 + j * 0.3, -1.31, 0.1, 0.16, 0.03, colors.window)
    for (let j = 0; j < 6; j++) house(-3.1 + j * 0.95, 0.4, 1.1 + j % 2 * 0.35, ['#c18a76', '#b9ad7a', '#91a7a0'][j % 3], 0.83)
    for (let j = 0; j < 3; j++) {
      box(-3 + j * 0.65, 1 + j * 0.32, -2.4, 0.48, 2 + j * 0.64, 0.6, '#496575')
      for (let k = 0; k < 6; k++) box(-3 + j * 0.65, 0.35 + k * 0.32, -2.09, 0.4, 0.025, 0.01, '#98b6bf')
    }
  } else if (kind === 'lausanne') {
    // Lake Léman, terraced old town and a Gothic cathedral on its hill.
    river(2, 2.4)
    box(-0.4, 0.32, -0.8, 6, 0.55, 3.3, '#686c5b')
    box(-1, 0.76, -1.5, 3.2, 0.9, 1.8, '#73735f')
    for (let j = 0; j < 5; j++) house(-2.8 + j * 1.1, 0, 0.85 + j % 2 * 0.25, '#b9aa92', 0.8, 0.6)
    box(-1, 1.75, -1.6, 1.1, 1.1, 2.2, '#b9b39d')
    roof(-1, 2.3, -1.6, 1.3, 2.4, 0.6)
    tower(-1, -1.8, 1.95, '#b9b39d', 1.3)
    tower(-1.45, -0.6, 1.3, '#b9b39d', 1.2)
    for (let j = 0; j < 4; j++) {
      const h = 1.6 + j % 2 * 0.8
      cone(0.5 + j * 0.9, h / 2, -3, 1.1, h, '#637782', 5)
      cone(0.5 + j * 0.9, h * 0.85, -3, 0.34, h * 0.3, '#c7d2cf', 5)
    }
    box(-1.5, 0.28, 2.2, 0.9, 0.15, 0.3, '#bcc8c2')
    beam([-1.5, 0.3, 2.2], [-1.5, 1.1, 2.2], 0.025, '#bfb9a1')
    const sail = new THREE.Shape().moveTo(0, 0).lineTo(0.5, 0).lineTo(0, 0.65).closePath()
    mesh(new THREE.ShapeGeometry(sail), '#d8d4bc', -1.47, 0.4, 2.2)
  } else if (kind === 'timor') {
    // A coastal headland at Dili, inland hills and a route toward Loes / Aileu.
    river(2, 2.7)
    box(0, 0.15, 0.53, 8, 0.1, 0.45, '#b39e77')
    for (let j = 0; j < 4; j++) {
      const h = 1.7 + j % 2 * 0.8
      cone(-2.7 + j * 1.55, h / 2, -1.8, 1.5, h, j % 2 ? '#657851' : '#788061', 5)
    }
    cone(3, 0.8, 1, 1.2, 1.6, '#7d8060', 6)
    mesh(new THREE.SphereGeometry(0.25, 12, 8), '#a9b0a1', 3, 1.8, 1)
    box(3, 2.23, 1, 0.2, 0.65, 0.18, '#c4c8b5')
    mesh(new THREE.SphereGeometry(0.12, 8, 8), '#c4c8b5', 3, 2.65, 1)
    beam([2.52, 2.45, 1], [3.48, 2.45, 1], 0.075, '#c4c8b5')
    for (const x of [-2.4, -0.8]) {
      box(x, 0.5, -0.4, 0.85, 0.8, 0.75, '#b19b76')
      roof(x, 0.9, -0.4, 1.2, 1.15, 0.7, '#76654d')
    }
    for (const x of [-3.8, 0.7]) {
      beam([x, 0, 0.5], [x + 0.15, 1.45, 0.5], 0.07, '#8c7853')
      for (let j = 0; j < 6; j++) {
        const a = j * Math.PI / 3
        tube([new THREE.Vector3(x + 0.15, 1.45, 0.5), new THREE.Vector3(x + Math.cos(a) * 0.45, 1.65, 0.5 + Math.sin(a) * 0.45), new THREE.Vector3(x + Math.cos(a) * 0.8, 1.35, 0.5 + Math.sin(a) * 0.8)], 0.065, '#557c4c')
      }
    }
    // A small crocodile resting at the water's edge.
    const crocStart = group.children.length
    const body = mesh(new THREE.SphereGeometry(0.24, 10, 6), '#73845b', 0, 0.2, 0)
    body.scale.set(2.3, 0.65, 1)
    const head = box(0.58, 0.2, 0, 0.38, 0.2, 0.3, '#7d8c60')
    head.rotation.z = -0.05
    box(0.89, 0.16, 0, 0.4, 0.1, 0.23, '#7d8c60')
    box(0.89, 0.12, 0, 0.4, 0.025, 0.23, '#adab7a')
    for (const side of [-1, 1]) {
      for (const x of [-0.3, 0.3]) {
        const leg = box(x, 0.1, side * 0.25, 0.22, 0.1, 0.26, '#66764d')
        leg.rotation.y = side * 0.5
      }
      mesh(new THREE.SphereGeometry(0.065, 8, 6), '#92956c', 0.56, 0.33, side * 0.1)
      mesh(new THREE.SphereGeometry(0.027, 8, 6), '#1b2520', 0.59, 0.365, side * 0.11)
    }
    const tail = cone(-0.85, 0.18, 0, 0.18, 0.95, '#73845b', 5)
    tail.rotation.z = Math.PI / 2
    for (let j = 0; j < 6; j++) cone(-0.65 + j * 0.18, 0.36, 0, 0.07, 0.12, '#526647', 4)
    const crocodile = new THREE.Group()
    group.children.slice(crocStart).forEach(part => crocodile.add(part))
    crocodile.position.set(-2.1, 0.16, 1.75)
    crocodile.rotation.y = -0.2
    group.add(crocodile)
  }

  // Every entry gets an exhibit; work markers represent roles, not office locations.
  const beacons = chapters[index].cards.map((_, j, cards) => {
    const x = cards.length === 1 ? 0.8 : -3.2 + j * 6.4 / (cards.length - 1)
    const z = 3.4 - Math.abs(x) * 0.1
    const marker = box(x, 0.33, z, 0.35, 0.5, 0.35, '#b9995e')
    mesh(new THREE.OctahedronGeometry(0.15), colors.window, x, 0.77, z)
    marker.userData.cardIndex = j
    return marker
  })
  return { group, beacons, materials }
}
