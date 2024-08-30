import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { ImageCarousel } from "../components/ImageCarousel";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import TwentyPerOffImg from "../../assets/images/twentyPercentOffOfferImg.png";
import { FontAwesome } from "@expo/vector-icons";
import { useShipmentStore } from "../store/shipmentStore";

const images = [
  { id: "1", source: require("../../assets/images/truckDelivery.png") },
  { id: "2", source: require("../../assets/images/scooterDelivery.png") },
  { id: "3", source: require("../../assets/images/multiModeDelivery.png") },
];

const Dashboard = ({ navigation }) => {
  const [pincode, setPincode] = useState("");
  const [availability, setAvailability] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const checkServiceAvailability = () => {
    if (pincode.trim().length === 6 && !isNaN(Number(pincode.trim()))) {
      setAvailability("Service available");
    } else if (pincode.trim().length !== 6) {
      setAvailability("Please enter 6 digit pincode");
    } else if (isNaN(Number(pincode.trim()))) {
      setAvailability("Please enter the 6 digit numeric pincode");
    } else {
      setAvailability("Service not available");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f2f2f2",
    },
    dashboardContent: {
      paddingTop: 15,
      paddingHorizontal: 20,
    },
    section: {
      marginVertical: 20,
    },
    sectionTitle: {
      fontFamily: "ProximaNovaBold",
      fontSize: 18,
      marginBottom: 10,
    },
    shipmentList: {
      flexDirection: "row",
    },
    shipmentItem: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 10,
      marginRight: 10,
      width: 250,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    shipmentStatus: {
      fontFamily: "ProximaNovaBold",
      fontSize: 16,
    },
    shipmentDetails: {
      fontFamily: "ProximaNovaMedium",
      fontSize: 14,
      color: "#555",
      marginTop: 5,
    },
    quickActions: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    actionButton: {
      flex: 1,
      backgroundColor: "#007bff",
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      marginRight: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    actionText: {
      color: "black",
      fontFamily: "ProximaNovaMedium",
      fontSize: 12,
      textAlign: "center",
    },
    pincodeCheckContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    pincodeInput: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      marginRight: 10,
    },
    availabilityText: {
      marginTop: 10,
      fontSize: 16,
      fontFamily: "ProximaNovaMedium",
      color: availability === "Service available" ? "green" : "red",
    },
    feedbackInput: {
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      height: 100,
      textAlignVertical: "top",
      marginBottom: 10,
    },
    ratingTitle: {
      fontFamily: "ProximaNovaMedium",
      fontSize: 16,
      marginBottom: 5,
    },
    starContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    submitButton: {
      backgroundColor: "#007bff",
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
    },
    submitButtonText: {
      color: "white",
      fontFamily: "ProximaNovaBold",
      fontSize: 16,
    },
    thankYouText: {
      fontFamily: "ProximaNovaBold",
      fontSize: 16,
      color: "green",
    },
  });

  const shipments = [
    {
      id: "1",
      status: "In Transit",
      destination: "Jabalpur, MP",
      date: "Aug 29, 2024",
    },
    {
      id: "2",
      status: "Awaiting Pickup",
      destination: "Sundradehi, MP",
      date: "Aug 30, 2024",
    },
    {
      id: "3",
      status: "Delivered",
      destination: "Indore, MP",
      date: "Aug 29, 2024",
    },
  ];

  const submitFeedback = () => {
    // Implement the logic to handle feedback submission
    // For now, we'll just show an alert
    if (feedback && rating > 0) {
      Alert.alert("Thank you!", "Your feedback has been submitted.");
      setSubmitted(true);
      // Reset feedback form
      setFeedback("");
      setRating(0);
    } else {
      Alert.alert("Error", "Please provide feedback and a rating.");
    }
  };

  const renderStarRating = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <FontAwesome
              name="star"
              size={32}
              color={star <= rating ? "#FFD700" : "#CCCCCC"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderShipmentItem = ({ item }) => (
    <View style={styles.shipmentItem}>
      <Text style={styles.shipmentStatus}>{item.status}</Text>
      <Text style={styles.shipmentDetails}>{item.destination}</Text>
      <Text style={styles.shipmentDetails}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.dashboardContent}>
        <View>
          <ImageCarousel
            imageSources={images}
            widthPercent={100}
            height={120}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipment Overview</Text>
          <FlatList
            data={shipments}
            renderItem={renderShipmentItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shipmentList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateShipment")}
              style={styles.actionButton}
            >
              <MaterialCommunityIcons
                name="truck-cargo-container"
                size={24}
                color="black"
              />
              <Text style={styles.actionText}>Service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("TrackShipment")}
              style={styles.actionButton}
            >
              <MaterialIcons name="art-track" size={24} color="black" />
              <Text style={styles.actionText}>Track Shipment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("RequestPickUp")}
              style={styles.actionButton}
            >
              <FontAwesome6
                name="building-circle-arrow-right"
                size={24}
                color="black"
              />
              <Text style={styles.actionText}>Request Pickup</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Offers</Text>
          <Image
            source={TwentyPerOffImg}
            style={{ width: "100%", height: 100, borderRadius: 8 }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check Service Availability</Text>
          <View style={styles.pincodeCheckContainer}>
            <TextInput
              style={styles.pincodeInput}
              placeholder="Enter Pincode"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
            />
            <Button
              title="Check"
              onPress={checkServiceAvailability}
              color="#007bff"
            />
          </View>
          {availability ? (
            <Text style={styles.availabilityText}>{availability}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          {submitted ? (
            <Text style={styles.thankYouText}>
              Thank you for your feedback!
            </Text>
          ) : (
            <View>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Write your feedback..."
                value={feedback}
                onChangeText={setFeedback}
                multiline
              />
              <Text style={styles.ratingTitle}>Rate Your Experience:</Text>
              {renderStarRating()}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitFeedback}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
