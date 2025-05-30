import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Divider, Headline, Subheading, Avatar, List, ActivityIndicator, Switch, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getNotifications } from '../../utils/dataStorage';

// Mock user data
const mockUserData = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+264 81 123 4567',
  role: 'Player',
  teamId: '1',
  teamName: 'Windhoek Warriors',
  position: 'Forward',
  jerseyNumber: 10,
  photo: null, // In a real app, this would be a URL
  memberSince: '2020',
  notifications: {
    events: true,
    news: true,
    results: true,
    teamUpdates: true,
  },
  upcomingEvents: [
    {
      id: '1',
      title: 'National Championship',
      date: '2025-06-15',
      location: 'Windhoek Hockey Stadium',
    },
    {
      id: '2',
      title: 'Team Training Session',
      date: '2025-05-10',
      location: 'Windhoek Sports Centre',
    },
  ],
  registrations: [
    {
      id: '1',
      eventId: '1',
      eventTitle: 'National Championship',
      status: 'Confirmed',
      registrationDate: '2025-04-30',
    },
  ],
};

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({});
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Simulate fetching data
  useEffect(() => {
    fetchUserData();
    checkNotifications();
  }, []);

  // Check for new notifications when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkNotifications();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchUserData = () => {
    // In a real app, you would fetch from an API
    setTimeout(() => {
      setUser(mockUserData);
      setNotificationSettings(mockUserData.notifications);
      setLoading(false);
    }, 1000);
  };

  const checkNotifications = async () => {
    try {
      const notifications = await getNotifications();
      const unread = notifications.filter(notification => !notification.read).length;
      setUnreadNotifications(unread);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const toggleNotification = (key) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
    // In a real app, you would update this on the server
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      // In a real app, you would upload this to a server
      setUser({
        ...user,
        photo: result.assets[0].uri,
      });
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleLogout = () => {
    // In a real app, you would implement actual logout logic
    alert('Logged out successfully');
    // Navigate to login screen or update auth state
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00563F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage}>
            {user.photo ? (
              <Image
                source={{ uri: user.photo }}
                style={styles.profilePhoto}
              />
            ) : (
              <Avatar.Text 
                size={100} 
                label={getInitials(user.firstName, user.lastName)} 
                style={styles.avatar}
              />
            )}
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
          <Headline style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Headline>
          <Paragraph style={styles.userRole}>{user.role} - {user.teamName}</Paragraph>
          <Paragraph style={styles.memberSince}>Member since {user.memberSince}</Paragraph>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Subheading style={styles.sectionTitle}>Personal Information</Subheading>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Email"
              description={user.email}
              left={props => <List.Icon {...props} icon="email" color="#00563F" />}
            />
            <Divider />
            <List.Item
              title="Phone"
              description={user.phone}
              left={props => <List.Icon {...props} icon="phone" color="#00563F" />}
            />
            {user.role === 'Player' && (
              <>
                <Divider />
                <List.Item
                  title="Team"
                  description={user.teamName}
                  left={props => <List.Icon {...props} icon="account-group" color="#00563F" />}
                  onPress={() => navigation.navigate('TeamDetail', { teamId: user.teamId })}
                />
                <Divider />
                <List.Item
                  title="Position"
                  description={`${user.position} | #${user.jerseyNumber}`}
                  left={props => <List.Icon {...props} icon="hockey-sticks" color="#00563F" />}
                />
              </>
            )}
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text" 
              onPress={() => console.log('Edit profile')}
              color="#00563F"
            >
              Edit Profile
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Subheading style={styles.sectionTitle}>App Settings</Subheading>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Notifications"
              description={`${unreadNotifications} unread notifications`}
              left={props => <List.Icon {...props} icon="bell" color="#00563F" />}
              right={props => unreadNotifications > 0 && <Badge {...props} style={styles.badge}>{unreadNotifications}</Badge>}
              onPress={() => navigation.navigate('Notifications')}
            />
            <Divider />
            <List.Item
              title="Announcements"
              description="View and create announcements"
              left={props => <List.Icon {...props} icon="bullhorn" color="#00563F" />}
              onPress={() => navigation.navigate('Announcements')}
            />
            <Divider />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Subheading style={styles.sectionTitle}>Notification Settings</Subheading>
            <Divider style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Event Updates</Text>
                <Text style={styles.settingDescription}>Notifications about upcoming events</Text>
              </View>
              <Switch
                value={notificationSettings.events}
                onValueChange={() => toggleNotification('events')}
                color="#00563F"
              />
            </View>
            <Divider />
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>News</Text>
                <Text style={styles.settingDescription}>Latest news from Namibia Hockey Union</Text>
              </View>
              <Switch
                value={notificationSettings.news}
                onValueChange={() => toggleNotification('news')}
                color="#00563F"
              />
            </View>
            <Divider />
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Match Results</Text>
                <Text style={styles.settingDescription}>Updates on match results</Text>
              </View>
              <Switch
                value={notificationSettings.results}
                onValueChange={() => toggleNotification('results')}
                color="#00563F"
              />
            </View>
            <Divider />
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Team Updates</Text>
                <Text style={styles.settingDescription}>Updates from your team</Text>
              </View>
              <Switch
                value={notificationSettings.teamUpdates}
                onValueChange={() => toggleNotification('teamUpdates')}
                color="#00563F"
              />
            </View>
          </Card.Content>
        </Card>

        {user.upcomingEvents.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Subheading style={styles.sectionTitle}>Upcoming Events</Subheading>
              <Divider style={styles.divider} />
              
              {user.upcomingEvents.map((event, index) => (
                <View key={event.id}>
                  <List.Item
                    title={event.title}
                    description={`${event.date} | ${event.location}`}
                    left={props => <List.Icon {...props} icon="calendar" color="#00563F" />}
                    onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
                  />
                  {index !== user.upcomingEvents.length - 1 && <Divider />}
                </View>
              ))}
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="text" 
                onPress={() => navigation.navigate('EventList')}
                color="#00563F"
              >
                View All Events
              </Button>
            </Card.Actions>
          </Card>
        )}

        {user.registrations.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Subheading style={styles.sectionTitle}>My Registrations</Subheading>
              <Divider style={styles.divider} />
              
              {user.registrations.map((registration, index) => (
                <View key={registration.id}>
                  <List.Item
                    title={registration.eventTitle}
                    description={`Registered on ${registration.registrationDate} | ${registration.status}`}
                    left={props => <List.Icon {...props} icon="clipboard-check" color="#00563F" />}
                    right={() => (
                      <View style={[
                        styles.statusBadge, 
                        registration.status === 'Confirmed' ? styles.confirmedBadge : styles.pendingBadge
                      ]}>
                        <Text style={styles.statusText}>{registration.status}</Text>
                      </View>
                    )}
                    onPress={() => navigation.navigate('EventDetail', { eventId: registration.eventId })}
                  />
                  {index !== user.registrations.length - 1 && <Divider />}
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
          color="#F44336"
        >
          Logout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

// Import Text component to avoid errors
import { Text } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatar: {
    backgroundColor: '#00563F',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00563F',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    color: '#00563F',
    fontWeight: 'bold',
    marginTop: 10,
  },
  userRole: {
    fontSize: 16,
    marginTop: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  card: {
    margin: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#00563F',
  },
  divider: {
    marginVertical: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingDescription: {
    fontSize: 14,
    color: '#757575',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'center',
  },
  confirmedBadge: {
    backgroundColor: '#4CAF50',
  },
  pendingBadge: {
    backgroundColor: '#FFC107',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#00563F',
  },
  logoutButton: {
    margin: 10,
    marginBottom: 20,
    borderColor: '#F44336',
  },
});

export default ProfileScreen;
