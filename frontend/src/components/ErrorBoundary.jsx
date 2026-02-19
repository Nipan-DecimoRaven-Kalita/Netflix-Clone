import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-netflix-black flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-netflix-red mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">Please refresh the page or try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-netflix-red rounded hover:bg-red-600 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
