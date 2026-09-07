import { useEffect, useRef, useState } from 'react'

export default function ContactCard({ prominent = false }: { prominent?: boolean }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!open) return
    const element = dialog.current!
    const returnFocus = trigger.current
    const previousOverflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const controls = element.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea')
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    element.addEventListener('keydown', trapFocus)
    return () => {
      element.removeEventListener('keydown', trapFocus)
      element.close()
      document.body.style.overflow = previousOverflow
      returnFocus?.focus({ preventScroll: true })
    }
  }, [open])

  return <>
    <button ref={trigger} className={`work-cta ${prominent ? 'is-prominent' : ''}`} aria-label="Want to work with me?" aria-haspopup="dialog" onClick={() => setOpen(true)}>
      <span><strong>{prominent ? 'Want to work with me?' : 'Work with me'}</strong><small>Hiring or B2B consulting · let’s talk</small></span><span aria-hidden="true">↗</span>
    </button>
    {open && <dialog ref={dialog} className="project-dialog contact-dialog" aria-labelledby="contact-title" onCancel={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false) }}>
      <article className="project-detail">
        <div className="detail-top"><span>LET’S TALK</span><button autoFocus aria-label="Close contact details" onClick={() => setOpen(false)}>×</button></div>
        <h2 id="contact-title">Want to work with me?</h2>
        <p className="detail-role">Interested in hiring me or working together on a B2B consulting project? Tell me a bit about what you have in mind.</p>
        <div className="contact-offers">
          <section aria-labelledby="hiring-title">
            <h3 id="hiring-title">Hiring</h3>
            <p>Looking for a backend engineer? My experience spans distributed systems, financial infrastructure and developer tooling, with hands-on work in Go, Java, Python and Kubernetes.</p>
          </section>
          <section aria-labelledby="consulting-title">
            <h3 id="consulting-title">B2B consulting</h3>
            <p>For focused projects, I can help with:</p>
            <ul>
              <li>Backend architecture, Go services, APIs and integrations.</li>
              <li>Performance, reliability and scaling distributed systems.</li>
              <li>AI-enabled applications and integrations across model providers.</li>
              <li>Agentic coding workflows for building and shipping software.</li>
            </ul>
            <a className="consulting-link" href="https://elaronworks.com" target="_blank" rel="noopener noreferrer">More about consulting at ElaronWorks ↗</a>
          </section>
        </div>
        <div className="contact-actions"><a className="contact-primary" href="mailto:luis@cleto.dev">Email me ↗</a><span>luis@cleto.dev</span></div>
      </article>
    </dialog>}
  </>
}
