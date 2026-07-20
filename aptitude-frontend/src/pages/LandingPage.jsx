import { Brain, BarChart3, Briefcase, FileText, Wrench, Download, Compass, Users, Lightbulb, MapPin, Sparkles, Heart } from "lucide-react";
import heroImage from "../assets/hero.webp";
import "./LandingPage.css";
import { RIASEC_COLORS } from "../constants/riasecColors";
import { motion } from "framer-motion";
import HeroBanner from "../components/ui/HeroBanner";
import GlassCard from "../components/ui/GlassCard";
import ManzilHeader from "../components/ManzilHeader";
import BilingualText from "../components/BilingualText";

const RIASEC_TYPES = [
  { code: "R", name: "Realistic", desc: "Practical, hands-on, mechanical", color: RIASEC_COLORS.R },
  { code: "I", name: "Investigative", desc: "Analytical, curious, research-oriented", color: RIASEC_COLORS.I },
  { code: "A", name: "Artistic", desc: "Creative, expressive, imaginative", color: RIASEC_COLORS.A },
  { code: "S", name: "Social", desc: "Empathetic, collaborative, people-focused", color: RIASEC_COLORS.S },
  { code: "E", name: "Enterprising", desc: "Ambitious, persuasive, leadership-driven", color: RIASEC_COLORS.E },
  { code: "C", name: "Conventional", desc: "Organised, precise, detail-oriented", color: RIASEC_COLORS.C },
];

// The four sections of the assessment, in the order the student meets them.
const TEST_SECTIONS = [
  { num: "1", name: "Personality", count: "60 questions", desc: "The RIASEC framework, which maps how you like to work to real careers." },
  { num: "2", name: "Interests", count: "Select from 51", desc: "Your hobbies and interests outside academics, which surface career paths your personality type alone would miss." },
  { num: "3", name: "Aptitude", count: "18 questions", desc: "How confident you feel across six skill areas: English, patterns, logic, maths, visual thinking, and attention to detail." },
  { num: "4", name: "Personality style", count: "20 statements", desc: "The Big Five (OCEAN) model, which describes how you naturally think, feel, and work day to day." },
];

// Data-storage answer differs by deployment, because what actually happens
// differs. Standalone stores nothing off-device. The portal writes scores to
// the student's Manzil profile. Saying "we store nothing" in both would be
// false in one of them.
const DATA_FAQ_STANDALONE = "Your report is saved only in this browser, on this device, so you can come back to it later. It is not sent to an account, shared, or sold. Clearing your browser data deletes it. Your name and details appear only on your own report.";
const DATA_FAQ_PORTAL = "Your answers are scored on our server and your results are saved to your Lakshayaveer student profile, so your dashboard and counsellor can use them. We do not sell your information or share it outside Lakshayaveer.";

function buildFaqs(standalone) {
  return [
    { q: "Is this test free?", a: "Yes, completely free. No payment, no hidden charges. You can take the test as many times as you want." },
    { q: "What does the test actually measure?", a: "Four things: your RIASEC personality type, your interests and hobbies, your self-rated aptitude across six skill areas, and your Big Five personality style. Together these describe both what suits you and how you naturally work." },
    { q: "What is a Holland Code?", a: "A Holland Code is a 3-letter combination (like IAS or RCE) that represents your top 3 personality types from the RIASEC model. It is used worldwide to match people to careers that genuinely suit them." },
    { q: "What is the Big Five (OCEAN)?", a: "The Big Five is the most widely researched model of personality in psychology. It describes your natural working style rather than your ability, so there are no good or bad scores. It sits alongside your career direction in the report, it does not change your career recommendations." },
    { q: "How accurate is the RIASEC test?", a: "The RIASEC model was developed by psychologist John Holland and has been validated across decades of research. It is one of the most widely used career assessment frameworks in the world, used by universities, counsellors, and career platforms globally." },
    { q: "What if I don't agree with my result?", a: "Results reflect your answers at this moment. If something feels off, retake the test and answer as honestly as possible. Avoid choosing what you think sounds good, choose what genuinely feels like you. Your environment, mood, and recent experiences can also influence answers." },
    { q: "Can Class 10 students take this test?", a: "Absolutely. This test is designed for students in Class 10, 11, and 12 who are exploring streams and career options. Earlier is often better, it gives you more time to plan." },
    { q: "Will this tell me exactly what to do with my life?", a: "No, and no test can. This report gives you a strong, evidence-based starting point. Use it as a guide to explore, not a final verdict. The best career decisions come from a mix of self-awareness, real-world experience, and conversations with mentors." },
    { q: "Is my data stored anywhere?", a: standalone ? DATA_FAQ_STANDALONE : DATA_FAQ_PORTAL },
    { q: "Can I share the report with my parents?", a: "Yes, and we encourage it. The report includes a section specifically written for parents to help them understand your personality type and how to support your career direction." },
  ];
}

