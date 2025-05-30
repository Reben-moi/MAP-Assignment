import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, IconButton, Badge } from 'react-native';
import { Card, Title, Paragraph, Button, Divider, Headline, Subheading, Avatar, List, ActivityIndicator, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { getTeamById, getPlayersByTeamId, getRegistrationsByTeamId, getNotifications, removeUser } from '../../utils/dataStorage';
import { CommonActions } from '@react-navigation/native';

const TeamDetailScreen = ({ route, navigation }) => {
  const { teamId } = route.params;
  const [team, setTeam] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    fetchTeamDetails();
    checkNotifications();
  }, [teamId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTeamDetails();
      checkNotifications();
    });

    return unsubscribe;
  }, [navigation, teamId]);

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

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      
      const teamData = await getTeamById(teamId);
      if (!teamData) {
        throw new Error('Team not found');
      }
      
      const players = await getPlayersByTeamId(teamId);
      setPlayerCount(players.length);
      
      const registrations = await getRegistrationsByTeamId(teamId);
      
      const enhancedTeamData = {
        ...teamData,
        players: players.length,
        wins: 0,
        losses: 0,
        draws: 0,
        position: 1,
        upcomingMatches: [],
        recentResults: [],
        logo: 'https://namibiahockey.org/wp-content/uploads/2020/04/cropped-NHU-Logo-1.png',
      };
      
      setTeam(enhancedTeamData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team details:', error);
      setLoading(false);
      alert('Failed to load team details. Please try again.');
    }
  };

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00563F" />
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Team not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{ uri: team.logo }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Headline style={styles.teamName}>{team.name}</Headline>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{team.category}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{team.division} Division</Text>
            </View>
          </View>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Subheading style={styles.sectionTitle}>Team Information</Subheading>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Home Venue:</Text>
              <Text style={styles.infoValue}>{team.homeVenue}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Players:</Text>
              <Text style={styles.infoValue}>{team.players}</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{team.wins}</Text>
                <Text style={styles.statLabel}>Wins</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{team.losses}</Text>
                <Text style={styles.statLabel}>Losses</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{team.draws}</Text>
                <Text style={styles.statLabel}>Draws</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Subheading style={styles.sectionTitle}>Coach Information</Subheading>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{team.coach?.name || 'Not assigned'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{team.coach?.email || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{team.coach?.phone || 'Not available'}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Subheading style={styles.sectionTitle}>Manager Information</Subheading>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{team.manager?.name || 'Not assigned'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{team.manager?.email || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{team.manager?.phone || 'Not available'}</Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('PlayerList', { teamId: team.id })}
            style={styles.button}
            icon="account-group"
          >
            View Players ({playerCount})
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('PlayerRegistration', { teamId: team.id })}
            style={[styles.button, styles.outlineButton]}
            color="#00563F"
            icon="account-plus"
          >
            Add Player
          </Button>
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="pencil"
        color="white"
        onPress={() => navigation.navigate('EditTeam', { teamId: team.id })}
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
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 100,
    height: 100,
  },
  teamName: {
    color: '#00563F',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  badge: {
    backgroundColor: '#00563F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 120,
  },
  infoValue: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00563F',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  avatar: {
    backgroundColor: '#00563F',
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'center',
  },
  winBadge: {
    backgroundColor: '#4CAF50',
  },
  lossBadge: {
    backgroundColor: '#F44336',
  },
  drawBadge: {
    backgroundColor: '#FFC107',
  },
  resultText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#00563F',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: '#00563F',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#00563F',
  },
});

export default TeamDetailScreen;
