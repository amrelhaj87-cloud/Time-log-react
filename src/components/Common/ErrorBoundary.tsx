import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)] text-[var(--ink)] dir-rtl">
          <div className="max-w-[400px] w-full p-6 bg-[var(--card)] rounded-2xl border border-[var(--rose)] shadow-xl text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-lg font-bold text-[var(--rose)] mb-2">عذراً، حدث خطأ غير متوقع</h2>
            <p className="text-xs text-[var(--ink-soft)] mb-4">
              تم تسجيل المشكلة. يمكنك إعادة تحميل الصفحة للمتابعة دون فقدان بياناتك.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="py-2 px-4 bg-[var(--teal)] text-white text-xs font-bold rounded-xl hover:bg-[var(--teal-dark)] transition-colors cursor-pointer"
            >
              إعادة تحميل الصفحة 🔄
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}