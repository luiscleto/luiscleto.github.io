import { lazy, Suspense } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Analytics from './components/Analytics'
import './App.css'

const Journey = lazy(() => import('./journey/Journey'))

function Home() {
  return (
      <main className="container">
        <section className="hero">
          <h1>Luís Cleto</h1>
          <h2>Software Engineer</h2>
          <p>
            Backend engineer with 10 years of experience building scalable distributed systems.
            Currently a Senior Backend Engineer at Mozn and founder of ElaronWorks, where I do consulting, product exploration, and AI integration work.
            Previously worked at Google, startups, and larger companies.
          </p>
          <Link className="cv-link" to="/journey/">Explore my CV ↗</Link>
        </section>

        <section className="skills">
          <h3>Key Technologies</h3>
          <div className="skill-tags">
            {["Go", "Python", "SQL", "gRPC", "Kafka", "Kubernetes", "AWS", "Terraform", "TypeScript", "AI APIs"].map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </section>

        <section className="contact">
          <div className="social-links">
            <a href="https://linkedin.com/in/luiscleto" target="_blank" rel="noopener noreferrer">
              Connect on LinkedIn
            </a>
            <a href="https://github.com/luiscleto" target="_blank" rel="noopener noreferrer">
              View GitHub
            </a>
            <a href="https://elaronworks.com" target="_blank" rel="noopener noreferrer">
              Consulting via ElaronWorks
            </a>
          </div>
        </section>
      </main>
  )
}

function App() {
  return <BrowserRouter>
    <Suspense fallback={<p className="page-loading">Loading the journey…</p>}>
      <Routes>
        <Route path="/journey/*" element={<Journey />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
    <Analytics />
  </BrowserRouter>
}

export default App
