import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("CRITICAL UI ERROR:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', background: 'red' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log('main.jsx: Initializing React App');
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('CRITICAL: Root element not found!');
  document.body.innerHTML = '<h1 style="color:red">Root element not found!</h1>';
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
    console.log('main.jsx: Render called');
  } catch (err) {
    console.error('CRITICAL: Render failed immediately', err);
    rootElement.innerHTML = `<h1 style="color:red">Render Failure: ${err.message}</h1>`;
  }
}
