/**
 * ErrorBoundary.jsx
 * This component is a React error boundary that catches JavaScript errors anywhere in its child component tree.
 * It displays a fallback UI when an error occurs and provides a way to reset the error state.
 */
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      message: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unexpected component error.",
    };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = () => {
    this.setState({
      hasError: false,
      message: "",
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="error-box">
          <h2>{this.props.title || "This section had a problem"}</h2>

          <p>{this.state.message}</p>

          <button type="button" onClick={this.reset}>
            Try Again
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
