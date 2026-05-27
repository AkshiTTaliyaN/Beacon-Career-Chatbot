import React from 'react';

function HandoffModal({ open, onClose, node }) {
  if (!open) return null;
  return (
    <div className="handoff-modal-backdrop">
      <div className="handoff-modal">
        <div className="modal-header">
          <div className="modal-icon">💬</div>
          <div>
            <h3>Connect with a counsellor</h3>
            <p>Choose the best way to reach out for personalised help.</p>
          </div>
        </div>
        <div className="modal-card-grid">
          {node?.contact_options?.map((c) => {
            const lower = c.type?.toLowerCase();
            return (
              <a
                key={c.type}
                href={c.value}
                target="_blank"
                rel="noreferrer"
                className={`modal-contact-card modal-${lower}`}
              >
                <div className="modal-card-icon">
                  {lower === 'whatsapp' ? '💚' : lower === 'call' ? '📞' : '✉️'}
                </div>
                <div>
                  <strong>{c.label}</strong>
                  <p>{c.value}</p>
                </div>
              </a>
            );
          })}
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default HandoffModal;
