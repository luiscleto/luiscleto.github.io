import { BrowserRouter } from 'react-router-dom'
import Analytics from './components/Analytics'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <main className="container">
        <section className="hero">
          <h1>Luís Cleto</h1>
          <h2>Software Engineer</h2>
          <p>
            Backend engineer with 10 years of experience building scalable distributed systems.
            Currently a Senior Backend Engineer at Mozn and founder of ElaronWorks, where I do consulting, product exploration, and AI integration work.
            Previously worked at Google, startups, and larger companies.
          </p>
        </section>

        <section className="skills">
          <h3>Key Technologies</h3>
          <div className="skill-tags">
            {["Go", "SQL", "gRPC", "Kafka", "Kubernetes", "AWS", "Terraform", "TypeScript", "AI APIs"].map((skill) => (
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
          </div>
        </section>
        <Analytics />
      </main>
    </BrowserRouter>
  )
}

export default App
