import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthStore } from '../features/auth/store/authStore';
import LoginScreen from '../features/auth/screens/LoginScreen';
import DashboardScreen from '../features/home/screens/DashboardScreen';
import GroupsScreen from '../features/groups/screens/GroupsScreen';
import BillsScreen from '../features/bills/screens/BillsScreen';
import HistoryScreen from '../features/history/screens/HistoryScreen';
import { Colors } from '../shared/constants/colors';
import PayScreen from '../features/bills/screens/PayScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text>, tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👥</Text>, tabBarLabel: 'Groups' }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📋</Text>, tabBarLabel: 'Bills' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🕐</Text>, tabBarLabel: 'History' }}
      />
      <Tab.Screen
  name="Pay"
  component={PayScreen}
  options={{
    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💳</Text>,
    tabBarLabel: 'Pay',
  }}
/>
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { isAuthenticated, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}