import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useShipmentStore } from "../store/shipmentStore";

const HistoryOfShipment = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getAllShipmentsByUserId } = useShipmentStore();

  useEffect(() => {
    const fetchedShipments = getAllShipmentsByUserId("1");
    setShipments(fetchedShipments);
    setLoading(false);
  }, [getAllShipmentsByUserId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#28A745" />
      </View>
    );
  }

  if (!shipments.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No shipment history found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shipment History</Text>
        <Text style={styles.desc}>
          Review your past shipments below
        </Text>
      </View>
      <ScrollView>
        {shipments.map((shipment) => (
          <View key={shipment.shipmentId} style={styles.card}>
            <Text style={styles.title}>{shipment.typeOfGoods} Shipment</Text>
            <Text style={styles.desc}>
              Delivery Address: {shipment.destinationAddress.home}
            </Text>
            <Text style={styles.status}>Status: {shipment.status}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1C1C1C",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    backgroundColor: "#C0C0C0",
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  card: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontFamily: "ProximaNovaBold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  desc: {
    color: "#FFFFFF",
    fontFamily: "ProximaNova",
    marginTop: 5,
  },
  status: {
    color: "#FFD700",
    fontFamily: "ProximaNovaBold",
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
  },
  errorText: {
    fontFamily: "ProximaNova",
    fontSize: 18,
    color: "#FF6347",
  },
});

export default HistoryOfShipment;
