import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

export const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <FontAwesome5 name="map-marker-alt" size={24} color="#333" />
        <Text style={styles.addressText}>Jabalpur, India</Text>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications-none" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="help-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 80,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  rightSection: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
});
