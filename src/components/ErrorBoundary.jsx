import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: 'red', color: 'white', minHeight: '100vh', zIndex: 9999, position: 'relative' }}>
          <h2>App Crash Detected</h2>
          <p style={{ fontWeight: 'bold' }}>
            {this.state.error ? this.state.error.toString() : 'Unknown Error'}
          </p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Stack Trace</summary>
            {this.state.errorInfo ? this.state.errorInfo.componentStack : 'Loading stack trace...'}
          </details>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
