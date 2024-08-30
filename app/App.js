import React from "react";
import { useFonts } from "expo-font";
import AppNavigator from "./src/navigation/index";
import ErrorBoundary from "./src/components/ErrorBoundary";

export default function App() {
  const [fontsLoaded] = useFonts({
    /* eslint-disable */
    ProximaNova: require("./assets/fonts/ProximaNova.otf"),
    ProximaNovaBold: require("./assets/fonts/ProximaNovaABold.otf"),
    ProximaNovaMedium: require("./assets/fonts/ProximaNovaAMedium.otf"),
    /* eslint-enable */
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AppNavigator />
    </ErrorBoundary>
  );
}
