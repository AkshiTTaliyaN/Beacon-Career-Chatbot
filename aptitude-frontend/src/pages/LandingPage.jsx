import { Brain, BarChart3, Briefcase, FileText, Wrench, Download, Compass, Users, Lightbulb, MapPin } from "lucide-react";
import heroImage from "../assets/hero.jpg";
import "./LandingPage.css";
import { RIASEC_COLORS } from "../constants/riasecColors";

const RIASEC_TYPES = [
  { code: "R", name: "Realistic", desc: "Practical, hands-on, mechanical", color: RIASEC_COLORS.R },
  { code: "I", name: "Investigative", desc: "Analytical, curious, research-oriented", color: RIASEC_COLORS.I },
  { code: "A", name: "Artistic", desc: "Creative, expressive, imaginative", color: RIASEC_COLORS.A },
  { code: "S", name: "Social", desc: "Empathetic, collaborative, people-focused", color: RIASEC_COLORS.S },
  { code: "E", name: "Enterprising", desc: "Ambitious, persuasive, leadership-driven", color: RIASEC_COLORS.E },
  { code: "C", name: "Conventional", desc: "Organised, precise, detail-oriented", color: RIASEC_COLORS.C },
];

const FAQS = [
  { q: "Is this test free?", a: "Yes, completely free. No login, no payment, no hidden charges. You can take the test as many times as you want." },
  { q: "What is a Holland Code?", a: "A Holland Code is a 3-letter combination (like IAS or RCE) that represents your top 3 personality types from the RIASEC model. It is used worldwide to match people to careers that genuinely suit them." },
  { q: "How accurate is the RIASEC test?", a: "The RIASEC model was developed by psychologist John Holland and has been validated across decades of research. It is one of the most widely used career assessment frameworks in the world, used by universities, counsellors, and career platforms globally." },
  { q: "What if I don't agree with my result?", a: "Results reflect your answers at this moment. If something feels off, retake the test and answer as honestly as possible. Avoid choosing what you think sounds good — choose what genuinely feels like you. Your environment, mood, and recent experiences can also influence answers." },
  { q: "Can Class 10 students take this test?", a: "Absolutely. This test is designed for students in Class 10, 11, and 12 who are exploring streams and career options. Earlier is often better — it gives you more time to plan." },
  { q: "Will this tell me exactly what to do with my life?", a: "No — and no test can. This report gives you a strong, evidence-based starting point. Use it as a guide to explore, not a final verdict. The best career decisions come from a mix of self-awareness, real-world experience, and conversations with mentors." },
  { q: "Is my data stored anywhere?", a: "Your name and details only appear on your personalised report. We do not store, share, or sell your information. The test runs entirely in your browser and on our server during the session." },
  { q: "Can I share the report with my parents?", a: "Yes — and we encourage it. The report includes a section specifically written for parents to help them understand your personality type and how to support your career direction." },
];

