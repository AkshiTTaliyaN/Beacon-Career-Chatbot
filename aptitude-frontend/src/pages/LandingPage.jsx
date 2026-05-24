import "./LandingPage.css";

const FAQS = [
  { q: "Is this test free?", a: "Yes, completely free. No login, no payment, no hidden charges." },
  { q: "What is a Holland Code?", a: "A Holland Code is a 3-letter combination (like IAS or RCE) that represents your top 3 personality types from the RIASEC model. It is used worldwide to match people to careers that suit them." },
  { q: "How accurate is the RIASEC test?", a: "The RIASEC model was developed by psychologist John Holland and has been validated across decades of research. It is one of the most widely used career assessment frameworks in the world, used by universities, counsellors, and career platforms globally." },
  { q: "What if I don't agree with my result?", a: "Results reflect your answers at this moment. If something feels off, retake the test and answer as honestly as possible. Avoid choosing what you think sounds good — choose what genuinely feels like you." },
  { q: "Can Class 10 students take this test?", a: "Absolutely. This test is designed for students in Class 10, 11, and 12 who are exploring streams and career options." },
  { q: "Will this tell me exactly what to do with my life?", a: "No — and no test can. This report gives you a strong, evidence-based starting point. Use it as a guide to explore, not a final verdict." },
];

export default function LandingPage({ onStart }) {
  return (
    <div className="landing">
      <header className="cc-header">
        <span className="cc-logo">CareerCompass</span>
        <nav className="landing-nav">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badges">
          <span className="badge">✓ Psychometric test with detailed report</span>
          <span className="badge">✓ No counsellor booking or calls needed</span>
          <span className="badge">✓ Completely free</span>
        </div>
        <div className="hero-cta-card">
          <h2>Find what career suits you</h2>
          <p>Answer 60 questions based on the globally recognised RIASEC framework and discover your personality type, matching careers, entrance exams, and a personalised roadmap.</p>
          <button className="btn-primary btn-large" onClick={onStart}>Take the Test →</button>
        </div>
      </section>

      {/* What is RIASEC */}
      <section className="content-section">
        <div className="section-inner">
          <h2 className="section-heading">What is the RIASEC Test?</h2>
          <p className="section-body">
            The RIASEC model — developed by psychologist <strong>John L. Holland</strong> — is one of the most widely researched and used career assessment frameworks in the world.
            It classifies personalities into six types: <strong>Realistic, Investigative, Artistic, Social, Enterprising,</strong> and <strong>Conventional</strong>.
          </p>
          <p className="section-body">
            This model is used by universities, career counsellors, and platforms across the globe — including the US Department of Labor's O*NET system — to help people identify careers that align with who they genuinely are, not just what sounds impressive.
            Your combination of these six types produces a <strong>Holland Code</strong> (e.g. IAS, RCE) which maps directly to careers, streams, and study pathways.
          </p>
          <div className="riasec-types">
            {[
              { code: "R", name: "Realistic", desc: "Practical, hands-on, mechanical" },
              { code: "I", name: "Investigative", desc: "Analytical, curious, research-oriented" },
              { code: "A", name: "Artistic", desc: "Creative, expressive, imaginative" },
              { code: "S", name: "Social", desc: "Empathetic, collaborative, people-focused" },
              { code: "E", name: "Enterprising", desc: "Ambitious, persuasive, leadership-driven" },
              { code: "C", name: "Conventional", desc: "Organised, precise, detail-oriented" },
            ].map(t => (
              <div key={t.code} className="type-pill">
                <span className="type-code">{t.code}</span>
                <div>
                  <strong>{t.name}</strong>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="stat"><strong>6</strong><span>Personality dimensions</span></div>
        <div className="stat-divider"/>
        <div className="stat"><strong>60</strong><span>Carefully designed questions</span></div>
        <div className="stat-divider"/>
        <div className="stat"><strong>Globally validated</strong><span>Used worldwide as a career standard</span></div>
        <div className="stat-divider"/>
        <div className="stat"><strong>Instant report</strong><span>No waiting, no login needed</span></div>
      </section>

      {/* How it works */}
      <section className="content-section alt-bg">
        <div className="section-inner">
          <h2 className="section-heading">How it works</h2>
          <div className="steps-row">
            <div className="step-card">
              <div className="step-num">1</div>
              <h3>Take the test</h3>
              <p>Answer 60 statements honestly on a 1–5 scale. Takes about 10–15 minutes. No right or wrong answers.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-num">2</div>
              <h3>Get your Holland Code</h3>
              <p>Your answers are scored across all 6 RIASEC dimensions to generate your unique 3-letter personality code.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-num">3</div>
              <h3>See your report</h3>
              <p>Get matched careers, salary ranges, entrance exams, skills to build, and a full personalised report you can download.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll get */}
      <section className="content-section">
        <div className="section-inner">
          <h2 className="section-heading">What your report includes</h2>
          <div className="report-grid">
            {[
              { icon: "🧠", title: "Personality breakdown", desc: "Your primary and secondary personality types explained in detail with traits, strengths, and work style." },
              { icon: "📊", title: "RIASEC score chart", desc: "A visual breakdown of your scores across all 6 personality dimensions with percentages." },
              { icon: "💼", title: "Top 3 career matches", desc: "Careers that fit your personality, with salary ranges, required stream, and why each is a strong match for you." },
              { icon: "📝", title: "Entrance exams to target", desc: "The key exams you should be preparing for based on your stream and career direction." },
              { icon: "🛠️", title: "Skills to build now", desc: "A personalised list of skills and resources to start developing right away, before Class 12 ends." },
              { icon: "📄", title: "Downloadable PDF report", desc: "A professionally formatted report you can save, print, and share with parents or teachers." },
            ].map((item, i) => (
              <div key={i} className="report-card">
                <span className="report-icon">{item.icon}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="cta-bottom">
            <button className="btn-primary btn-large" onClick={onStart}>Start the Test →</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="content-section alt-bg">
        <div className="section-inner">
          <h2 className="section-heading">Frequently asked questions</h2>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <h4 className="faq-q">{faq.q}</h4>
                <p className="faq-a">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>CareerCompass © 2026 — A psychometric career guidance tool for Indian students.</p>
      </footer>
    </div>
  );
}