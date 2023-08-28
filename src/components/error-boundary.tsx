import React from 'react';


class ErrorBoundary extends React.Component<React.PropsWithChildren & { fallback: React.ComponentType<{ error: Error, errorInfo: React.ErrorInfo; }>; }> {
	state = { error: null, errorInfo: null };

	render() {
		const { children, fallback: Fallback } = this.props;
		const { error, errorInfo } = this.state;

		if (error && errorInfo) {
			return <Fallback error={error} errorInfo={errorInfo} />;
		}

		return children;
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		this.setState({ error, errorInfo });
	}
}

export default ErrorBoundary;