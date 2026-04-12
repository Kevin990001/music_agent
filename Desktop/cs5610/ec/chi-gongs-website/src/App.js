import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];
      const scrollY = window.scrollY + 100;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  const skills = {
    Languages: ['Java', 'Python', 'C++', 'JavaScript', 'C', 'SQL'],
    Frameworks: ['Spring Boot', 'Hibernate', 'FastAPI', 'PyTorch', 'Django', 'React.js', 'Node.js', 'LangGraph', 'Strand'],
    Databases: ['MongoDB', 'MySQL', 'Redis', 'Elasticsearch', 'Milvus DB', 'Kafka', 'Airflow'],
    Tools: ['Kubernetes', 'Docker', 'Jenkins', 'AWS', 'GCP', 'ELK', 'Hugging Face', 'Claude Code', 'Cursor'],
  };

  const highlights = [
    { value: '3.5%', label: 'Delivery date accuracy improvement' },
    { value: '40+', label: 'Hours/week operational savings' },
    { value: '12+', label: 'Walmart experiences served' },
    { value: '8+', label: 'Seller integrations automated' },
  ];

  return (
    <div className="app">
      {/* NAV */}
      <nav className="navbar">
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => scrollTo('home')}>
            CG
          </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navLinks.map(({ id, label }) => (
              <li key={id}>
                <button
                  className={`nav-link ${activeSection === id ? 'active' : ''}`}
                  onClick={() => scrollTo(id)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-tag">Software Engineer</div>
          <h1 className="hero-name">Chi <span className="accent">Gong</span></h1>
          <p className="hero-sub">
            Building intelligent systems at scale — from microservices and supply chain engines
            to Gen-AI agents and real-time data pipelines.
          </p>
          <div className="hero-badges">
            <span className="badge">Walmart</span>
            <span className="badge">Northeastern University</span>
            <span className="badge">Gen-AI</span>
            <span className="badge">Full Stack</span>
          </div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => scrollTo('experience')}>View My Work</button>
            <button className="btn-secondary" onClick={() => scrollTo('contact')}>Get in Touch</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="avatar-ring">
            <div className="avatar">DG</div>
          </div>
          <div className="orbit orbit-1"><div className="orbit-dot" /></div>
          <div className="orbit orbit-2"><div className="orbit-dot" /></div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section section-light">
        <div className="section-inner">
          <h2 className="section-title">About <span className="accent">Me</span></h2>
          <div className="about-grid">
            <div className="about-text">
              <p>
                I'm a Software Engineer at <strong>Walmart's Supply Chain Technology</strong> team,
                where I build systems that power delivery date promises for millions of customers.
                My work spans microservice backends, intelligent AI agents, and real-time dashboards.
              </p>
              <p>
                I hold a <strong>Master's in Computer Science from Northeastern University</strong> (GPA 3.9/4.0),
                and I'm passionate about the intersection of distributed systems and applied AI — particularly
                agentic workflows, RAG systems, and multi-agent collaboration.
              </p>
              <p>
                Outside of core engineering, I actively pioneer <strong>AI-augmented developer productivity</strong>,
                building internal knowledge bases and hosting team knowledge-sharing sessions on topics like
                vibe coding, MCP integration, and context engineering.
              </p>
            </div>
            <div className="highlights-grid">
              {highlights.map(({ value, label }) => (
                <div className="highlight-card" key={label}>
                  <div className="highlight-value">{value}</div>
                  <div className="highlight-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section section-dark">
        <div className="section-inner">
          <h2 className="section-title">Technical <span className="accent">Skills</span></h2>
          <div className="skills-grid">
            {Object.entries(skills).map(([category, items]) => (
              <div className="skill-category" key={category}>
                <h3 className="skill-category-title">{category}</h3>
                <div className="skill-tags">
                  {items.map(skill => (
                    <span className="skill-tag" key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section section-light">
        <div className="section-inner">
          <h2 className="section-title">Professional <span className="accent">Experience</span></h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker" />
              <div className="timeline-card">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">Software Engineer</h3>
                    <div className="timeline-company">Walmart — Supply Chain Technology</div>
                  </div>
                  <span className="timeline-date">Jan 2025 – Present</span>
                </div>
                <div className="timeline-tech">
                  {['Java', 'Spring Boot', 'Python', 'Kafka', 'Docker', 'Kubernetes', 'Gen-AI'].map(t => (
                    <span className="tech-tag" key={t}>{t}</span>
                  ))}
                </div>
                <ul className="timeline-bullets">
                  <li>Built a <strong>full-stack delivery promise engine</strong> powering date estimates across Walmart's entire product catalog, ordering, and search experience.</li>
                  <li>Designed a <strong>sourcing calculation algorithm</strong> to determine optimal fulfillment centers and a holistic fulfillment node selection strategy.</li>
                  <li>Architected <strong>data integration pipelines</strong> with a canonical data interface, automating onboarding for 8+ third-party seller systems.</li>
                  <li>Developed a <strong>Gen-AI onboarding assistant agent</strong> that analyzes seller APIs and auto-generates documentation, instructions, and integration code.</li>
                  <li>Implemented a <strong>multi-agent collaboration flow</strong> with context engineering to improve accuracy and safety of artifact generation.</li>
                  <li>Built a <strong>Gen-AI reasoning agent</strong> with Redis + Elasticsearch RAG backend to improve traceability of sourcing decisions; integrated MCP organization-wide.</li>
                  <li>Delivered a <strong>real-time operational dashboard</strong> consolidating 4+ tools, saving 40+ engineer-hours per week.</li>
                  <li>Developed <strong>reusable frontend components</strong> portable across 12+ Walmart web experiences with minimal overhead.</li>
                  <li>Led <strong>CI/CD pipelines</strong>, Kubernetes cluster maintenance, and load balancing/alerting for operational excellence.</li>
                  <li><strong>Outcome:</strong> 3.5% improvement in delivery date estimation quality across all categories.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section section-dark">
        <div className="section-inner">
          <h2 className="section-title">Project <span className="accent">Work</span></h2>
          <div className="projects-grid">
            <div className="project-card">
              <div className="project-icon">📊</div>
              <h3 className="project-title">TikTok Video Engagement Prediction</h3>
              <p className="project-desc">
                Full-stack ML application to predict and visualize TikTok video engagement trends.
                Leveraged text embeddings (BERT, TF-IDF), hashtag analysis, and user interaction metrics
                to predict video performance with CatBoost.
              </p>
              <div className="project-tech">
                {['Python', 'Streamlit', 'CatBoost', 'BERT', 'TF-IDF', 'ML'].map(t => (
                  <span className="tech-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>

            <div className="project-card project-card-featured">
              <div className="project-icon">🤖</div>
              <h3 className="project-title">Gen-AI Supply Chain Agents</h3>
              <p className="project-desc">
                Multi-agent system at Walmart using LangGraph/Strand for automated seller onboarding
                and sourcing decision transparency. Includes context engineering, MCP integration,
                and a Redis + Elasticsearch RAG backend.
              </p>
              <div className="project-tech">
                {['LangGraph', 'Strand', 'Redis', 'Elasticsearch', 'MCP', 'RAG'].map(t => (
                  <span className="tech-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>

            <div className="project-card">
              <div className="project-icon">⚡</div>
              <h3 className="project-title">Probabilistic Delivery Simulation</h3>
              <p className="project-desc">
                Simulation system combining probabilistic modeling, historical delivery actuals, and
                speed prediction models to improve delivery date promise accuracy. Implemented and
                launched solver to production.
              </p>
              <div className="project-tech">
                {['Python', 'Java', 'Spring Boot', 'Kafka', 'Statistics'].map(t => (
                  <span className="tech-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="section section-light">
        <div className="section-inner">
          <h2 className="section-title">Edu<span className="accent">cation</span></h2>
          <div className="edu-card">
            <div className="edu-icon">🎓</div>
            <div className="edu-info">
              <h3>Master of Science in Computer Science</h3>
              <div className="edu-school">Northeastern University, Boston, MA</div>
              <div className="edu-meta">
                <span className="edu-date">2022 – 2025</span>
                <span className="edu-gpa">GPA: 3.9 / 4.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section section-dark">
        <div className="section-inner contact-inner">
          <h2 className="section-title">Get in <span className="accent">Touch</span></h2>
          <p className="contact-sub">
            I'm open to new opportunities and conversations. Feel free to reach out!
          </p>
          <div className="contact-links">
            <a href="mailto:gongchineu@gmail.com" className="contact-card">
              <span className="contact-icon">✉️</span>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-value">gongchineu@gmail.com</div>
              </div>
            </a>
            <a href="tel:+12063546356" className="contact-card">
              <span className="contact-icon">📞</span>
              <div>
                <div className="contact-label">Phone</div>
                <div className="contact-value">(206) 354-6356</div>
              </div>
            </a>
            <a href="https://www.linkedin.com/in/chi-gong" className="contact-card" target="_blank" rel="noreferrer">
              <span className="contact-icon">💼</span>
              <div>
                <div className="contact-label">LinkedIn</div>
                <div className="contact-value">linkedin.com/in/chi-gong</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 Chi Gong · Built with React</p>
      </footer>
    </div>
  );
}

export default App;