export default function LandingPage({
  onStart,
  standalone = false,
  hasReport = false,
  onViewReport,
}) {
  const FAQS = buildFaqs(standalone);

  return (
    <div className="landing">
      <ManzilHeader
        title=""
        subtitle={<BilingualText text="Career Assessment" />}
        standalone={standalone}
        hasReport={hasReport}
        onViewReport={onViewReport}
      />

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <HeroBanner
          onStart={onStart}
          title={<BilingualText text="Find what career truly suits you." />}
          subtitle={<BilingualText text="Answer 98 carefully designed questions across four sections, built on the globally recognised RIASEC framework and the Big Five personality model, and discover your personality type, matching careers, entrance exams, and a personalised roadmap." />}
          badges={[
            <BilingualText key="1" text="Psychometric test with detailed report" inline />,
            <BilingualText key="2" text="No counsellor booking needed" inline />,
            <BilingualText key="3" text="Completely free" inline />,
          ]}
          imageSrc={heroImage}
          ctaText={<BilingualText text="Take the Test →" />}
        >
          <p className="hero-sub-light">
            <BilingualText text="Built on the same psychometric models used by universities, career counsellors, and platforms worldwide, including the US Department of Labor's O*NET system." />
          </p>
        </HeroBanner>
      </motion.div>

      {/* WHAT THE TEST COVERS - four sections */}
      <section className="content-section">
        <div className="section-wide">
          <div className="section-header-row">
            <h2 className="section-heading"><BilingualText text="What the test covers" /></h2>
            <p className="section-tagline"><BilingualText text="Four sections, one report. About 20–25 minutes." /></p>
          </div>
          <div className="steps-row">
            {TEST_SECTIONS.map((s) => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <h3><BilingualText text={s.name} /></h3>
                <p className="step-extra" style={{ fontWeight: 700, color: "#2C5492", marginBottom: "8px" }}>
                  <BilingualText text={s.count} />
                </p>
                <p><BilingualText text={s.desc} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IS RIASEC */}
      <section className="content-section alt-bg">
        <div className="section-wide">
          <div className="section-header-row">
            <h2 className="section-heading"><BilingualText text="What is the RIASEC Test?" /></h2>
            <p className="section-tagline"><BilingualText text="A scientific framework for understanding who you are." /></p>
          </div>
          <div className="riasec-explanation">
            <div className="riasec-text">
              <p className="section-body">
                <BilingualText text="The RIASEC model, developed by psychologist John L. Holland, is one of the most widely researched and used career assessment frameworks in the world. It classifies personalities into six types: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional." />
              </p>
              <p className="section-body">
                <BilingualText text="This model is used by universities, career counsellors, and platforms across the globe, including the US Department of Labor's O*NET system, to help people identify careers that align with who they genuinely are. Your combination of these six types produces a Holland Code (e.g. IAS, RCE) which maps directly to careers, streams, and study pathways." />
              </p>
              <p className="section-body">
                <BilingualText text="Unlike generic personality tests, RIASEC is designed specifically for career fit. It does not ask vague philosophical questions, it asks about activities, preferences, and work styles that directly correlate with real-world professions and industries." />
              </p>
            </div>
            <div className="riasec-types-grid">
              {RIASEC_TYPES.map((t) => (
                <GlassCard key={t.code} className="type-pill apt-type-pill-glass" hover={false}>
                  <div className="type-pill-inner">
                    <span className="type-code" style={{ color: t.color }}>{t.code}</span>
                    <div>
                      <strong><BilingualText text={t.name} /></strong>
                      <p><BilingualText text={t.desc} /></p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BIG FIVE / OCEAN
          Deliberately kept high-level. The trait names are hidden during the
          test itself so students cannot answer "to look good" on a named trait,
          and spelling out all five here with descriptions would partly undo
          that. What it is and why it is there is enough. */}
      <section className="content-section">
        <div className="section-wide">
          <div className="section-header-row">
            <h2 className="section-heading"><BilingualText text="And your personality style" /></h2>
            <p className="section-tagline"><BilingualText text="Not what you should do. How you naturally do it." /></p>
          </div>
          <div className="riasec-text" style={{ maxWidth: "900px" }}>
            <p className="section-body">
              <BilingualText text="RIASEC tells you which kinds of work fit you. It does not tell you how you tend to work: whether you plan ahead or improvise, whether you recharge around people or alone, whether you reach for new ideas or trusted methods." />
            </p>
            <p className="section-body">
              <BilingualText text="The final section of the test uses the Big Five (also called OCEAN), the most widely researched personality model in psychology, to answer exactly that. Your report shows where you sit on five dimensions, each with a short description of what it means for the way you study and work." />
            </p>
            <p className="section-body">
              <BilingualText text="These are styles, not abilities. There is no good or bad score, and none of them make a career unavailable to you. They are there to help you understand yourself and choose environments where you will do well, which is why they sit alongside your career recommendations rather than changing them." />
            </p>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar">
        <div className="section-wide stats-inner">
          <div className="stat"><strong>4</strong><span><BilingualText text="Assessment sections" /></span></div>
          <div className="stat-divider"/>
          <div className="stat"><strong>98</strong><span><BilingualText text="Carefully designed questions" /></span></div>
          <div className="stat-divider"/>
          <div className="stat"><strong><BilingualText text="Globally validated" /></strong><span><BilingualText text="Frameworks used worldwide as a career standard" /></span></div>
          <div className="stat-divider"/>
          <div className="stat"><strong><BilingualText text="Instant" /></strong><span><BilingualText text="No waiting, no login needed" /></span></div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="content-section alt-bg">
        <div className="section-wide">
          <div className="section-header-row">
            <h2 className="section-heading"><BilingualText text="How it works" /></h2>
            <p className="section-tagline"><BilingualText text="Three simple steps from start to your personalised report." /></p>
          </div>
          <div className="steps-row">
            <div className="step-card">
              <div className="step-num">1</div>
              <h3><BilingualText text="Take the test" /></h3>
              <p><BilingualText text="Answer 98 questions honestly across personality, interests, aptitude, and personality style. Takes about 20–25 minutes. There are no right or wrong answers, only honest ones." /></p>
              <p className="step-extra"><BilingualText text="Pick what genuinely reflects you, not what sounds impressive on paper." /></p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <h3><BilingualText text="Get your Holland Code" /></h3>
              <p><BilingualText text="Your answers are scored across all 6 RIASEC dimensions to generate your unique 3-letter personality code (like IAS, RCE, or SAE), and across the 5 Big Five dimensions to describe your working style." /></p>
              <p className="step-extra"><BilingualText text="This code directly maps to careers, work environments, and study paths that genuinely fit who you are." /></p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <h3><BilingualText text="See your full report" /></h3>
              <p><BilingualText text="Get matched careers across multiple sectors, with Indian and international salary ranges, entrance exams, skill roadmap, your personality style, and a parent-friendly explanation." /></p>
              <p className="step-extra"><BilingualText text="Download it as a PDF to save, print, or share with parents and teachers." /></p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOUR REPORT INCLUDES */}
      <section className="content-section">
        <div className="section-wide">
          <div className="section-header-row">
            <h2 className="section-heading"><BilingualText text="What your report includes" /></h2>
            <p className="section-tagline"><BilingualText text="A complete personalised guide, not just a result." /></p>
          </div>
          <div className="report-grid">
            {[
              { icon: Brain, title: "Personality breakdown", desc: "Your primary and secondary personality types explained in detail with traits, strengths, and natural work style. Understand who you are at your core." },
              { icon: BarChart3, title: "RIASEC score chart", desc: "A clear visual breakdown of your scores across all 6 personality dimensions with exact percentages, so you can see where each type ranks." },
              { icon: Sparkles, title: "Your personality style", desc: "Where you sit on the five Big Five (OCEAN) dimensions, each with a plain-language description of what it means for how you study, work, and handle pressure. Styles, not grades." },
              { icon: Briefcase, title: "Career matches across sectors", desc: "Top careers from technology, healthcare, business, creative and more, with Indian salary ranges, international comparisons, and required streams." },
              { icon: Compass, title: "Aptitude snapshot", desc: "Your self-rated confidence across six skill areas, and an honest note on where it supports your career direction and where you may need extra preparation." },
              { icon: FileText, title: "Entrance exams & admissions", desc: "The key exams you should be targeting based on your stream and career direction, along with admission timelines and application guidance." },
              { icon: Wrench, title: "Personalised skill roadmap", desc: "A timeline of skills to build during Class 11, Class 12, and after, with specific resources and starting points for each skill." },
              { icon: Users, title: "Section for your parents", desc: "A clear, jargon-free explanation written for parents to help them understand your personality type and how to best support your career direction." },
              { icon: MapPin, title: "Ideal work environment", desc: "What kind of workplaces, teams, and roles will help you thrive, and which environments will drain you over time." },
              { icon: Lightbulb, title: "Strengths & growth areas", desc: "Your natural strengths to leverage and potential blind spots to develop, based on years of research into personality types." },
              { icon: Download, title: "Downloadable PDF report", desc: "A professionally formatted report you can save, print, and share with parents, teachers, or counsellors any time you need." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="report-card">
                  <div className="report-icon-wrap">
                    <Icon size={26} strokeWidth={1.8}/>
                  </div>
                  <h4><BilingualText text={item.title} /></h4>
                  <p><BilingualText text={item.desc} /></p>
                </div>
              );
            })}
          </div>
          <div className="cta-bottom">
            <button className="btn-primary btn-large" onClick={onStart}><BilingualText text="Start the Test →" /></button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="content-section alt-bg">
        <div className="section-wide">
          <div className="section-header-row">
            <h2 className="section-heading"><BilingualText text="Frequently asked questions" /></h2>
            <p className="section-tagline"><BilingualText text="Frequently asked questions about this assessment." /></p>
          </div>
          <div className="faq-grid">
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <h4 className="faq-q"><BilingualText text={faq.q} /></h4>
                <p className="faq-a"><BilingualText text={faq.a} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="section-wide">
          <p><BilingualText text="Career Guidance Portal © 2026 - A psychometric career guidance platform." /></p>
        </div>
      </footer>
    </div>
  );
}