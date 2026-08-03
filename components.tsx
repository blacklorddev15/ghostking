import React from "react";

export const Button = ({ 
  children, 
  className = "", 
  variant = "primary", 
  ...props 
}: any) => {
  // Use inline styles as fallback
  const styles: any = {
    primary: {
      background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '700',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontSize: '16px',
      width: '100%',
    },
    outline: {
      background: 'transparent',
      color: '#22d3ee',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '700',
      border: '2px solid rgba(6, 182, 212, 0.5)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontSize: '16px',
      width: '100%',
    },
    ghost: {
      background: 'transparent',
      color: '#9ca3af',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '700',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontSize: '16px',
      width: '100%',
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '700',
      border: '1px solid rgba(239, 68, 68, 0.5)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontSize: '16px',
      width: '100%',
    },
  };

  const style = styles[variant] || styles.primary;

  return (
    <button 
      style={style}
      className={className}
      {...props}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 0 40px rgba(6, 182, 212, 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.3)';
        }
      }}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", ...props }: any) => (
  <div 
    style={{
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
    }}
    className={className}
    {...props}
  >
    {children}
  </div>
);

export const Input = ({ className = "", ...props }: any) => (
  <input 
    style={{
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(0, 0, 0, 0.6)',
      color: 'white',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontSize: '16px',
    }}
    className={className}
    {...props} 
  />
);