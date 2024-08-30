import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { ImageCarousel } from "./ImageCarousel";

const images = [
  { id: "1", source: require("../../assets/images/truckDelivery.png") },
  { id: "2", source: require("../../assets/images/scooterDelivery.png") },
  { id: "3", source: require("../../assets/images/multiModeDelivery.png") },
];

export const HomeContent = ({ onGetStarted }) => {
  return (
    <View style={styles.mainContent}>
      <ImageCarousel imageSources={images} />
      <Text style={styles.welcomeText}>Welcome to GS Transport</Text>
      <Text style={styles.description}>
        Transfer your shipment anywhere in the globe with ease and reliability.
      </Text>

      <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
        <Text style={styles.getStartedButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  welcomeText: {
    fontFamily: "ProximaNovaBold",
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontFamily: "ProximaNova",
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  getStartedButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  getStartedButtonText: {
    color: "#fff",
    fontFamily: "ProximaNovaMedium",
    fontSize: 18,
    fontWeight: "600",
  },
});
