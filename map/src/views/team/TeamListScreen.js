import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, Searchbar, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTeams, getPlayersByTeamId } from '../../utils/dataStorage';

const TeamListScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamPlayerCounts, setTeamPlayerCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const teamsData = await getTeams();
      setTeams(teamsData);
      
      const playerCounts = {};
      for (const team of teamsData) {
        const players = await getPlayersByTeamId(team.id);
        playerCounts[team.id] = players.length;
      }
      setTeamPlayerCounts(playerCounts);
      
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const onChangeSearch = query => setSearchQuery(query);

  const filterTeams = () => {
    return teams.filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (team.coach?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      const matchesCategory = selectedCategory ? team.category === selectedCategory : true;
      
      const matchesDivision = selectedDivision ? team.division === selectedDivision : true;
      
      return matchesSearch && matchesCategory && matchesDivision;
    });
  };

  const toggleCategoryFilter = category => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const toggleDivisionFilter = division => {
    setSelectedDivision(selectedDivision === division ? null : division);
  };

  const renderTeamItem = ({ item }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate('TeamDetail', { teamId: item.id })}
    >
      <Card.Content>
        <Title>{item.name}</Title>
        <View style={styles.chipContainer}>
          <Chip style={styles.chip}>{item.category}</Chip>
          <Chip style={styles.chip}>{item.division} Division</Chip>
        </View>
        <Paragraph>Coach: {item.coach?.name || 'Not assigned'}</Paragraph>
        <Paragraph>Players: {teamPlayerCounts[item.id] || 0}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button 
          onPress={() => navigation.navigate('TeamDetail', { teamId: item.id })}
          mode="text"
          color="#00563F"
        >
          View Details
        </Button>
        <Button 
          onPress={() => navigation.navigate('PlayerList', { teamId: item.id })}
          mode="text"
          color="#00563F"
        >
          View Players
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

  const filteredTeams = filterTeams();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search teams..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.filterContainer}>
        <Chip 
          selected={selectedCategory === 'Men'} 
          onPress={() => toggleCategoryFilter('Men')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Men
        </Chip>
        <Chip 
          selected={selectedCategory === 'Women'} 
          onPress={() => toggleCategoryFilter('Women')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Women
        </Chip>
        <Chip 
          selected={selectedDivision === 'Premier'} 
          onPress={() => toggleDivisionFilter('Premier')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Premier
        </Chip>
        <Chip 
          selected={selectedDivision === 'First'} 
          onPress={() => toggleDivisionFilter('First')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          First
        </Chip>
        <Chip 
          selected={selectedDivision === 'Second'} 
          onPress={() => toggleDivisionFilter('Second')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Second
        </Chip>
      </View>

      <FlatList
        data={filteredTeams}
        renderItem={renderTeamItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00563F']}
          />
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        color="white"
        onPress={() => navigation.navigate('TeamRegistration')}
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
  list: {
    padding: 10,
  },
  card: {
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#e0f2f1',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#00563F',
  },
});

export default TeamListScreen;
