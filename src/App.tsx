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
          <p>Backend engineer specializing in distributed systems in Go, with experience at Google and FinTech startups.</p>
        </section>

        <section className="skills">
          <h3>Key Technologies</h3>
          <div className="skill-tags">
            {["Go", "SQL", "gRPC", "Kafka", "AWS", "Java", "Terraform", "Distributed Systems", "AWS"].map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </section>

        <section className="contact">
          <a href="https://linkedin.com/in/luiscleto" target="_blank" rel="noopener noreferrer">
            Connect on LinkedIn
          </a>
        </section>
      </main>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
