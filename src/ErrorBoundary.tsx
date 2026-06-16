import { Component, type ReactNode } from 'react';

interface State {
  error: Error | null;
}

// Catches any runtime render error and shows a readable message
// instead of a blank white screen.
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F6F9FE',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: '24px',
          }}
        >
          <div
            style={{
              maxWidth: 520,
              background: '#fff',
              border: '1px solid #E3EAF5',
              borderRadius: 20,
              padding: 32,
              boxShadow: '0 12px 40px -16px rgba(11,27,54,0.18)',
            }}
          >
            <h1 style={{ color: '#0B1B36', fontSize: 22, margin: '0 0 8px' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#3A4A63', margin: '0 0 16px' }}>
              The page hit a runtime error. Details below:
            </p>
            <pre
              style={{
                background: '#EEF4FF',
                color: '#1F6BFF',
                padding: 16,
                borderRadius: 12,
                fontSize: 13,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {String(this.state.error?.stack || this.state.error)}
            </pre>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('dowletli_content_v1');
                  localStorage.removeItem('dowletli_lang');
                } catch {
                  /* ignore */
                }
                location.reload();
              }}
              style={{
                marginTop: 16,
                background: '#1F6BFF',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 20px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset & reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
