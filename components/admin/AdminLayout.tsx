import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

class AdminErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Admin Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-white bg-red-900/20 border border-red-500 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Ошибка в админ-панели</h2>
          <pre className="bg-black/50 p-4 rounded text-sm overflow-auto">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f0f1a] font-sans">
      <AdminErrorBoundary>
        <AdminSidebar />
        <main className="pl-64 min-h-screen">
          <div className="p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </AdminErrorBoundary>
    </div>
  );
};

export default AdminLayout;