import { PAYMENT_STATUSES, JOB_WORKFLOW_STATUSES } from '../data/categories';

export const PaymentStatusBadge = ({ status }) => {
  const found = PAYMENT_STATUSES.find(s => s.id === status) || {
    label: status,
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.15)',
    dot: '⚪'
  };

  return (
    <span
      className="badge"
      style={{
        color: found.color,
        backgroundColor: found.bg,
        border: `1px solid ${found.color}40`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.75rem',
        fontWeight: 600,
        padding: '3px 8px',
        borderRadius: '9999px',
        whiteSpace: 'nowrap'
      }}
    >
      <span style={{ fontSize: '0.7rem' }}>{found.dot}</span>
      {found.label}
    </span>
  );
};

export const WorkflowStatusBadge = ({ status }) => {
  const found = JOB_WORKFLOW_STATUSES.find(s => s.id === status) || {
    label: status,
    color: '#94a3b8'
  };

  return (
    <span
      className="badge"
      style={{
        color: found.color,
        backgroundColor: `${found.color}18`,
        border: `1px solid ${found.color}35`,
        fontSize: '0.75rem',
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: found.color }}></span>
      {found.label}
    </span>
  );
};
