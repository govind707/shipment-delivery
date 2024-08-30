import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
  Alert,
  ScrollView,
} from "react-native";
import CheckBox from "expo-checkbox";
import { useUserStore } from "../store/userStore";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    paddingHorizontal: 20,
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
  label: {
    marginBottom: 5,
    color: "#FFFFFF",
    fontFamily: "ProximaNova",
    fontSize: 14,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    color: "#FFFFFF",
    paddingHorizontal: 15,
    backgroundColor: "#333333",
    marginBottom: 20,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    color: "#FFFFFF",
    fontFamily: "ProximaNova",
    fontSize: 14,
  },
  button: {
    height: 50,
    backgroundColor: "#FF6347",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  loader: {
    marginTop: 20,
  },
});

export const Profile = ({ navigation }) => {
  const { loginDetails, updateProfile } = useUserStore();
  const [fullName, setFullName] = useState(loginDetails?.fullName || "");
  const [email, setEmail] = useState(loginDetails?.email || "");
  const [password, setPassword] = useState("");
  const [isDeliveryman, setIsDeliveryman] = useState(
    loginDetails?.isAdmin || false
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    // Populate fields with user details if available
    if (loginDetails) {
      setFullName(loginDetails.fullName);
      setEmail(loginDetails.email);
      setIsDeliveryman(loginDetails.isAdmin);
    }
  }, [loginDetails]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpdateProfile = async () => {
    Keyboard.dismiss();

    setError("");

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const updatedDetails = {
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        isAdmin: isDeliveryman,
        userId: loginDetails.userId,
      };

      const result = await updateProfile(updatedDetails);

      if (result.success) {
        Alert.alert(
          "Profile Updated",
          "Your profile has been updated successfully.",
          [{ text: "OK", onPress: () => navigation.navigate("Dashboard") }]
        );
      } else {
        setError(result.message || "Update failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.desc}>Update your profile information</Text>
      </View>

      <ScrollView>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current.focus()}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          ref={emailInputRef}
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current.focus()}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
          ref={passwordInputRef}
          returnKeyType="done"
        />

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isDeliveryman}
            onValueChange={setIsDeliveryman}
            style={styles.checkbox}
            color={isDeliveryman ? "#FF6347" : undefined}
          />
          <Text style={styles.checkboxLabel}>Are you a deliveryman?</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdateProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Profile</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
