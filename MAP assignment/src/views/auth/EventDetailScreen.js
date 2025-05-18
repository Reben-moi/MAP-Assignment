import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Share } from 'react-native';
import { Card, Title, Paragraph, Button, Divider, Headline, Subheading, Chip, List, ActivityIndicator, FAB, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data for demonstration
const mockEventDetails = {
  id: '1',
  title: 'National Championship',
  date: '2025-06-15',
  startTime: '09:00',
  endTime: '18:00',
  location: 'Windhoek Hockey Stadium',
  address: '123 Independence Avenue, Windhoek, Namibia',
  type: 'Tournament',
  category: 'Senior',
  registrationDeadline: '2025-05-30',
  status: 'Registration Open',
  description: 'The annual National Hockey Championship featuring the top teams from across Namibia. This prestigious tournament brings together the best hockey talent in the country to compete for the national title. Teams will be divided into pools for the preliminary rounds, followed by knockout stages to determine the champion.',
  image: 'https://namibiahockey.org/wp-content/uploads/2020/04/cropped-NHU-Logo-1.png',
  organizer: 'Namibia Hockey Union',
  contact: {
    name: 'Event Coordinator',
    email: 'events@namibiahockey.org',
    phone: '+264 61 123 4567',
  },
  entryFee: 'N$500 per team',
  prizes: 'Trophy and medals for winners and runners-up',
  eligibility: 'Open to all registered hockey clubs in Namibia',
  rules: 'FIH Rules apply. Each team may register up to 16 players.',
  schedule: [
    {
      id: '1',
      time: '09:00 - 12:00',
      activity: 'Pool Matches',
    },
    {
      id: '2',
      time: '12:00 - 13:00',
      activity: 'Lunch Break',
    },
    {
      id: '3',
      time: '13:00 - 16:00',
      activity: 'Quarter-Finals and Semi-Finals',
    },
    {
      id: '4',
      time: '16:30 - 17:30',
      activity: 'Finals',
    },
    {
      id: '5',
      time: '17:45 - 18:00',
      activity: 'Prize Giving',
    },
  ],
  registeredTeams: [
    {
      id: '1',
      name: 'Windhoek Warriors',
    },
    {
      id: '2',
      name: 'Swakopmund Stars',
    },
    {
      id: '3',
      name: 'Walvis Bay Wolves',
    },
  ],
};

const EventDetailScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching data
  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = () => {
    // In a real app, you would fetch from an API using the eventId
    setTimeout(() => {
      setEvent(mockEventDetails);
      setLoading(false);
    }, 1000);
  };

  const shareEvent = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.title} on ${event.date} at ${event.location}. Register through the Namibia Hockey Union app!`,
        title: event.title,
      });
    } catch (error) {
      console.error('Error sharing event:', error);
    }
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
        <Image
          source={{ uri: event.image }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        
        <View style={styles.headerActions}>
          <IconButton
            icon="share-variant"
            color="#00563F"
            size={24}
            onPress={shareEvent}
            style={styles.shareButton}
          />
        </View>

        <View style={styles.contentContainer}>
          <Headline style={styles.title}>{event.title}</Headline>
          
          <View style={styles.chipContainer}>
            <Chip style={styles.chip}>{event.type}</Chip>
            <Chip style={styles.chip}>{event.category}</Chip>
            <Chip 
              style={[
                styles.statusChip, 
                event.status === 'Registration Open' ? styles.openChip : styles.upcomingChip
              ]}
            >
              {event.status}
            </Chip>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#00563F" style={styles.icon} />
                <Text style={styles.infoText}>{event.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={20} color="#00563F" style={styles.icon} />
                <Text style={styles.infoText}>{event.startTime} - {event.endTime}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#00563F" style={styles.icon} />
                <Text style={styles.infoText}>{event.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="map-outline" size={20} color="#00563F" style={styles.icon} />
                <Text style={styles.infoText}>{event.address}</Text>
              </View>
              {event.registrationDeadline && (
                <View style={styles.infoRow}>
                  <Ionicons name="hourglass-outline" size={20} color="#F44336" style={styles.icon} />
                  <Text style={styles.deadlineText}>Registration Deadline: {event.registrationDeadline}</Text>
                </View>
              )}
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Subheading style={styles.sectionTitle}>Description</Subheading>
              <Divider style={styles.divider} />
              <Paragraph style={styles.description}>{event.description}</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Subheading style={styles.sectionTitle}>Event Details</Subheading>
              <Divider style={styles.divider} />
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Organizer:</Text>
                <Text style={styles.detailValue}>{event.organizer}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Entry Fee:</Text>
                <Text style={styles.detailValue}>{event.entryFee}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Prizes:</Text>
                <Text style={styles.detailValue}>{event.prizes}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Eligibility:</Text>
                <Text style={styles.detailValue}>{event.eligibility}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Rules:</Text>
                <Text style={styles.detailValue}>{event.rules}</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Subheading style={styles.sectionTitle}>Contact Information</Subheading>
              <Divider style={styles.divider} />
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Contact Person:</Text>
                <Text style={styles.detailValue}>{event.contact.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{event.contact.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{event.contact.phone}</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Subheading style={styles.sectionTitle}>Event Schedule</Subheading>
              <Divider style={styles.divider} />
              
              {event.schedule.map((item) => (
                <View key={item.id}>
                  <List.Item
                    title={item.time}
                    description={item.activity}
                    left={props => <List.Icon {...props} icon="clock-outline" color="#00563F" />}
                  />
                  {item.id !== event.schedule[event.schedule.length - 1].id && <Divider />}
                </View>
              ))}
            </Card.Content>
          </Card>

          {event.registeredTeams.length > 0 && (
            <Card style={styles.card}>
              <Card.Content>
                <Subheading style={styles.sectionTitle}>Registered Teams</Subheading>
                <Divider style={styles.divider} />
                
                {event.registeredTeams.map((team, index) => (
                  <View key={team.id}>
                    <List.Item
                      title={team.name}
                      left={props => <List.Icon {...props} icon="account-group" color="#00563F" />}
                      onPress={() => navigation.navigate('TeamDetail', { teamId: team.id })}
                    />
                    {index !== event.registeredTeams.length - 1 && <Divider />}
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {event.status === 'Registration Open' && (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('EventRegistration', { eventId: event.id })}
              style={styles.registerButton}
              icon="pencil"
            >
              Register for this Event
            </Button>
          )}
        </View>
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
  headerImage: {
    width: '100%',
    height: 200,
  },
  headerActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  shareButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    color: '#00563F',
    fontWeight: 'bold',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e0f2f1',
  },
  statusChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  openChip: {
    backgroundColor: '#4CAF50',
  },
  upcomingChip: {
    backgroundColor: '#FFC107',
  },
  card: {
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
  },
  deadlineText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#00563F',
  },
  divider: {
    marginVertical: 10,
  },
  description: {
    lineHeight: 22,
  },
  detailRow: {
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  detailValue: {
    lineHeight: 20,
  },
  registerButton: {
    marginVertical: 20,
    paddingVertical: 8,
    backgroundColor: '#00563F',
  },
});

export default EventDetailScreen;
