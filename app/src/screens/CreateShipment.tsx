import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useShipmentStore } from "../store/shipmentStore";
import { useUserStore } from "../store/userStore";
import { useNavigation } from "@react-navigation/native";

const CreateShipment = ({ navigation }) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getAllRequestedPickups, updateShipmentStatus } = useShipmentStore();
  const { loginDetails } = useUserStore();

  useEffect(() => {
    const fetchedShipments = getAllRequestedPickups();
    setShipments(fetchedShipments);
    setLoading(false);
  }, [getAllRequestedPickups]);

  useEffect(() => {
    if (!loginDetails.isAdmin && shipments.length > 0) {
      Alert.alert(
        "Sorry! only Deliveryman can update the status",
        "Do you want to login as Deliveryman?",
        [
          {
            text: "Yes",
            onPress: () => navigation.navigate("Login"),
          },
          {
            text: "No",
            onPress: () => navigation.navigate("Dashboard"),
          },
        ]
      );
    }
  }, [loginDetails, navigation, shipments]);

  const handleStatusChange = (userId, shipmentId, newStatus) => {
    updateShipmentStatus(userId, shipmentId, newStatus);
    setShipments((prevShipments) =>
      prevShipments.map((shipment) =>
        shipment.shipmentId === shipmentId
          ? { ...shipment, status: newStatus }
          : shipment
      )
    );
  };

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
        <Text style={styles.errorText}>No requested pickups found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {shipments.map((shipment) => (
          <View key={shipment.shipmentId} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{shipment.typeOfGoods} Shipment</Text>
              <Text style={styles.desc}>
                Pickup Address: {shipment.pickUpPointAddress.home}
              </Text>
              <Text style={styles.desc}>
                Delivery Address: {shipment.destinationAddress.home}
              </Text>
              <Text style={styles.status}>Status: {shipment.status}</Text>
            </View>

            {loginDetails.isAdmin && (
              <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Update Status:</Text>
                <Picker
                  selectedValue={shipment.status}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleStatusChange(
                      shipment.userId,
                      shipment.shipmentId,
                      itemValue
                    )
                  }
                >
                  <Picker.Item
                    label="Request Pending"
                    value="request-pending"
                  />
                  <Picker.Item
                    label="Request Approved"
                    value="request-approved"
                  />
                  <Picker.Item
                    label="Delivery Pending"
                    value="delivery-pending"
                  />
                  <Picker.Item label="Delivered" value="delivered" />
                </Picker>
              </View>
            )}
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
  cardHeader: {
    marginBottom: 10,
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
  dropdownContainer: {
    marginTop: 10,
  },
  label: {
    fontFamily: "ProximaNovaBold",
    fontSize: 16,
    color: "#C0C0C0",
  },
  picker: {
    height: 50,
    color: "#FFFFFF",
    backgroundColor: "#444",
    borderRadius: 10,
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

export default CreateShipment;
