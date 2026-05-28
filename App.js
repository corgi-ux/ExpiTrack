import React, { useEffect, useRef } from "react";
import { NavigationContainer }      from "@react-navigation/native";
import { createStackNavigator }     from "@react-navigation/stack";
import * as Notifications           from "expo-notifications";
import { useAuth }                  from "./src/hooks/useAuth";
import HomeScreen                   from "./src/screens/HomeScreen";
import AddScreen                    from "./src/screens/AddScreen";
import AuthScreen                   from "./src/screens/AuthScreen";

const Stack = createStackNavigator();

export default function App() {
  const { user, loading } = useAuth();
  const navigationRef     = useRef(null);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      navigationRef.current?.navigate("Home");
    });
    return () => sub.remove();
  }, []);

  if (loading) return null; // ou un écran de splash

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Utilisateur connecté → app principale
          <>
            <Stack.Screen name="Home">
              {props => <HomeScreen {...props} userId={user.id} />}
            </Stack.Screen>
            <Stack.Screen name="Add">
              {props => <AddScreen {...props} userId={user.id} />}
            </Stack.Screen>
          </>
        ) : (
          // Non connecté → écran de login
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}