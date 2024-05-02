import * as React from "react";

export default class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("ErrorBoundary", error);
    return { error };
  }

  render() {
    const err = this.state.error;
    if (err) {
      return (
        <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
          <div className="text-xl opacity-30">
            An exception was thrown by this page
          </div>
          <div className="max-w-md mt-5 font-mono text-sm italic break-words opacity-30">
            &ldquo;
            {err.message || err.code || err.toString()}
            &rdquo;
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
