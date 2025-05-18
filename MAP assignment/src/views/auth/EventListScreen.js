import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Searchbar, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for demonstration
const mockEvents = [
  {
    id: '1',
    title: 'National Championship',
    date: '2025-06-15',
    location: 'Windhoek Hockey Stadium',
    type: 'Tournament',
    category: 'Senior',
    registrationDeadline: '2025-05-30',
    status: 'Upcoming',
    description: 'The annual National Hockey Championship featuring the top teams from across Namibia.',
    image: 'https://namibiahockey.org/wp-content/uploads/2020/04/cropped-NHU-Logo-1.png',
  },
  {
    id: '2',
    title: 'Junior League Finals',
    date: '2025-05-30',
    location: 'Swakopmund Sports Complex',
    type: 'Tournament',
    category: 'Junior',
    registrationDeadline: '2025-05-15',
    status: 'Registration Open',
    description: 'The culmination of the junior hockey league season with the top teams competing for the championship.',
    image: 'https://namibiahockey.org/wp-content/uploads/2020/04/cropped-NHU-Logo-1.png',
  },
  {
    id: '3',
    title: 'Coaching Workshop',
    date: '2025-05-20',
    location: 'Windhoek Sports Centre',
    type: 'Workshop',
    category: 'Coaching',
    registrationDeadline: '2025-05-10',
    status: 'Registration Open',
    description: 'A workshop for hockey coaches to enhance their skills and knowledge of the game.',
    image: 'https://namibiahockey.org/wp-content/uploads/2020/04/cropped-NHU-Logo-1.png',
  },
  {
    id: '4',
    title: 'Umpiring Clinic',
    date: '2025-05-25',
    location: 'Windhoek Sports Centre',
    type: 'Workshop',
    category: 'Officiating',
    registrationDeadline: '2025-05-15',
    status: 'Registration Open',
    description: 'A clinic for hockey umpires to improve their officiating skills and knowledge of the rules.',
    image: 'https://namibiahockey.org/wp-content/uploads/2020/04/cropped-NHU-Logo-1.png',
  },
  {
    id: '5',
    title: 'Youth Development Camp',
    date: '2025-06-05',
    location: 'Walvis Bay Sports Complex',
    type: 'Camp',
    category: 'Youth',
    registrationDeadline: '2025-05-25',
    status: 'Registration Open',
    description: 'A development camp for young hockey players to improve their skills and love for the game.',
    image: 'https://namibiahockey.org/wp-content/uploads/2020/04/cropped-NHU-Logo-1.png',
  },
  {
    id: '6',
    title: 'International Friendly',
    date: '2025-07-10',
    location: 'Windhoek Hockey Stadium',
    type: 'Match',
    category: 'Senior',
    registrationDeadline: null,
    status: 'Upcoming',
    description: 'An international friendly match between Namibia and South Africa.',
    image: 'https://namibiahockey.org/wp-content/uploads/2020/04/cropped-NHU-Logo-1.png',
  },
];

const EventListScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Simulate fetching data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // In a real app, you would fetch from an API
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const onChangeSearch = query => setSearchQuery(query);

  const filterEvents = () => {
    return events.filter(event => {
      // Filter by search query
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by type
      const matchesType = selectedType ? event.type === selectedType : true;
      
      // Filter by category
      const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  };

  const toggleTypeFilter = type => {
    setSelectedType(selectedType === type ? null : type);
  };

  const toggleCategoryFilter = category => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const renderEventItem = ({ item }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
    >
      <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
      <Card.Content>
        <Title>{item.title}</Title>
        <View style={styles.chipContainer}>
          <Chip style={styles.chip}>{item.type}</Chip>
          <Chip style={styles.chip}>{item.category}</Chip>
          <Chip 
            style={[
              styles.statusChip, 
              item.status === 'Registration Open' ? styles.openChip : styles.upcomingChip
            ]}
          >
            {item.status}
          </Chip>
        </View>
        <Paragraph style={styles.date}>Date: {item.date}</Paragraph>
        <Paragraph>Location: {item.location}</Paragraph>
        {item.registrationDeadline && (
          <Paragraph style={styles.deadline}>Registration Deadline: {item.registrationDeadline}</Paragraph>
        )}
        <Paragraph numberOfLines={2} style={styles.description}>{item.description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button 
          onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
          mode="text"
          color="#00563F"
        >
          View Details
        </Button>
        {item.status === 'Registration Open' && (
          <Button 
            onPress={() => navigation.navigate('EventRegistration', { eventId: item.id })}
            mode="contained"
            style={styles.registerButton}
          >
            Register
          </Button>
        )}
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

  const filteredEvents = filterEvents();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search events..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.filterContainer}>
        <Chip 
          selected={selectedType === 'Tournament'} 
          onPress={() => toggleTypeFilter('Tournament')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Tournament
        </Chip>
        <Chip 
          selected={selectedType === 'Workshop'} 
          onPress={() => toggleTypeFilter('Workshop')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Workshop
        </Chip>
        <Chip 
          selected={selectedType === 'Camp'} 
          onPress={() => toggleTypeFilter('Camp')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Camp
        </Chip>
        <Chip 
          selected={selectedType === 'Match'} 
          onPress={() => toggleTypeFilter('Match')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Match
        </Chip>
      </View>

      <View style={styles.filterContainer}>
        <Chip 
          selected={selectedCategory === 'Senior'} 
          onPress={() => toggleCategoryFilter('Senior')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Senior
        </Chip>
        <Chip 
          selected={selectedCategory === 'Junior'} 
          onPress={() => toggleCategoryFilter('Junior')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Junior
        </Chip>
        <Chip 
          selected={selectedCategory === 'Youth'} 
          onPress={() => toggleCategoryFilter('Youth')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Youth
        </Chip>
        <Chip 
          selected={selectedCategory === 'Coaching'} 
          onPress={() => toggleCategoryFilter('Coaching')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Coaching
        </Chip>
        <Chip 
          selected={selectedCategory === 'Officiating'} 
          onPress={() => toggleCategoryFilter('Officiating')}
          style={styles.filterChip}
          selectedColor="#00563F"
        >
          Officiating
        </Chip>
      </View>

      <FlatList
        data={filteredEvents}
        renderItem={renderEventItem}
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
  cardImage: {
    height: 150,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
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
  date: {
    fontWeight: 'bold',
  },
  deadline: {
    color: '#F44336',
  },
  description: {
    marginTop: 8,
    color: '#757575',
  },
  registerButton: {
    backgroundColor: '#00563F',
  },
});

export default EventListScreen;
