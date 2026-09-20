import React from 'react';
import Footer from '../../components/layout/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--maroon, #5A0F2E) 0%, var(--royal, #3A1C71) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 12px',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%',
        padding: '16px 0'
      }}>
        {children}
      </div>
      <Footer minimal={true} />
    </div>
  );
}
