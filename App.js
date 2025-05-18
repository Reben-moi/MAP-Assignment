import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { initializeStorage, initializeRealtimeData, storeUser, getUser } from './src/utils/dataStorage';

// Import screens
import LoginScreen from './src/views/auth/LoginScreen';
import RegisterScreen from './src/views/auth/RegisterScreen';
import HomeScreen from './src/views/feed/HomeScreen';
import TeamListScreen from './src/views/team/TeamListScreen';
import TeamDetailScreen from './src/views/team/TeamDetailScreen';
import TeamRegistrationScreen from './src/views/team/TeamRegistrationScreen';
import PlayerListScreen from './src/views/profile/PlayerListScreen';
import PlayerDetailScreen from './src/views/profile/PlayerDetailScreen';
import PlayerRegistrationScreen from './src/views/profile/PlayerRegistrationScreen';
import EventListScreen from './src/views/feed/EventListScreen';
import EventDetailScreen from './src/views/feed/EventDetailScreen';
import EventRegistrationScreen from './src/views/feed/EventRegistrationScreen';
import EditTeamScreen from './src/views/team/EditTeamScreen';
import EditPlayerScreen from './src/views/profile/EditPlayerScreen';
import NotificationsScreen from './src/views/profile/NotificationsScreen';
import AnnouncementsScreen from './src/views/feed/AnnouncementsScreen';

// Create theme with Namibia Hockey Union colors
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00563F',
    accent: '#E6B31E',
  },
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Home Stack Navigator
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ 
        title: 'Namibia Hockey Union',
        headerTitleAlign: 'center',
      }} 
    />
    <Stack.Screen name="EventList" component={EventListScreen} options={{ title: 'Events' }} />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Event Details' }} />
    <Stack.Screen name="EventRegistration" component={EventRegistrationScreen} options={{ title: 'Register for Event' }} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
  </Stack.Navigator>
);

// Team Stack Navigator
const TeamStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="TeamList" component={TeamListScreen} options={{ title: 'Teams' }} />
    <Stack.Screen name="TeamDetail" component={TeamDetailScreen} options={{ title: 'Team Details' }} />
    <Stack.Screen name="TeamRegistration" component={TeamRegistrationScreen} options={{ title: 'Register Team' }} />
    <Stack.Screen name="EditTeam" component={EditTeamScreen} options={{ title: 'Edit Team' }} />
    <Stack.Screen name="PlayerList" component={PlayerListScreen} options={{ title: 'Players' }} />
    <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} options={{ title: 'Player Details' }} />
    <Stack.Screen name="PlayerRegistration" component={PlayerRegistrationScreen} options={{ title: 'Register Player' }} />
    <Stack.Screen name="EditPlayer" component={EditPlayerScreen} options={{ title: 'Edit Player' }} />
  </Stack.Navigator>
);

// Announcements Stack Navigator
const AnnouncementsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Announcements" 
      component={AnnouncementsScreen} 
      options={{ 
        title: 'Announcements',
        headerTitleAlign: 'center',
      }} 
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'HomeTab') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'TeamsTab') {
          iconName = focused ? 'account-group' : 'account-group-outline';
        } else if (route.name === 'AnnouncementsTab') {
          iconName = focused ? 'bullhorn' : 'bullhorn-outline';
        }

        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#00563F',
      tabBarInactiveTintColor: 'gray',
      tabBarLabelStyle: { fontSize: 12 },
      tabBarStyle: { height: 60, paddingBottom: 8 },
    })}
  >
    <Tab.Screen name="HomeTab" component={HomeStack} options={{ headerShown: false, title: 'Home' }} />
    <Tab.Screen name="TeamsTab" component={TeamStack} options={{ headerShown: false, title: 'Teams' }} />
    <Tab.Screen name="AnnouncementsTab" component={AnnouncementsStack} options={{ headerShown: false, title: 'Announcements' }} />
  </Tab.Navigator>
);

// Root Navigator
const RootNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Auth" component={AuthNavigator} />
    <Stack.Screen name="MainApp" component={MainNavigator} />
  </Stack.Navigator>
);

// App component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the data storage when the app starts
    const setupApp = async () => {
      try {
        await initializeStorage();
        await initializeRealtimeData();
        
        // Check if user is already logged in
        const user = await getUser();
        if (user) {
          setIsLoggedIn(true);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };
    
    setupApp();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
