import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

/* ── Typewriter hook ── */
function useTypewriter(words, speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

/* ── Scroll-reveal hook ── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

/* ── Main App ── */
function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });
  const appRef = useRef(null);

  const typewriterText = useTypewriter(
    ['Software Engineer', 'Gen-AI Builder', 'Systems Architect'],
    80,
    2200
  );

  useScrollReveal();

  /* scroll effects */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setShowBackTop(y > 400);

      const sections = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && y + 120 >= el.offsetTop && y + 120 < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* cursor glow */
  const onMouseMove = useCallback((e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
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
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  const skills = {
    Languages: { color: '#4f9cf9', items: ['Java', 'Python', 'C++', 'JavaScript', 'C', 'SQL'] },
    Frameworks: { color: '#a78bfa', items: ['Spring Boot', 'Hibernate', 'FastAPI', 'PyTorch', 'Django', 'React.js', 'Node.js', 'LangGraph', 'Strand'] },
    Databases: { color: '#34d399', items: ['MongoDB', 'MySQL', 'Redis', 'Elasticsearch', 'Milvus DB', 'Kafka', 'Airflow'] },
    Tools: { color: '#fb923c', items: ['Kubernetes', 'Docker', 'Jenkins', 'AWS', 'GCP', 'ELK', 'Hugging Face', 'Claude Code', 'Cursor'] },
  };

  const highlights = [
    { value: '3.5%', label: 'Delivery date accuracy improvement', color: '#4f9cf9' },
    { value: '40+', label: 'Hours/week operational savings', color: '#a78bfa' },
    { value: '12+', label: 'Walmart experiences served', color: '#34d399' },
    { value: '8+', label: 'Seller integrations automated', color: '#fb923c' },
  ];

  const walmartBullets = [
    { text: 'Built a <strong>full-stack delivery promise engine</strong> powering date estimates across Walmart\'s entire product catalog, ordering, and search experience.' },
    { text: 'Designed a <strong>sourcing calculation algorithm</strong> to determine optimal fulfillment centers and a holistic fulfillment node selection strategy.' },
    { text: 'Architected <strong>data integration pipelines</strong> with a canonical data interface, automating onboarding for 8+ third-party seller systems.' },
    { text: 'Developed a <strong>Gen-AI onboarding assistant agent</strong> that analyzes seller APIs and auto-generates documentation, instructions, and integration code.' },
    { text: 'Implemented a <strong>multi-agent collaboration flow</strong> with context engineering to improve accuracy and safety of artifact generation.' },
    { text: 'Built a <strong>Gen-AI reasoning agent</strong> with Redis + Elasticsearch RAG backend to improve traceability of sourcing decisions; integrated MCP organization-wide.' },
    { text: 'Delivered a <strong>real-time operational dashboard</strong> consolidating 4+ tools, saving 40+ engineer-hours per week.' },
    { text: 'Developed <strong>reusable frontend components</strong> portable across 12+ Walmart web experiences with minimal overhead.' },
    { text: 'Led <strong>CI/CD pipelines</strong>, Kubernetes cluster maintenance, and load balancing/alerting for operational excellence.' },
    { text: 'Pioneered <strong>AI-augmented developer productivity</strong> by building internal knowledge bases and hosting sessions on vibe coding, MCP integration, and context engineering.' },
    { text: 'Hosted <strong>team knowledge-sharing sessions</strong> on Gen-AI tooling including Claude Code, Cursor, and MCP patterns.' },
    { text: '<strong>Outcome:</strong> 3.5% improvement in delivery date estimation quality across all product categories.' },
  ];

  const projects = [
    {
      icon: '📊',
      title: 'TikTok Video Engagement Prediction',
      desc: 'Full-stack ML application to predict and visualize TikTok video engagement trends. Leveraged text embeddings (BERT, TF-IDF), hashtag analysis, and user interaction metrics to predict video performance with CatBoost.',
      tech: ['Python', 'Streamlit', 'CatBoost', 'BERT', 'TF-IDF', 'ML'],
      accent: '#4f9cf9',
      featured: false,
    },
    {
      icon: '🤖',
      title: 'Gen-AI Supply Chain Agents',
      desc: 'Multi-agent system at Walmart using LangGraph/Strand for automated seller onboarding and sourcing decision transparency. Includes context engineering, MCP integration, and a Redis + Elasticsearch RAG backend.',
      tech: ['LangGraph', 'Strand', 'Redis', 'Elasticsearch', 'MCP', 'RAG'],
      accent: '#a78bfa',
      featured: true,
    },
    {
      icon: '⚡',
      title: 'Probabilistic Delivery Simulation',
      desc: 'Simulation system combining probabilistic modeling, historical delivery actuals, and speed prediction models to improve delivery date promise accuracy. Implemented and launched solver to production.',
      tech: ['Python', 'Java', 'Spring Boot', 'Kafka', 'Statistics'],
      accent: '#34d399',
      featured: false,
    },
  ];

  return (
    <div className="app" ref={appRef} onMouseMove={onMouseMove}>
      {/* Cursor glow */}
      <div
        className="cursor-glow"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      {/* Floating NAV */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => scrollTo('home')}>
            <span className="logo-text">CG</span>
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
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-bg-gradient" />
        <div className="hero-grid-overlay" />
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              Available for opportunities
            </div>
            <h1 className="hero-name">
              Chi <span className="name-accent">Gong</span>
            </h1>
            <div className="hero-typewriter">
              <span className="typewriter-prefix">I build </span>
              <span className="typewriter-word">{typewriterText}</span>
              <span className="typewriter-cursor">|</span>
              <span className="typewriter-suffix"> solutions</span>
            </div>
            <p className="hero-sub">
              Software Engineer at <strong>Walmart Supply Chain Technology</strong> — building
              intelligent delivery systems, Gen-AI agents, and real-time data pipelines at scale.
            </p>
            <div className="hero-badges">
              {['Walmart', 'Northeastern University', 'Gen-AI', 'Full Stack'].map(b => (
                <span className="badge" key={b}>{b}</span>
              ))}
            </div>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollTo('experience')}>
                <span>View My Work</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="btn-secondary" onClick={() => scrollTo('contact')}>Get in Touch</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="avatar-glow" />
            <div className="avatar-ring outer">
              <div className="avatar-ring inner">
                <div className="avatar">DG</div>
              </div>
            </div>
            <div className="orbit orbit-1">
              <div className="orbit-dot dot-blue" />
            </div>
            <div className="orbit orbit-2">
              <div className="orbit-dot dot-purple" />
            </div>
            <div className="orbit orbit-3">
              <div className="orbit-dot dot-green" />
            </div>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="section-inner">
          <h2 className="section-title reveal">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="about-grid">
            <div className="about-text reveal">
              <p>
                I'm a Software Engineer at <strong>Walmart's Supply Chain Technology</strong> team,
                where I build systems that power delivery date promises for millions of customers.
                My work spans microservice backends, intelligent AI agents, and real-time dashboards.
              </p>
              <p>
                I hold a <strong>Master's in Computer Science from Northeastern University</strong> (GPA 3.9/4.0),
                and I'm passionate about the intersection of distributed systems and applied AI —
                particularly agentic workflows, RAG systems, and multi-agent collaboration.
              </p>
              <p>
                Outside of core engineering, I actively pioneer <strong>AI-augmented developer productivity</strong>,
                building internal knowledge bases and hosting team knowledge-sharing sessions on topics like
                vibe coding, MCP integration, and context engineering.
              </p>
            </div>
            <div className="highlights-grid">
              {highlights.map(({ value, label, color }) => (
                <div className="highlight-card glass reveal" key={label} style={{ '--card-accent': color }}>
                  <div className="highlight-value" style={{ color }}>{value}</div>
                  <div className="highlight-label">{label}</div>
                  <div className="highlight-bar" style={{ background: color }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section section-alt">
        <div className="section-inner">
          <h2 className="section-title reveal">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="skills-grid">
            {Object.entries(skills).map(([category, { color, items }]) => (
              <div className="skill-category glass reveal" key={category} style={{ '--cat-color': color }}>
                <div className="skill-cat-header">
                  <div className="skill-cat-dot" style={{ background: color }} />
                  <h3 className="skill-category-title" style={{ color }}>{category}</h3>
                </div>
                <div className="skill-tags">
                  {items.map(skill => (
                    <span
                      className="skill-tag"
                      key={skill}
                      style={{ '--tag-glow': color }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <div className="section-inner">
          <h2 className="section-title reveal">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <div className="timeline">
            <div className="timeline-line" />
            <div className="timeline-item reveal">
              <div className="timeline-node">
                <div className="timeline-node-inner" />
              </div>
              <div className="timeline-card glass">
                <div className="timeline-card-accent" />
                <div className="timeline-header">
                  <div className="timeline-title-group">
                    <h3 className="timeline-role">Software Engineer</h3>
                    <div className="timeline-company">
                      <span className="company-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="3" width="20" height="18" rx="2" stroke="#4f9cf9" strokeWidth="2"/>
                          <path d="M8 3v18M16 3v18" stroke="#4f9cf9" strokeWidth="2"/>
                        </svg>
                        Walmart — Supply Chain Technology
                      </span>
                    </div>
                  </div>
                  <span className="timeline-date">Jan 2025 – Present</span>
                </div>
                <div className="timeline-tech">
                  {['Java', 'Spring Boot', 'Python', 'Kafka', 'Docker', 'Kubernetes', 'Gen-AI'].map(t => (
                    <span className="tech-tag" key={t}>{t}</span>
                  ))}
                </div>
                <ul className="timeline-bullets">
                  {walmartBullets.map((b, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: b.text }} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section section-alt">
        <div className="section-inner">
          <h2 className="section-title reveal">
            Project <span className="gradient-text">Work</span>
          </h2>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div
                className={`project-card glass reveal ${p.featured ? 'project-featured' : ''}`}
                key={i}
                style={{ '--proj-accent': p.accent, animationDelay: `${i * 0.1}s` }}
              >
                <div className="project-top-border" style={{ background: p.accent }} />
                {p.featured && <div className="project-featured-badge">Featured</div>}
                <div className="project-icon-wrap" style={{ background: `${p.accent}18`, border: `1px solid ${p.accent}40` }}>
                  <span className="project-icon">{p.icon}</span>
                </div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
                <div className="project-tech">
                  {p.tech.map(t => (
                    <span className="tech-tag" key={t} style={{ color: p.accent, background: `${p.accent}15`, borderColor: `${p.accent}40` }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="section">
        <div className="section-inner">
          <h2 className="section-title reveal">
            Edu<span className="gradient-text">cation</span>
          </h2>
          <div className="edu-card glass reveal">
            <div className="edu-icon-wrap">
              <span className="edu-icon">🎓</span>
            </div>
            <div className="edu-info">
              <h3 className="edu-degree">Master of Science in Computer Science</h3>
              <div className="edu-school">Northeastern University, Boston, MA</div>
              <div className="edu-meta">
                <span className="edu-pill">2022 – 2025</span>
                <span className="edu-pill gpa-pill">GPA: 3.9 / 4.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section section-alt">
        <div className="section-inner contact-inner">
          <h2 className="section-title reveal">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="contact-sub reveal">
            Open to new opportunities and conversations. Let's build something great together.
          </p>
          <div className="contact-links">
            <a href="mailto:gongchineu@gmail.com" className="contact-card glass reveal">
              <div className="contact-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="#4f9cf9" strokeWidth="2"/>
                  <path d="M2 8l10 6 10-6" stroke="#4f9cf9" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-value">gongchineu@gmail.com</div>
              </div>
            </a>
            <a href="tel:+12063546356" className="contact-card glass reveal">
              <div className="contact-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="contact-label">Phone</div>
                <div className="contact-value">(206) 354-6356</div>
              </div>
            </a>
            <a href="https://www.linkedin.com/in/chi-gong" className="contact-card glass reveal" target="_blank" rel="noreferrer">
              <div className="contact-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="4" stroke="#34d399" strokeWidth="2"/>
                  <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4M11 10v7" stroke="#34d399" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
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
        <div className="footer-gradient-line" />
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">CG</span>
            <span>Chi Gong — Software Engineer</span>
          </div>
          <div className="footer-links">
            <a href="mailto:gongchineu@gmail.com">Email</a>
            <a href="https://www.linkedin.com/in/chi-gong" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
          <p className="footer-copy">© 2025 Chi Gong · Built with React</p>
        </div>
      </footer>

      {/* Back to top */}
      {showBackTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;
