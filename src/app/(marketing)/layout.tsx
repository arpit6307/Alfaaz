import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', backgroundColor: 'var(--parchment, #F6ECD9)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
