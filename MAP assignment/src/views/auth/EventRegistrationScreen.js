import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import { TextInput, Button, Text, Title, Headline, Subheading, HelperText, Divider, Checkbox, ActivityIndicator, Menu, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getTeams, getEventById, addEventRegistration } from '../../utils/dataStorage';

const EventRegistrationScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedTeamName, setSelectedTeamName] = useState('Select a team');
  const [teamMenuVisible, setTeamMenuVisible] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [numberOfPlayers, setNumberOfPlayers] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch event and teams data
  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      // Get event details
      const eventData = await getEventById(eventId);
      if (!eventData) {
        throw new Error('Event not found');
      }
      setEvent(eventData);
      
      // Get teams
      const teamsData = await getTeams();
      setTeams(teamsData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      alert('Failed to load data. Please try again.');
    }
  };

  const handleRegister = async () => {
    // Basic validation
    if (!selectedTeamId || !contactName || !contactEmail || !contactPhone) {
      alert('Please fill in all required fields');
      return;
    }

    if (!acceptedTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setFormLoading(true);
    
    // Create registration object
    const registrationData = {
      eventId,
      teamId: selectedTeamId,
      contact: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone
      },
      numberOfPlayers: numberOfPlayers || 'Not specified',
      specialRequests: specialRequests || 'None',
      registeredAt: new Date().toISOString()
    };
    
    try {
      // Add the registration to storage
      const newRegistration = await addEventRegistration(registrationData);
      
      if (newRegistration) {
        setFormLoading(false);
        
        // Show success message
        if (Platform.OS === 'android') {
          ToastAndroid.show('Registration successful!', ToastAndroid.SHORT);
        } else {
          alert('Registration successful! You will receive a confirmation email shortly.');
        }
        
        // Navigate back to event detail
        navigation.navigate('EventDetail', { eventId });
      } else {
        throw new Error('Failed to register for event');
      }
    } catch (error) {
      setFormLoading(false);
      alert(`Registration failed: ${error.message}`);
    }
  };

  const selectTeam = (id, name) => {
    setSelectedTeamId(id);
    setSelectedTeamName(name);
    setTeamMenuVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00563F" />
      </View>
    );
  }

  const isWorkshop = event.type === 'Workshop';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Headline style={styles.headline}>Event Registration</Headline>
            <Text style={styles.subheading}>{event.title}</Text>
            <Text style={styles.eventDetails}>
              {event.date} | {event.location}
            </Text>
            <Text style={styles.entryFee}>
              Entry Fee: {event.entryFee}
            </Text>
          </View>

          <View style={styles.formContainer}>
            {!isWorkshop && (
              <>
                <Subheading style={styles.sectionTitle}>Team Information</Subheading>
                <Divider style={styles.divider} />
                
                <Text style={styles.label}>Select Team *</Text>
                <Menu
                  visible={teamMenuVisible}
                  onDismiss={() => setTeamMenuVisible(false)}
                  anchor={
                    <TouchableRipple
                      onPress={() => setTeamMenuVisible(true)}
                      style={styles.dropdownContainer}
                    >
                      <View style={styles.dropdown}>
                        <Text style={selectedTeamId ? styles.dropdownText : styles.dropdownPlaceholder}>
                          {selectedTeamName}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#757575" />
                      </View>
                    </TouchableRipple>
                  }
                >
                  {teams.map(team => (
                    <Menu.Item
                      key={team.id}
                      onPress={() => selectTeam(team.id, team.name)}
                      title={team.name}
                    />
                  ))}
                </Menu>
                
                <TextInput
                  label="Number of Players *"
                  value={numberOfPlayers}
                  onChangeText={setNumberOfPlayers}
                  style={styles.input}
                  keyboardType="number-pad"
                />
              </>
            )}
            
            <Subheading style={[styles.sectionTitle, !isWorkshop && styles.topMargin]}>Contact Information</Subheading>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Contact Name *"
              value={contactName}
              onChangeText={setContactName}
              style={styles.input}
            />
            
            <TextInput
              label="Contact Email *"
              value={contactEmail}
              onChangeText={setContactEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              label="Contact Phone *"
              value={contactPhone}
              onChangeText={setContactPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />
            
            <Subheading style={[styles.sectionTitle, styles.topMargin]}>Additional Information</Subheading>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Special Requests or Notes"
              value={specialRequests}
              onChangeText={setSpecialRequests}
              style={styles.input}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.termsContainer}>
              <Checkbox
                status={acceptedTerms ? 'checked' : 'unchecked'}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                color="#00563F"
              />
              <Text style={styles.termsText}>
                I accept the terms and conditions of the Namibia Hockey Union and confirm that all information provided is accurate.
              </Text>
            </View>
            
            <HelperText type="info" style={styles.helperText}>
              * Required fields
            </HelperText>
            
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              loading={formLoading}
              disabled={formLoading}
            >
              Complete Registration
            </Button>
            
            <Text style={styles.noteText}>
              Note: Registration is not confirmed until payment is received. Please check your email for payment instructions after registration.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headline: {
    color: '#00563F',
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 5,
  },
  eventDetails: {
    textAlign: 'center',
    marginTop: 5,
    color: '#757575',
  },
  entryFee: {
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#00563F',
  },
  topMargin: {
    marginTop: 20,
  },
  divider: {
    marginVertical: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 5,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#757575',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  termsText: {
    flex: 1,
    marginLeft: 10,
  },
  helperText: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#00563F',
  },
  noteText: {
    marginTop: 15,
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
  },
});

export default EventRegistrationScreen;
