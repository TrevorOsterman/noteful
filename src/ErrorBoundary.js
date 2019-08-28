import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2>Oops! An error has occurred in this React component!</h2>;
    }
    return this.props.children;
  }
}
