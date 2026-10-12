import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Reusable Alert component for notifications, errors, and success feedback
 */
export const Alert = ({
  type = 'info', // 'info' | 'success' | 'warning' | 'error'
  message,
  children,
  onClose,
  className = ''
}) => {
  const icons = {
    info: <Info size={18} style={{ flexShrink: 0 }} />,
    success: <CheckCircle size={18} style={{ flexShrink: 0 }} />,
    warning: <AlertTriangle size={18} style={{ flexShrink: 0 }} />,
    error: <AlertCircle size={18} style={{ flexShrink: 0 }} />
  };

  return (
    <div className={`alert alert-${type} ${className}`} role="alert">
      {icons[type]}
      <div style={{ flex: 1 }}>{message || children}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Close alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
