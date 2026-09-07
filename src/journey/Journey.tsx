import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import chapters from './chapters.json'
import './journey.css'

const World = lazy(() => import('./World'))
type Card = { title: string; subtitle: string; period: string; paragraphs: string[]; tags: string[]; href?: string; links?: { label: string; url: string }[] }
const labels = ['Porto', 'Delft', 'Timor', 'First job', 'London', 'Dublin', 'Lausanne', 'Warsaw', 'Porto']

export default function Journey() {
  const [active, setActive] = useState(0)
  const [reading, setReading] = useState(false)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [selected, setSelected] = useState<Card | null>(null)
  const progress = useRef(0)
  const sections = useRef<(HTMLElement | null)[]>([])
  const dialog = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'The journey · Luís Cleto'
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => { document.title = previousTitle; media.removeEventListener('change', update) }
  }, [])

  useEffect(() => {
    let frame = 0
    const measure = () => {
      const offsets = sections.current.map(section => section ? section.offsetTop + section.offsetHeight / 2 - window.innerHeight / 2 : 0)
      const y = window.scrollY
      let next = chapters.length - 1
      if (y <= offsets[0]) next = 0
      else {
        for (let i = 0; i < offsets.length - 1; i++) {
          if (y < offsets[i + 1]) {
            next = i + Math.max(0, Math.min(1, (y - offsets[i]) / (offsets[i + 1] - offsets[i])))
            break
          }
        }
      }
      progress.current = next
      setActive(Math.round(next))
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    measure()
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame) }
  }, [reading])

  useEffect(() => {
    if (!selected) return
    const element = dialog.current!
    const previousOverflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const focusable = element.querySelectorAll<HTMLElement>('button, a[href]')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    element.addEventListener('keydown', trapFocus)
    return () => {
      element.removeEventListener('keydown', trapFocus)
      element.close()
      document.body.style.overflow = previousOverflow
      returnFocus.current?.focus({ preventScroll: true })
    }
  }, [selected])

  const scrollToChapter = (i: number, asReading: boolean, behavior: ScrollBehavior) => {
    const section = sections.current[i]
    if (!section) return
    const top = asReading ? section.offsetTop - 70 : window.innerWidth <= 600
      ? section.offsetTop
      : section.offsetTop + section.offsetHeight / 2 - window.innerHeight / 2
    window.scrollTo({ top: Math.max(0, top), behavior })
  }
  const jump = (i: number) => scrollToChapter(i, reading, reduced ? 'instant' : 'smooth')
  const open = (card: Card) => {
    if (card.href) { window.open(card.href, '_blank', 'noopener,noreferrer'); return }
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setSelected(card)
  }
  const toggleReading = () => {
    setReading(value => !value)
    requestAnimationFrame(() => scrollToChapter(active, !reading, 'instant'))
  }

  return <div className={`journey ${reading ? 'is-reading' : ''}`}>
    <a className="skip-journey" href="#journey-chapters">Skip to the story</a>
    <header className="journey-header">
      <Link to="/" className="journey-brand">luís cleto<span> / the journey</span></Link>
      <div className="journey-tools">
        <button aria-pressed={reading} onClick={toggleReading}>{reading ? '↝ Scene view' : '☷ Reading view'}</button>
        <Link to="/">Back to site <span aria-hidden="true">↗</span></Link>
      </div>
    </header>

    {!reading && <aside className="scene-stage" aria-label="Journey scene">
      <div className="scene-coordinate"><span className="coordinate-cross">+</span><span>{chapters[active].country}</span><span>FIELD NOTES / {String(active + 1).padStart(2, '0')}</span></div>
      <div className="scene-orbit" aria-hidden="true" />
      <Suspense fallback={<div className="world-fallback"><span>↝</span><p>Unfolding the journey…</p></div>}>
        <World active={active} progress={progress} reduced={reduced} onOpen={index => open(chapters[active].cards[index])} />
      </Suspense>
      <div className="scene-caption"><span className="compass" aria-hidden="true">✳</span><div><span className="scene-place">{chapters[active].place}</span><span className="scene-hint">A place in the story · select + to explore</span></div></div>
    </aside>}

    <main id="journey-chapters" className="journey-chapters">
      {chapters.map((chapter, index) => <section id={chapter.id} key={chapter.id} ref={element => { sections.current[index] = element }} className={`journey-chapter ${index === active ? 'is-active' : ''}`} aria-labelledby={`${chapter.id}-title`}>
        <div className="chapter-content">
          <div className="chapter-eyebrow"><span>{String(index + 1).padStart(2, '0')} / 09</span><span>{chapter.period}</span></div>
          {index === 0 ? <h1 id={`${chapter.id}-title`}>{chapter.title}<span className="title-dot">.</span></h1> : <h2 id={`${chapter.id}-title`}>{chapter.title}<span className="title-dot">.</span></h2>}
          <p className="chapter-text">{chapter.text}</p>
          {'aside' in chapter && chapter.aside && <p className="chapter-aside">{chapter.aside}</p>}
          <div className="chapter-projects">
            {chapter.cards.map((card, i) => 'href' in card && card.href ? <a key={card.title} className="project-link" href={card.href} target="_blank" rel="noopener noreferrer"><span className="project-icon" aria-hidden="true">↗</span><span><strong>{card.title}</strong><small>{card.subtitle}</small></span><span className="project-arrow" aria-hidden="true">↗</span></a> : <button key={`${card.title}-${i}`} className="project-link" onClick={() => open(card)}>
              <span className="project-icon" aria-hidden="true">{chapter.id === 'timor' ? '↗' : '+'}</span>
              <span><strong>{card.title === 'Faculty of Engineering, University of Porto' ? 'Back at FEUP · Teaching' : card.title === 'University of Porto' ? 'FEUP' : card.title}</strong><small>{card.subtitle}</small></span><span className="project-arrow" aria-hidden="true">↗</span>
            </button>)}
          </div>
          {chapter.note && <div className="personal-note"><span className="note-spark" aria-hidden="true">✳</span><div><span className="note-label">Along the way</span><p>{chapter.note}</p></div></div>}
          {index === 0 && <button className="start-scroll" onClick={() => jump(1)}><span aria-hidden="true">↓</span> Scroll to follow the journey</button>}
        </div>
      </section>)}
      <footer className="journey-end"><span>Porto → the world → Porto</span><button onClick={() => jump(0)}>Back to the beginning ↑</button></footer>
    </main>

    <nav className="journey-nav" aria-label="Journey chapters">
      <div className="route-intro"><span>THE ROUTE</span><small>{String(active + 1).padStart(2, '0')} / 09</small></div>
      <ol>{chapters.map((chapter, i) => <li key={chapter.id}><button onClick={() => jump(i)} aria-current={active === i ? 'step' : undefined} aria-label={`${i + 1}. ${chapter.place}${i === 0 ? ' · growing up' : i === 8 ? ' · back home' : ''}`}><span className="route-stop"><span>{String(i + 1).padStart(2, '0')}</span></span><span className="route-label">{labels[i]}</span></button></li>)}</ol>
      <span className="route-home" aria-hidden="true">↝</span>
    </nav>

    {selected && <dialog ref={dialog} className="project-dialog" aria-labelledby="project-title" onCancel={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null) }}>
      <article className="project-detail">
        <div className="detail-top"><span>FROM THE JOURNEY</span><button autoFocus onClick={() => setSelected(null)} aria-label="Close details">×</button></div>
        <p className="detail-period">{selected.period}</p>
        <h2 id="project-title">{selected.title}</h2>
        <p className="detail-role">{selected.subtitle}</p>
        <div className="detail-copy">{selected.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        {selected.tags.length > 0 && <ul className="detail-tags" aria-label="Technologies">{selected.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>}
        {selected.links && <div className="detail-links">{selected.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div>}
      </article>
    </dialog>}
  </div>
}
