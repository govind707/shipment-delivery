import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/Home";
import { useRoutesLinking } from "../hooks/useRoutes";
import { Registration } from "../screens/Registration";
import Dashboard from "../screens/Dashboard";
import { Login } from "../screens/Login";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Profile } from "../screens/Profile";
import { SafeAreaView } from "react-native";
import { Header } from "../components/dashboard/header";
import RequestPickup from "../screens/RequestPickUp";
import TrackShipment from "../screens/TrackShipment";
import CreateShipment from "../screens/CreateShipment";
import HistoryOfShipment from "../screens/HistoryOfShipments";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppNavigator() {
  const navigationRef = React.useRef(null);
  const linking = useRoutesLinking();

  const DashboardTabs = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === "DashboardHome") {
                return (
                  <MaterialCommunityIcons
                    name="view-dashboard"
                    size={24}
                    color={color}
                  />
                );
              } else if (route.name === "History") {
                return (
                  <MaterialCommunityIcons
                    name="history"
                    size={24}
                    color={color}
                  />
                );
              } else if (route.name === "Profile") {
                return (
                  <FontAwesome5 name="user-circle" size={24} color={color} />
                );
              }
            },
          })}
        >
          <Tab.Screen
            name="DashboardHome"
            component={Dashboard}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="History"
            component={HistoryOfShipment}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    );
  };

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={Home} name="Home" />
        <Stack.Screen component={Registration} name="Registration" />
        <Stack.Screen component={DashboardTabs} name="Dashboard" />
        <Stack.Screen component={Login} name="Login" />
        <Stack.Screen component={RequestPickup} name="RequestPickUp" />
        <Stack.Screen component={TrackShipment} name="TrackShipment" />
        <Stack.Screen component={CreateShipment} name="CreateShipment" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
