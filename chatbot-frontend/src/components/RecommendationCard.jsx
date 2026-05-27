import React from 'react';

function RecommendationCard({ node, onHandoff, onReset }) {
  if (!node) return null;

  return (
    <div className="recommendation-card">
      <div className="rec-header">
        <div className="rec-badge">✓</div>
        <div>
          <div className="rec-title">{node.title || node.question}</div>
          <div className="rec-subtitle">Recommended career path</div>
        </div>
      </div>

      {node.description && (
        <div className="rec-description">
          {node.description.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {node.careers && (
        <div className="rec-section">
          <div className="rec-section-header">
            <div>Suggested Careers</div>
            <div className="section-icon">💼</div>
          </div>
          <div className="career-scroll">
            {node.careers.slice(0, 5).map((career) => (
              <div key={career.name} className="career-card">
                <div className="career-card-title">{career.name}</div>
                <div className="career-card-meta">
                  <span className="salary-badge">{career.salary || '₹4-12 LPA'}</span>
                  <span className="stream-tag">{career.stream || 'PCM'}</span>
                </div>
                <p>{career.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {node.exams && (
        <div className="rec-section">
          <div className="rec-section-header">
            <div>Key Exams</div>
            <div className="section-icon">📝</div>
          </div>
          <div className="exam-table">
            <div className="exam-row exam-row-head">
              <div>Exam</div>
              <div>Month</div>
              <div>What it leads to</div>
            </div>
            {node.exams.slice(0, 5).map((exam) => (
              <div key={exam.name} className="exam-row">
                <div>{exam.name}</div>
                <div>{exam.month || exam.full_form || 'TBD'}</div>
                <div>{exam.what_it_leads_to || exam.conducting_body || 'Admission guidance'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {node.next_steps && (
        <div className="rec-section">
          <div className="rec-section-header">
            <div>Next Steps</div>
            <div className="section-icon">🚀</div>
          </div>
          <div className="next-steps-list">
            {node.next_steps.slice(0, 4).map((step, index) => (
              <div key={index} className="next-step-item">
                <div className="step-number">{index + 1}</div>
                <div>{step}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {node.timeline && (
        <div className="rec-section">
          <div className="rec-section-header">
            <div>Timeline</div>
            <div className="section-icon">🗓️</div>
          </div>
          <div className="timeline-steps">
            {String(node.timeline)
              .split('.')
              .filter((part) => part.trim())
              .slice(0, 4)
              .map((part, index) => (
                <div key={index} className="timeline-step">
                  <div className="timeline-dot" />
                  <span>{part.trim()}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="rec-actions">
        <button className="btn-primary" onClick={onHandoff}>Talk to a Counsellor</button>
        <button className="btn-secondary" onClick={onReset}>Start Over</button>
      </div>
    </div>
  );
}

export default RecommendationCard;
