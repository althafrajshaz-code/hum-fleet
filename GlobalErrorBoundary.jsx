import React from 'react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Global Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#111', color: 'white', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2 style={{ color: '#ef4444' }}>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap', background: '#222', padding: '10px', borderRadius: '5px' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Clear Data & Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default GlobalErrorBoundary;
