import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-netflix-black text-white p-6">
          <h1 className="text-2xl font-bold text-netflix-red mb-2">Something went wrong</h1>
          <p className="text-gray-400 mb-6 max-w-md text-center">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-2 bg-netflix-red rounded hover:bg-red-600 transition"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
