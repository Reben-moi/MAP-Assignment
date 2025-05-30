import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, Button, Divider, Headline, Subheading, Avatar, List, ActivityIndicator, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { getPlayerById, getTeamById } from '../../utils/dataStorage';

const PlayerDetailScreen = ({ route, navigation }) => {
  const { playerId } = route.params;
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPlayerDetails();
    });

    return unsubscribe;
  }, [navigation, playerId]);

  useEffect(() => {
    fetchPlayerDetails();
  }, [playerId]);

  const fetchPlayerDetails = async () => {
    try {
      setLoading(true);
      
      const playerData = await getPlayerById(playerId);
      if (!playerData) {
        throw new Error('Player not found');
      }
      
      setPlayer(playerData);
      
      if (playerData.teamId) {
        const teamData = await getTeamById(playerData.teamId);
        setTeam(teamData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching player details:', error);
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return '';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00563F" />
      </View>
    );
  }

  if (!player) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Player not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          {player.photo ? (
            <Image
              source={{ uri: player.photo }}
              style={styles.photo}
            />
          ) : (
            <Avatar.Text 
              size={100} 
              label={getInitials(player.firstName, player.lastName)} 
              style={styles.avatar}
            />
          )}
          <Headline style={styles.playerName}>{`${player.firstName} ${player.lastName}`}</Headline>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{player.position}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>#{player.jerseyNumber}</Text>
            </View>
          </View>
          <Paragraph style={styles.teamName}>{team ? team.name : 'No team assigned'}</Paragraph>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Subheading style={styles.sectionTitle}>Personal Information</Subheading>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth:</Text>
              <Text style={styles.infoValue}>{player.dateOfBirth}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>{getAge(player.dateOfBirth)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nationality:</Text>
              <Text style={styles.infoValue}>{player.nationality}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender:</Text>
              <Text style={styles.infoValue}>{player.gender}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Subheading style={styles.sectionTitle}>Contact Information</Subheading>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{player.email || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{player.phone || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>{player.address || 'Not provided'}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Subheading style={styles.sectionTitle}>Medical Information</Subheading>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Medical Conditions:</Text>
              <Text style={styles.infoValue}>{player.medicalConditions || 'None'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Emergency Contact:</Text>
              <Text style={styles.infoValue}>
                {player.emergencyContact?.name ? `${player.emergencyContact.name} (${player.emergencyContact.phone})` : 'Not provided'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {team && (
          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('TeamDetail', { teamId: player.teamId })}
              style={styles.button}
              icon="account-group"
            >
              View Team
            </Button>
          </View>
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="pencil"
        color="white"
        onPress={() => navigation.navigate('EditPlayer', { playerId: player.id })}
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
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatar: {
    backgroundColor: '#00563F',
  },
  playerName: {
    color: '#00563F',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  teamName: {
    marginTop: 5,
    fontSize: 16,
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
  buttonContainer: {
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00563F',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#00563F',
  },
});

export default PlayerDetailScreen;