export default function LandingPage({ onStart }) {
  return (
    <div className="landing">
      <header className="cc-header">
        <span className="cc-logo">Beacon</span>
        <nav className="landing-nav">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      {/* HERO — full width split layout */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badges">
            <span className="badge">Psychometric test with detailed report</span>
            <span className="badge">No counsellor booking needed</span>
            <span className="badge">Completely free</span>
          </div>
          <h1 className="hero-title">Find what career truly suits you.</h1>
          <p className="hero-sub">
            Answer 60 carefully designed questions based on the globally recognised RIASEC framework and discover your personality type, matching careers, entrance exams, and a personalised roadmap for your future.
          </p>
          <p className="hero-sub-light">
            Built on the same psychometric model used by universities, career counsellors, and platforms worldwide — including the US Department of Labor's O*NET system.
          </p>
          <button className="btn-primary btn-large" onClick={onStart}>Take the Test →</button>
        </div>
        <div className="hero-image-wrap">
          <img src={heroImage} alt="Student exploring career options" />
        </div>
      </section>

      {/* WHAT IS RIASEC — wider, left aligned */}
      <section className="content-section">
        <div className="section-wide">
          <div className="section-header-row">
            <h2 className="section-heading">What is the RIASEC Test?</h2>
            <p className="section-tagline">A scientific framework for understanding who you are.</p>
          </div>
          <div className="riasec-explanation">
            <div className="riasec-text">
              <p className="section-body">
                The RIASEC model — developed by psychologist <strong>John L. Holland</strong> — is one of the most widely researched and used career assessment frameworks in the world.
                It classifies personalities into six types: <strong>Realistic, Investigative, Artistic, Social, Enterprising,</strong> and <strong>Conventional</strong>.
              </p>
              <p className="section-body">
                This model is used by universities, career counsellors, and platforms across the globe — including the US Department of Labor's O*NET system — to help people identify careers that align with who they genuinely are.
                Your combination of these six types produces a <strong>Holland Code</strong> (e.g. IAS, RCE) which maps directly to careers, streams, and study pathways.
              </p>
              <p className="section-body">
                Unlike generic personality tests, RIASEC is designed specifically for career fit. It does not ask vague philosophical questions — it asks about activities, preferences, and work styles that directly correlate with real-world professions and industries.
              </p>
            </div>
            <div className="riasec-types-grid">
              {RIASEC_TYPES.map(t => (
                <div key={t.code} className="type-pill">
                  <span className="type-code" style={{ color: t.color }}>{t.code}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <p>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar">
        <div className="section-wide stats-inner">
          <div className="stat"><strong>6</strong><span>Personality dimensions</span></div>
          <div className="stat-divider"/>
          <div className="stat"><strong>60</strong><span>Carefully designed questions</span></div>
          <div className="stat-divider"/>
          <div className="stat"><strong>Globally validated</strong><span>Used worldwide as a career standard</span></div>
          <div className="stat-divider"/>
          <div className="stat"><strong>Instant</strong><span>No waiting, no login needed</span></div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="content-section alt-bg">
        <div className="section-wide">
          <div className="section-header-row">
            <h2 className="section-heading">How it works</h2>
            <p className="section-tagline">Three simple steps from start to your personalised report.</p>
          </div>
          <div className="steps-row">
            <div className="step-card">
              <div className="step-num">1</div>
              <h3>Take the test</h3>
              <p>Answer 60 statements honestly on a 1–5 scale (Strongly Disagree to Strongly Agree). Takes about 10–15 minutes. There are no right or wrong answers — only honest ones.</p>
              <p className="step-extra">Pick what genuinely reflects you, not what sounds impressive on paper.</p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <h3>Get your Holland Code</h3>
              <p>Your answers are scored across all 6 RIASEC dimensions to generate your unique 3-letter personality code (like IAS, RCE, or SAE).</p>
              <p className="step-extra">This code directly maps to careers, work environments, and study paths that genuinely fit who you are.</p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <h3>See your full report</h3>
              <p>Get matched careers across multiple sectors, with Indian and international salary ranges, entrance exams, skill roadmap, and a parent-friendly explanation.</p>
              <p className="step-extra">Download it as a PDF to save, print, or share with parents and teachers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOUR REPORT INCLUDES */}
      <section className="content-section">
        <div className="section-wide">
          <div className="section-header-row">
            <h2 className="section-heading">What your report includes</h2>
            <p className="section-tagline">A complete personalised guide, not just a result.</p>
          </div>
          <div className="report-grid">
            {[
              { icon: Brain, title: "Personality breakdown", desc: "Your primary and secondary personality types explained in detail with traits, strengths, and natural work style. Understand who you are at your core." },
              { icon: BarChart3, title: "RIASEC score chart", desc: "A clear visual breakdown of your scores across all 6 personality dimensions with exact percentages, so you can see where each type ranks." },
              { icon: Briefcase, title: "Career matches across sectors", desc: "Top careers from technology, healthcare, business, creative and more — with Indian salary ranges, international comparisons, and required streams." },
              { icon: FileText, title: "Entrance exams & admissions", desc: "The key exams you should be targeting based on your stream and career direction, along with admission timelines and application guidance." },
              { icon: Wrench, title: "Personalised skill roadmap", desc: "A timeline of skills to build during Class 11, Class 12, and after — with specific resources and starting points for each skill." },
              { icon: Users, title: "Section for your parents", desc: "A clear, jargon-free explanation written for parents to help them understand your personality type and how to best support your career direction." },
              { icon: MapPin, title: "Ideal work environment", desc: "What kind of workplaces, teams, and roles will help you thrive — and which environments will drain you over time." },
              { icon: Lightbulb, title: "Strengths & growth areas", desc: "Your natural strengths to leverage and potential blind spots to develop, based on years of research into personality types." },
              { icon: Download, title: "Downloadable PDF report", desc: "A professionally formatted report you can save, print, and share with parents, teachers, or counsellors any time you need." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="report-card">
                  <div className="report-icon-wrap">
                    <Icon size={26} strokeWidth={1.8}/>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="cta-bottom">
            <button className="btn-primary btn-large" onClick={onStart}>Start the Test →</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="content-section alt-bg">
        <div className="section-wide">
          <div className="section-header-row">
            <h2 className="section-heading">Frequently asked questions</h2>
            <p className="section-tagline">Everything students and parents commonly ask about Beacon.</p>
          </div>
          <div className="faq-grid">
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
        <div className="section-wide">
          <p>Beacon © 2026 — A psychometric career guidance platform for Indian students.</p>
        </div>
      </footer>
    </div>
  );
}