import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('App crashed:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily: 'monospace', padding: 24, color: '#ef4444', background: '#fff', whiteSpace: 'pre-wrap', fontSize: 13 }}>
          Something went wrong loading the app:{"\n\n"}
          {this.state.error.message || String(this.state.error)}
          {"\n\n"}
          {this.state.error.stack}
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);