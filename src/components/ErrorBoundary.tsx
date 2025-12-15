import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-primary">Ой!</h1>
              <h2 className="text-2xl font-semibold">Что-то пошло не так</h2>
              <p className="text-muted-foreground">
                Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
              </p>
            </div>
            
            {this.state.error && (
              <details className="text-left bg-muted p-4 rounded-lg text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  Техническая информация
                </summary>
                <code className="text-xs break-all">
                  {this.state.error.toString()}
                </code>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset}>
                Вернуться на главную
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Перезагрузить страницу
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
