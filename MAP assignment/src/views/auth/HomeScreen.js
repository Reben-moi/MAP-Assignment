import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Headline, Subheading, ActivityIndicator, FAB, Divider, Badge, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { getEvents, getTeams, initializeStorage, getNotifications, getAnnouncements, removeUser } from '../../utils/dataStorage';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

// Mock data for demonstration
const mockNews = [
  {
    id: '1',
    title: 'National Team Selection Announced',
    date: '2025-05-01',
    summary: 'The Namibia Hockey Union is proud to announce the selection of the national team for the upcoming international tournament.',
    image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80',
  },
  {
    id: '2',
    title: 'New Season Registration Open',
    date: '2025-04-25',
    summary: 'Registration for the 2025/2026 hockey season is now open. All teams are encouraged to register before the deadline.',
    image: 'https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
  },
  {
    id: '3',
    title: 'Youth Development Program Success',
    date: '2025-04-15',
    summary: 'The youth development program has seen great success with over 100 new young players joining hockey clubs across Namibia.',
    image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80',
  },
];

const HomeScreen = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    // Initialize storage with mock data if needed
    initializeStorage().then(() => {
      fetchData();
    });
  }, []);

  // Add a listener for when the screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh data when screen is focused
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  // Set up the header with notification icon and logout button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon="bell-outline"
            color="#00563F"
            size={24}
            onPress={() => navigation.navigate('Notifications')}
            style={{ marginRight: 5 }}
          />
          {unreadNotifications > 0 && (
            <Badge
              style={{
                position: 'absolute',
                top: 5,
                right: 45,
                backgroundColor: '#E6B31E'
              }}
            >
              {unreadNotifications}
            </Badge>
          )}
          <IconButton
            icon="logout"
            color="#00563F"
            size={24}
            onPress={handleLogout}
          />
        </View>
      ),
    });
  }, [navigation, unreadNotifications]);

  const handleLogout = async () => {
    try {
      await removeUser();
      // Reset navigation and go to Auth screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        })
      );
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get events from storage
      const eventsData = await getEvents();
      setEvents(eventsData);
      
      // Mock news data (could be stored in AsyncStorage too)
      setNews(mockNews);
      
      // Get notifications and count unread
      const notifications = await getNotifications();
      setUnreadNotifications(notifications.filter(notification => !notification.read).length);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderNewsItem = ({ item }) => (
    <Card style={styles.card} onPress={() => console.log('News item pressed')}>
      <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph style={styles.date}>{item.date}</Paragraph>
        <Paragraph>{item.summary}</Paragraph>
      </Card.Content>
    </Card>
  );

  const renderEventItem = ({ item }) => (
    <Card style={styles.eventCard} onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}>
      <Card.Cover source={{ uri: item.image }} style={styles.eventCardImage} />
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph style={styles.date}>Date: {item.date}</Paragraph>
        <Paragraph>Location: {item.location}</Paragraph>
        <View style={styles.statusContainer}>
          <Paragraph style={styles.status}>{item.status}</Paragraph>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('EventRegistration', { eventId: item.id })}
          style={styles.registerButton}
        >
          Register
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00563F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Image
                source={{ uri: 'https://namibiahockey.org/wp-content/uploads/2020/04/cropped-NHU-Logo-1.png' }}
                style={styles.logo}
                resizeMode="contain"
              />
              <Headline style={styles.headline}>Namibia Hockey Union</Headline>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Subheading style={styles.sectionTitle}>Latest News</Subheading>
                <Button 
                  mode="text" 
                  onPress={() => console.log('View all news')}
                  labelStyle={styles.viewAllButton}
                >
                  View All
                </Button>
              </View>
              <FlatList
                data={news}
                renderItem={renderNewsItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.newsList}
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Subheading style={styles.sectionTitle}>Upcoming Events</Subheading>
                <Button 
                  mode="text" 
                  onPress={() => navigation.navigate('EventList')}
                  labelStyle={styles.viewAllButton}
                >
                  View All
                </Button>
              </View>
              {events.map(event => (
                <View key={event.id}>
                  {renderEventItem({ item: event })}
                </View>
              ))}
            </View>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00563F']}
          />
        }
      />
    </SafeAreaView>
  );
};

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
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 80,
    height: 80,
  },
  headline: {
    color: '#00563F',
    fontWeight: 'bold',
    marginTop: 10,
  },
  section: {
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButton: {
    color: '#00563F',
  },
  card: {
    width: 280,
    marginRight: 15,
    marginBottom: 5,
  },
  cardImage: {
    height: 140,
  },
  eventCardImage: {
    height: 180,
  },
  newsList: {
    paddingBottom: 10,
  },
  eventCard: {
    marginBottom: 15,
  },
  date: {
    color: '#757575',
    fontSize: 12,
    marginBottom: 5,
  },
  statusContainer: {
    marginTop: 5,
  },
  status: {
    fontWeight: 'bold',
    color: '#00563F',
  },
  registerButton: {
    backgroundColor: '#00563F',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});

export default HomeScreen;
