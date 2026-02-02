
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class GlobalErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any, errorInfo: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Global Error Boundary Caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          color: '#ff5555', 
          background: '#1a1a1a', 
          minHeight: '100vh', 
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', borderBottom: '2px solid #ff5555', paddingBottom: '0.5rem' }}>
              CRITICAL ERROR
            </h1>
            <div style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
              The application failed to render.
            </div>
            
            <div style={{ background: '#000', padding: '1.5rem', borderRadius: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', border: '1px solid #333' }}>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Error:</strong>
              {this.state.error?.toString()}
            </div>

            {this.state.errorInfo && (
              <div style={{ background: '#000', padding: '1.5rem', borderRadius: '0.5rem', overflowX: 'auto', border: '1px solid #333', maxHeight: '300px' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Stack Trace:</strong>
                <pre style={{ fontSize: '0.8rem', color: '#888', whiteSpace: 'pre-wrap' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '2rem',
                padding: '0.75rem 1.5rem',
                background: '#ff5555',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);
