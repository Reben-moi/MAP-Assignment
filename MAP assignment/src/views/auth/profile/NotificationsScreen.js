import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Divider, Badge, ActivityIndicator, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getNotifications, markNotificationAsRead } from '../../utils/dataStorage';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const notificationsData = await getNotifications();
      setNotifications(notificationsData);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      // Update the local state to reflect the change
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationPress = (notification) => {
    // Mark as read when pressed
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'announcement':
        navigation.navigate('Announcements');
        break;
      case 'event':
        navigation.navigate('EventDetail', { eventId: notification.relatedId });
        break;
      case 'team':
        navigation.navigate('TeamDetail', { teamId: notification.relatedId });
        break;
      case 'player':
        navigation.navigate('PlayerDetail', { playerId: notification.relatedId });
        break;
      default:
        // Default action is to do nothing special
        break;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderNotificationItem = ({ item }) => (
    <Card 
      style={[styles.card, !item.read && styles.unreadCard]} 
      onPress={() => handleNotificationPress(item)}
    >
      <Card.Content>
        <View style={styles.headerRow}>
          <Title style={styles.title}>{item.title}</Title>
          {!item.read && <Badge size={12} style={styles.badge} />}
        </View>
        <Paragraph>{item.message}</Paragraph>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </Card.Content>
      {!item.read && (
        <Card.Actions>
          <Button 
            onPress={() => handleMarkAsRead(item.id)}
            mode="text"
            color="#00563F"
          >
            Mark as Read
          </Button>
        </Card.Actions>
      )}
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
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00563F']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
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
  list: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#00563F',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  badge: {
    backgroundColor: '#00563F',
  },
  date: {
    fontSize: 12,
    color: '#757575',
    marginTop: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#757575',
  },
});

export default NotificationsScreen;
