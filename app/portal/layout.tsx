import Sidebar from '@/components/layout/Sidebar';
import PortalHeader from '@/components/layout/PortalHeader';
import CartSidebar from '@/components/cart/CartSidebar';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F7FA' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <CartSidebar />
    </div>
  );
}
