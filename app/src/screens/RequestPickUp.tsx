import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { CustomTextInput } from "../components/CustomTextInput";
import { CustomDateTimePicker } from "../components/CustomDateTimePicker";
import { useShipmentStore } from "../store/shipmentStore";
import { useUserStore } from "../store/userStore";

const RequestPickup = ({ navigation }) => {
  const [isMapPermitted, setIsMapPermitted] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [packageDetails, setPackageDetails] = useState({
    weight: "",
    dimensions: "",
    type: "",
  });
  const [pickupDate, setPickupDate] = useState(new Date());
  const [isDeliveryMapVisible, setIsDeliveryMapVisible] = useState(false);
  const [isPickUpMapVisible, setIsPickUpMapVisible] = useState(false);
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [pickUpCoordinates, setPickUpCoordinates] = useState({
    latitude: 23.1656,
    longitude: 79.943,
  });
  const [deliveryCoordinates, setDeliveryCoordinates] = useState({
    latitude: 23.1656,
    longitude: 79.943,
  });

  const { setShipmentHistory } = useShipmentStore();
  const { loginDetails } = useUserStore();

  const handlePickUpDate = (date) => {
    setPickupDate(date);
  };

  async function requestLocationPermission(retyrCount: number) {
    if (retyrCount > 3) {
      return;
    }
    try {
      if (Platform.OS === "android") {
        const grantedFineLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        const grantedCoarseLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        );
        if (
          grantedFineLocation === PermissionsAndroid.RESULTS.GRANTED &&
          grantedCoarseLocation === PermissionsAndroid.RESULTS.GRANTED
        ) {
          setIsMapPermitted(true);
          console.log("You can use the location");
        } else {
          requestLocationPermission(retyrCount + 1);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    if (!isMapPermitted) {
      requestLocationPermission(1);
    }
  }, [isMapPermitted]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Request Pickup</Text>
          <Text style={styles.desc}>
            Create your pick-up by providing below details
          </Text>
        </View>

        <ScrollView>
          <CustomTextInput
            label="Type of Goods"
            placeholder="e.g. Laptop, books"
            value={packageDetails.type}
            onChangeText={(text) =>
              setPackageDetails({ ...packageDetails, type: text })
            }
          />

          <CustomTextInput
            label="Package Dimensions"
            placeholder="e.g. 40*40(in cm)"
            value={packageDetails.dimensions}
            onChangeText={(text) =>
              setPackageDetails({ ...packageDetails, dimensions: text })
            }
          />

          <CustomTextInput
            label="Package Weight"
            placeholder="e.g. 200g"
            value={packageDetails.weight}
            onChangeText={(text) =>
              setPackageDetails({ ...packageDetails, weight: text })
            }
            keyboardType="numeric"
          />

          <CustomDateTimePicker onDateTimeChange={handlePickUpDate} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomTextInput
              label="Pickup Address"
              placeholder="Enter Pickup Address"
              value={pickupAddress}
              onChangeText={setPickupAddress}
              style={{ width: "68%" }}
            />
            <View
              style={{
                width: "30%",
                height: 40,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: "#FF6347",
                marginTop: 5,
              }}
            >
              <Button
                onPress={() => setIsPickUpMapVisible((pre) => !pre)}
                title="Map"
                color={isPickUpMapVisible ? "green" : "#FF6347"}
              />
            </View>
          </View>

          {isPickUpMapVisible && isMapPermitted && (
            <MapView
              style={styles.map}
              region={{
                latitude: pickUpCoordinates.latitude,
                longitude: pickUpCoordinates.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(e) => {
                setLocation(e.nativeEvent.coordinate);
                setPickUpCoordinates(e.nativeEvent.coordinate);
              }}
            >
              <Marker
                coordinate={pickUpCoordinates}
                draggable
                onDragEnd={(e) =>
                  setPickUpCoordinates(e.nativeEvent.coordinate)
                }
              />
            </MapView>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomTextInput
              label="Delivery Address"
              placeholder="Enter Delivery Address"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              style={{ width: "68%" }}
            />

            <View
              style={{
                width: "30%",
                height: 40,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: "#FF6347",
                marginTop: 5,
              }}
            >
              <Button
                color={isDeliveryMapVisible ? "green" : "#FF6347"}
                onPress={() => setIsDeliveryMapVisible((pre) => !pre)}
                title="Map"
              />
            </View>
          </View>

          {isDeliveryMapVisible && isMapPermitted && (
            <MapView
              style={styles.map}
              region={{
                latitude: deliveryCoordinates.latitude,
                longitude: deliveryCoordinates.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(e) => setDeliveryCoordinates(e.nativeEvent.coordinate)}
            >
              <Marker
                coordinate={deliveryCoordinates}
                draggable
                onDragEnd={(e) =>
                  setDeliveryCoordinates(e.nativeEvent.coordinate)
                }
              />
            </MapView>
          )}
        </ScrollView>

        <View style={styles.confirmButtonWrapper}>
          <Button
            color={"#FF6347"}
            title="Confirm Pickup"
            onPress={() => {
              if (
                !packageDetails.type ||
                !packageDetails.dimensions ||
                !packageDetails.weight ||
                !pickupAddress ||
                !deliveryAddress ||
                !pickupDate
              ) {
                alert(
                  "Please fill all the fields before submitting the pick-up request"
                );
              } else {
                const params = {
                  userId: loginDetails.userId || "1",
                  shipment: {
                    active: true,
                    destinationAddress: {
                      latitude: deliveryCoordinates.latitude,
                      longitude: deliveryCoordinates.longitude,
                      home: deliveryAddress,
                    },
                    pickUpPointAddress: {
                      latitude: pickUpCoordinates.latitude,
                      longitude: pickUpCoordinates.longitude,
                      home: pickupAddress,
                    },
                    shipmentId: new Date().getTime().toString(),
                    typeOfGoods: packageDetails.type,
                    weight: packageDetails.weight,
                    dimensions: packageDetails.dimensions,
                    pickUpDate: pickupDate,
                    status: "request-pending",
                  },
                };

                setShipmentHistory(params);
                Alert.alert(
                  "Created shipment pick-up request successfuly",
                  "Redirecting to the Dashboard...",
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.navigate("Dashboard"),
                    },
                  ]
                );
              }
            }}
          />
        </View>
      </SafeAreaView>
    </View>
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
  title: {
    fontFamily: "ProximaNovaBold",
    fontSize: 24,
    color: "#FFFFFF",
  },
  desc: {
    color: "#FFFFFF",
    fontFamily: "ProximaNova",
  },
  map: {
    height: 200,
    marginVertical: 20,
  },
  confirmButtonWrapper: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
});

export default RequestPickup;
