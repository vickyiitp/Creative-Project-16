import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center text-white p-6 font-mono">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
          <h1 className="text-3xl font-bold mb-2 text-center">System Critical Failure</h1>
          <p className="text-slate-400 mb-8 text-center max-w-md">
            The application encountered an unexpected error. 
            <br />
            <span className="text-xs text-slate-600 mt-2 block">{this.state.error?.message}</span>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105"
          >
            <RefreshCw size={20} />
            Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}