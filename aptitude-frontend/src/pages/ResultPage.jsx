import "./ResultPage.css";

const CATEGORY_COLORS = {
  Investigative: "#3b82f6", Realistic: "#ef4444", Conventional: "#22c55e",
  Enterprising: "#f97316", Artistic: "#8b5cf6", Social: "#14b8a6",
};

const TRAITS = {
  Investigative: ["Deeply analytical and logical", "Naturally curious about how things work", "Prefers working independently on complex problems", "Drawn to research, data, and evidence", "Thinks carefully before acting", "Values knowledge and intellectual challenge"],
  Realistic: ["Practical and results-oriented", "Prefers hands-on work over theory", "Mechanically and spatially aware", "Reliable and straightforward", "Comfortable working with tools and systems", "Values concrete, tangible outcomes"],
  Artistic: ["Highly imaginative and original", "Expresses ideas through creative mediums", "Thrives with freedom and minimal structure", "Emotionally perceptive and sensitive", "Drawn to aesthetics, design, and storytelling", "Values self-expression and creativity"],
  Social: ["Empathetic and people-oriented", "Natural communicator and listener", "Motivated by helping and supporting others", "Works well in teams and collaborative settings", "Values relationships and human connection", "Finds meaning in making a difference"],
  Enterprising: ["Ambitious and goal-driven", "Natural leader and persuader", "Comfortable taking initiative and risks", "Energised by competition and challenge", "Strong communicator and negotiator", "Values achievement, influence, and growth"],
  Conventional: ["Detail-oriented and precise", "Thrives in structured, organised environments", "Reliable, consistent, and methodical", "Strong with numbers, data, and systems", "Follows through on commitments", "Values accuracy, order, and efficiency"],
};

const STRENGTHS = {
  Investigative: ["Deep focus and concentration", "Strong problem-solving ability", "Independent thinking and self-direction"],
  Realistic: ["Practical execution and follow-through", "Technical and mechanical aptitude", "Dependability and consistency"],
  Artistic: ["Original thinking and creative vision", "Strong aesthetic sensibility", "Ability to communicate ideas vividly"],
  Social: ["Emotional intelligence and empathy", "Strong interpersonal communication", "Natural ability to motivate and support others"],
  Enterprising: ["Leadership and decisiveness", "Persuasion and influencing ability", "High drive and resilience under pressure"],
  Conventional: ["Precision and attention to detail", "Strong organisational ability", "Consistency and reliability in execution"],
};

const CHALLENGES = {
  Investigative: ["Can overthink decisions", "May struggle with routine or repetitive tasks"],
  Realistic: ["May find abstract or theoretical tasks frustrating", "Can be resistant to change or new ideas"],
  Artistic: ["Unstructured environments can lead to inconsistency", "May find highly rigid or rule-bound work draining"],
  Social: ["Can take on too much for others at personal cost", "May avoid necessary conflict or difficult decisions"],
  Enterprising: ["Risk of moving too fast without enough analysis", "Can struggle with patience in slow-moving environments"],
  Conventional: ["May resist ambiguity or open-ended tasks", "Can find highly creative or unstructured roles uncomfortable"],
};

const WORK_ENV = {
  Investigative: "You thrive in environments that reward curiosity and independent thinking — research labs, tech companies, universities, or data-driven organisations. You need intellectual challenge, freedom to explore ideas, and colleagues who value depth over speed.",
  Realistic: "You perform best in structured, practical environments — engineering firms, workshops, construction, manufacturing, or field-based roles. You need clear outcomes, hands-on work, and environments where you can see the results of your effort.",
  Artistic: "You flourish in creative, flexible environments — design studios, media companies, startups, or cultural organisations. You need autonomy, creative freedom, and space to experiment without excessive bureaucracy.",
  Social: "You do best in people-centred environments — schools, hospitals, NGOs, counselling centres, or community organisations. You need meaningful human interaction, collaborative teams, and a sense that your work is making a real difference.",
  Enterprising: "You are energised by fast-paced, goal-oriented environments — startups, sales organisations, consulting firms, or leadership roles in any sector. You need challenge, autonomy, and the ability to influence decisions.",
  Conventional: "You excel in structured, well-organised environments — banks, accounting firms, government offices, or large corporations with clear processes. You need clear expectations, defined roles, and environments where precision is valued.",
};

const AVOID_CAREERS = {
  Investigative: ["Sales representative", "Event coordinator", "Professional entertainer", "Routine data entry clerk"],
  Realistic: ["Professional counsellor", "Public relations manager", "Abstract researcher", "Fine arts professional"],
  Artistic: ["Auditor or tax accountant", "Quality control inspector", "Routine administrative officer", "Assembly line supervisor"],
  Social: ["Isolated research scientist", "Financial auditor", "Machine operator", "Independent technical analyst"],
  Enterprising: ["Routine clerical worker", "Laboratory researcher", "Detailed financial analyst", "Assembly technician"],
  Conventional: ["Professional artist", "Freelance creative", "Startup founder", "Abstract philosopher or theorist"],
};

