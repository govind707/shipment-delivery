import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useShipmentStore } from "../store/shipmentStore";
import { useUserStore } from "../store/userStore";

const GOOGLE_MAPS_APIKEY = "YOUR_GOOGLE_MAPS_API_KEY";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TrackShipment = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedShipment, setExpandedShipment] = useState(null);

  const { getAllShipmentsByUserId } = useShipmentStore();
  const { loginDetails } = useUserStore();

  useEffect(() => {
    const fetchedShipments = getAllShipmentsByUserId(
      loginDetails.userId || "1"
    );

    // Sorting shipments by status priority
    const sortedShipments = fetchedShipments.sort((a, b) => {
      const statusOrder = [
        "request-pending",
        "request-approved",
        "delivery-pending",
      ];
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    });

    setShipments(sortedShipments);
    setLoading(false);
  }, [getAllShipmentsByUserId]);

  const handleCardPress = (shipmentId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedShipment(expandedShipment === shipmentId ? null : shipmentId);
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
        <Text style={styles.errorText}>No shipments found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Track Shipment</Text>
        <Text style={styles.desc}>
          Click on the listed shipment for more details
        </Text>
      </View>
      <ScrollView>
        {shipments.map((shipment) => (
          <TouchableOpacity
            key={shipment.shipmentId}
            onPress={() => handleCardPress(shipment.shipmentId)}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{shipment.typeOfGoods} Shipment</Text>
              <Text style={styles.desc}>
                Delivery Address: {shipment.destinationAddress.home}
              </Text>
              <Text style={styles.status}>Status: {shipment.status}</Text>
              {shipment.status === "delivered" && (
                <Text style={styles.status}>
                  Your shipment is delivered successfully
                </Text>
              )}
            </View>

            {expandedShipment === shipment.shipmentId &&
              shipment.status !== "delivered" && (
                <View style={styles.expandedContent}>
                  <Text style={styles.label}>Pickup Address:</Text>
                  <Text style={styles.text}>
                    {shipment.pickUpPointAddress.home}
                  </Text>

                  <Text style={styles.label}>Package Details:</Text>
                  <Text style={styles.text}>Type: {shipment.typeOfGoods}</Text>
                  <Text style={styles.text}>
                    Dimensions: {shipment.dimensions}
                  </Text>
                  <Text style={styles.text}>Weight: {shipment.weight}</Text>

                  <View style={styles.mapContainer}>
                    {shipment.pickUpPointAddress &&
                      shipment.destinationAddress && (
                        <MapView
                          style={styles.map}
                          initialRegion={{
                            latitude: shipment.pickUpPointAddress.latitude,
                            longitude: shipment.pickUpPointAddress.longitude,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1,
                          }}
                        >
                          <Marker
                            coordinate={{
                              latitude: shipment.pickUpPointAddress.latitude,
                              longitude: shipment.pickUpPointAddress.longitude,
                            }}
                            title="Pickup Location"
                            pinColor="green"
                          />
                          <Marker
                            coordinate={{
                              latitude: shipment.destinationAddress.latitude,
                              longitude: shipment.destinationAddress.longitude,
                            }}
                            title="Destination Location"
                            pinColor="red"
                          />
                        </MapView>
                      )}
                  </View>
                </View>
              )}
          </TouchableOpacity>
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
    zIndex: 1000,
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
  expandedContent: {
    marginTop: 10,
  },
  label: {
    fontFamily: "ProximaNovaBold",
    fontSize: 16,
    color: "#C0C0C0",
    marginTop: 10,
  },
  text: {
    fontFamily: "ProximaNova",
    fontSize: 14,
    color: "#FFFFFF",
  },
  mapContainer: {
    marginTop: 10,
  },
  map: {
    height: 200,
    borderRadius: 10,
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

export default TrackShipment;
