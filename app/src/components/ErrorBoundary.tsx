import React, { Component } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

type Props = {
  readonly children: React.ReactNode;
};

type State = {
  readonly hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught: ", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };


  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.message}>
            We apologize for the inconvenience. An error occurred in the app.
          </Text>
          <Button
            title="Try Again"
            onPress={this.handleRetry}
            color="#FF6347"
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1C1C1C",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#C0C0C0",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default ErrorBoundary;
