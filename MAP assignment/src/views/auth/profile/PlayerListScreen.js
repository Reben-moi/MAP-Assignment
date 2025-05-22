import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, Searchbar, Chip, Avatar, List, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPlayersByTeamId, getTeamById, getPlayers } from '../../utils/dataStorage';

const PlayerListScreen = ({ route, navigation }) => {
  const { teamId } = route.params || {};
  const [refreshing, setRefreshing] = useState(false);
  const [players, setPlayers] = useState([]);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation, teamId]);

  useEffect(() => {
    fetchData();
  }, [teamId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      let playersData = [];
      
      if (teamId) {
        playersData = await getPlayersByTeamId(teamId);
        const teamData = await getTeamById(teamId);
        setTeam(teamData);
      } else {
        playersData = await getPlayers();
      }
      
      if (!teamId && playersData.length > 0) {
        const enhancedPlayers = [];
        for (const player of playersData) {
          const playerTeam = await getTeamById(player.teamId);
          enhancedPlayers.push({
            ...player,
            teamName: playerTeam ? playerTeam.name : 'Unknown Team'
          });
        }
        setPlayers(enhancedPlayers);
      } else {
        setPlayers(playersData);
      }
      
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching players:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const onChangeSearch = query => setSearchQuery(query);

  const filterPlayers = () => {
    return players.filter(player => {
      const matchesSearch = 
        (player.firstName + ' ' + player.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (player.nationality || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPosition = selectedPosition ? player.position === selectedPosition : true;
      
      return matchesSearch && matchesPosition;
    });
  };

  const togglePositionFilter = position => {
    setSelectedPosition(selectedPosition === position ? null : position);
  };

  const getInitials = (firstName, lastName) => {
    let initials = '';
    if (firstName) initials += firstName[0];
    if (lastName) initials += lastName[0];
    return initials.toUpperCase();
  };

  const renderPlayerItem = ({ item }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate('PlayerDetail', { playerId: item.id })}
    >
      <Card.Content>
        <View style={styles.playerHeader}>
          <Avatar.Text 
            size={50} 
            label={getInitials(item.firstName, item.lastName)} 
            style={styles.avatar}
          />
          <View style={styles.playerInfo}>
            <Title>{item.firstName} {item.lastName}</Title>
            <Paragraph>{item.position} | #{item.jerseyNumber}</Paragraph>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Paragraph style={styles.detailLabel}>Nationality:</Paragraph>
            <Paragraph>{item.nationality}</Paragraph>
          </View>
          <View style={styles.detailItem}>
            <Paragraph style={styles.detailLabel}>Date of Birth:</Paragraph>
            <Paragraph>{item.dateOfBirth}</Paragraph>
          </View>
          {!teamId && item.teamName && (
            <View style={styles.detailItem}>
              <Paragraph style={styles.detailLabel}>Team:</Paragraph>
              <Paragraph>{item.teamName}</Paragraph>
            </View>
          )}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button 
          onPress={() => navigation.navigate('PlayerDetail', { playerId: item.id })}
          mode="text"
          color="#00563F"
        >
          View Profile
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

  const filteredPlayers = filterPlayers();
  const screenTitle = teamId && team ? `${team.name} Players` : 'All Players';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search players..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.filterContainer}>
        <Chip 
          selected={selectedPosition === 'Forward'} 
          onPress={() => togglePositionFilter('Forward')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Forward
        </Chip>
        <Chip 
          selected={selectedPosition === 'Midfielder'} 
          onPress={() => togglePositionFilter('Midfielder')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Midfielder
        </Chip>
        <Chip 
          selected={selectedPosition === 'Defender'} 
          onPress={() => togglePositionFilter('Defender')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Defender
        </Chip>
        <Chip 
          selected={selectedPosition === 'Goalkeeper'} 
          onPress={() => togglePositionFilter('Goalkeeper')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Goalkeeper
        </Chip>
      </View>

      <FlatList
        data={filteredPlayers}
        renderItem={renderPlayerItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00563F']}
          />
        }
        ListHeaderComponent={
          <Title style={styles.title}>{screenTitle}</Title>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Paragraph style={styles.emptyText}>
              {searchQuery || selectedPosition ? 'No players match your search criteria.' : 'No players found. Add a player to get started.'}
            </Paragraph>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        color="white"
        onPress={() => navigation.navigate('PlayerRegistration', { teamId })}
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
  searchContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  title: {
    padding: 15,
    color: '#00563F',
  },
  list: {
    padding: 10,
    flexGrow: 1,
  },
  card: {
    marginBottom: 15,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    backgroundColor: '#00563F',
  },
  playerInfo: {
    marginLeft: 15,
    flex: 1,
  },
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#00563F',
  },
});

export default PlayerListScreen;
