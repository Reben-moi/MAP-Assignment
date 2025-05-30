import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Text, FAB, Portal, Modal, TextInput, IconButton, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAnnouncements, addAnnouncement, getNotifications, removeUser } from '../../utils/dataStorage';
import { CommonActions } from '@react-navigation/native';

const AnnouncementsScreen = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    fetchAnnouncements();
    checkNotifications();
  }, []);

  // Add a listener for when the screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh data when screen is focused
      fetchAnnouncements();
      checkNotifications();
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

  const checkNotifications = async () => {
    try {
      const notifications = await getNotifications();
      setUnreadNotifications(notifications.filter(notification => !notification.read).length);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

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

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncements();
      setAnnouncements(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnnouncements();
    setRefreshing(false);
  };

  const handleAddAnnouncement = async () => {
    if (newAnnouncement.title.trim() === '' || newAnnouncement.content.trim() === '') {
      return;
    }

    try {
      await addAnnouncement({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
      });
      setModalVisible(false);
      setNewAnnouncement({ title: '', content: '' });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  const renderAnnouncementItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph style={styles.date}>{new Date(item.date).toLocaleDateString()}</Paragraph>
        <Paragraph>{item.content}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={announcements}
        renderItem={renderAnnouncementItem}
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
            <Text style={styles.emptyText}>No announcements yet</Text>
          </View>
        }
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>New Announcement</Title>
          <TextInput
            label="Title"
            value={newAnnouncement.title}
            onChangeText={text => setNewAnnouncement({ ...newAnnouncement, title: text })}
            style={styles.input}
          />
          <TextInput
            label="Content"
            value={newAnnouncement.content}
            onChangeText={text => setNewAnnouncement({ ...newAnnouncement, content: text })}
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button onPress={() => setModalVisible(false)} style={styles.button}>Cancel</Button>
            <Button mode="contained" onPress={handleAddAnnouncement} style={styles.button}>Add</Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setModalVisible(true)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  date: {
    color: '#757575',
    fontSize: 12,
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#00563F',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
});

export default AnnouncementsScreen;
