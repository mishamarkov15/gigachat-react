import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { ErrorMessage } from "../ui/ErrorMessage";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("UI error boundary", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-screen">
          <ErrorMessage text="Что-то пошло не так. Обновите страницу и попробуйте снова." />
        </main>
      );
    }

    return this.props.children;
  }
}