export default function ResultPage({ result, onDownloadPDF, onRetake }) {
  const primary = result.primary_type;
  const traits = TRAITS[primary] || [];
  const strengths = STRENGTHS[primary] || [];
  const challenges = CHALLENGES[primary] || [];
  const workEnv = WORK_ENV[primary] || "";
  const avoidCareers = AVOID_CAREERS[primary] || [];

  return (
    <div className="result-page">
      <header className="cc-header">
        <span className="cc-logo">Beacon</span>
        <div className="cc-header-center">
          <h1>Beacon Personality &amp; Career Report</h1>
          <p>{result.name} • {result.class_level} • {result.stream}</p>
          <p style={{fontSize:"12px", color:"#64748b"}}>{new Date().toISOString()}</p>
        </div>
        <button className="btn-outline" onClick={onDownloadPDF}>↓ Download PDF</button>
      </header>

      <div className="result-container">

        {/* Personality Overview */}
        <section className="result-section">
          <h2 className="section-title">Personality Overview</h2>
          <div className="overview-layout">
            <div className="overview-left">
              <span className="primary-type" style={{color: CATEGORY_COLORS[primary] || "#3b82f6"}}>{primary}</span>
              <p className="secondary-type">Secondary: <strong>{result.secondary_type}</strong></p>
              <div className="holland-code">
                <span className="hc-label">Holland Code</span>
                <span className="hc-value">{result.holland_code}</span>
              </div>
            </div>
            <div className="overview-right">
              <p className="description-text">{result.description}</p>
            </div>
          </div>

          {/* Scores */}
          <div className="scores-section">
            <p className="scores-title">RIASEC Scores</p>
            {result.scores.map(item => (
              <div key={item.category} className="score-row">
                <span className="score-label">{item.category}</span>
                <div className="score-bar-wrap">
                  <div className="score-bar-fill" style={{width:`${item.score}%`, background: CATEGORY_COLORS[item.category] || "#3b82f6"}}/>
                </div>
                <span className="score-pct">{item.score}%</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Personality Traits */}
        <section className="result-section">
          <h2 className="section-title">Your Personality Traits</h2>
          <p className="section-sub">People with a <strong>{primary}</strong> personality type typically show these characteristics:</p>
          <div className="traits-grid">
            {traits.map((trait, i) => (
              <div key={i} className="trait-chip">
                <span className="trait-dot" style={{background: CATEGORY_COLORS[primary]}}/>
                {trait}
              </div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Strengths and Challenges */}
        <section className="result-section">
          <h2 className="section-title">Strengths &amp; Challenges</h2>
          <div className="sc-layout">
            <div className="sc-card strengths-card">
              <h3>✓ Your strengths</h3>
              <ul>
                {strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="sc-card challenges-card">
              <h3>⚠ Potential challenges</h3>
              <ul>
                {challenges.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
              <p className="challenge-note">These are natural tendencies, not fixed limitations. Awareness is the first step to growth.</p>
            </div>
          </div>
        </section>

        <hr className="divider"/>

        {/* Ideal work environment */}
        <section className="result-section">
          <h2 className="section-title">Your Ideal Work Environment</h2>
          <div className="work-env-card">
            <p>{workEnv}</p>
          </div>
        </section>

        <hr className="divider"/>

        {/* Top Career Matches */}
        <section className="result-section">
          <h2 className="section-title">Top 3 Career Matches</h2>
          <p className="section-sub">These careers are matched to your Holland Code <strong>{result.holland_code}</strong> and stream <strong>{result.stream}</strong>.</p>
          {result.careers.map((career, i) => (
            <div key={i} className="career-card">
              <div className="career-header">
                <div>
                  <h3>{i + 1}. {career.title}</h3>
                  <span className="stream-tag">{career.stream}</span>
                </div>
                <div className="career-right">
                  <span className="salary">{career.salary}</span>
                  <span className="salary-label">Expected salary range</span>
                </div>
              </div>
              <p className="career-reason">{career.reason}</p>
            </div>
          ))}
        </section>

        <hr className="divider"/>

        {/* Careers to avoid */}
        <section className="result-section">
          <h2 className="section-title">Careers Less Suited to You</h2>
          <p className="section-sub">Based on your personality profile, these career paths may feel draining or misaligned with how you naturally work. This does not mean you cannot do them — only that they may require more effort to sustain long-term.</p>
          <div className="avoid-grid">
            {avoidCareers.map((c, i) => (
              <div key={i} className="avoid-chip">✗ {c}</div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Entrance Exams */}
        <section className="result-section">
          <h2 className="section-title">Entrance Exams to Target</h2>
          <p className="section-sub">Based on your stream ({result.stream}) and career direction, these are the key exams to prepare for:</p>
          <div className="exam-grid">
            {result.entrance_exams.map((exam, i) => (
              <div key={i} className="exam-card">
                <h4>{exam.name}</h4>
                <p>{exam.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Skills */}
        <section className="result-section">
          <h2 className="section-title">Skills to Build Now</h2>
          <p className="section-sub">Start developing these skills before Class 12 ends — they will strengthen both your applications and your confidence:</p>
          <div className="skills-grid">
            {result.skills_to_build.map((skill, i) => (
              <div key={i} className="skill-card">
                <h4>{skill.name}</h4>
                <p>{skill.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Closing Note */}
        <section className="result-section">
          <h2 className="section-title">A Note for You</h2>
          <div className="closing-card">
            <div className="closing-accent" style={{background: CATEGORY_COLORS[primary]}}/>
            <p className="closing-text">{result.closing_note}</p>
            <p className="closing-footer">Remember — this report is a starting point, not a verdict. Career paths are rarely straight lines. Use this as a guide to explore, ask questions, and make informed choices. You have time.</p>
          </div>
        </section>

        {/* Footer */}
        <div className="result-footer">
          <p>Beacon © 2026 — This report is an illustrative guide based on a psychometric assessment. For personalised counselling, contact a qualified career counsellor.</p>
          <div className="footer-actions">
            <button className="btn-primary" onClick={onDownloadPDF}>↓ Download PDF Report</button>
            <button className="btn-ghost" onClick={onRetake}>Take Test Again</button>
          </div>
        </div>

      </div>
    </div>
  );
}