import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Platform } from "react-native";
import LottieTruckAnnimation from "../../assets/lottieFiles/transportVehicleAnnimation.json";
import { HomeContent } from "../components/HomeContent";
import LottieView from "lottie-react-native";

export const Home = ({ navigation }) => {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDone(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
      <View style={styles.container}>
        {!animationDone && Platform.OS !== "web" ? (
          <>
            <LottieView
              source={LottieTruckAnnimation}
              autoPlay
              loop={false}
              onAnimationFinish={() => setAnimationDone(true)}
              style={styles.logoAnimation}
            />
          </>
        ) : (
          <HomeContent onGetStarted={() => navigation.navigate("Login")} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoAnimation: {
    width: 300,
    height: 300,
  },
});
