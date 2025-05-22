import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Image, ToastAndroid } from 'react-native';
import { TextInput, Button, Text, Title, Headline, Subheading, HelperText, Divider, Checkbox, ActivityIndicator, Menu, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getTeams, addPlayer } from '../../utils/dataStorage';

const PlayerRegistrationScreen = ({ route, navigation }) => {
  const { teamId } = route.params || {};
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  // Player information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('Namibian');
  const [idNumber, setIdNumber] = useState('');
  
  // Gender dropdown state
  const [gender, setGender] = useState('Male');
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const genders = ['Male', 'Female', 'Other'];
  
  // Position dropdown state
  const [position, setPosition] = useState('Forward');
  const [positionMenuVisible, setPositionMenuVisible] = useState(false);
  const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
  
  const [jerseyNumber, setJerseyNumber] = useState('');
  
  // Team dropdown state
  const [selectedTeamId, setSelectedTeamId] = useState(teamId || '');
  const [selectedTeamName, setSelectedTeamName] = useState('Select a team');
  const [teamMenuVisible, setTeamMenuVisible] = useState(false);
  
  // Contact information
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Medical information
  const [medicalConditions, setMedicalConditions] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  
  // Photo
  const [photo, setPhoto] = useState(null);
  
  // Form state
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch teams data
  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    // Set the selected team name if teamId is provided
    if (teamId && teams.length > 0) {
      const team = teams.find(t => t.id === teamId);
      if (team) {
        setSelectedTeamName(team.name);
      }
    }
  }, [teamId, teams]);

  const fetchTeams = async () => {
    try {
      setLoadingTeams(true);
      // Get teams from storage
      const teamsData = await getTeams();
      setTeams(teamsData);
      setLoadingTeams(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoadingTeams(false);
      alert('Failed to load teams. Please try again.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    // Basic validation
    if (!firstName || !lastName || !dateOfBirth || !nationality || !gender || !position || !jerseyNumber || !selectedTeamId) {
      alert('Please fill in all required fields');
      return;
    }

    if (!acceptedTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    
    // Create player object
    const playerData = {
      firstName,
      lastName,
      dateOfBirth,
      nationality,
      idNumber,
      gender,
      position,
      jerseyNumber,
      teamId: selectedTeamId,
      email,
      phone,
      address,
      medicalConditions,
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone
      },
      photo: photo || null,
      createdAt: new Date().toISOString()
    };
    
    try {
      // Add the player to storage
      const newPlayer = await addPlayer(playerData);
      
      if (newPlayer) {
        setLoading(false);
        
        // Show success message
        if (Platform.OS === 'android') {
          ToastAndroid.show('Player registered successfully!', ToastAndroid.SHORT);
        } else {
          alert('Player registered successfully!');
        }
        
        // Navigate to player list
        navigation.navigate('PlayerList', { teamId: selectedTeamId });
      } else {
        throw new Error('Failed to register player');
      }
    } catch (error) {
      setLoading(false);
      alert(`Registration failed: ${error.message}`);
    }
  };

  const selectTeam = (id, name) => {
    setSelectedTeamId(id);
    setSelectedTeamName(name);
    setTeamMenuVisible(false);
  };

  if (loadingTeams) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00563F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Headline style={styles.headline}>Player Registration</Headline>
            <Text style={styles.subheading}>Register a new player for the Namibia Hockey Union</Text>
          </View>

          <View style={styles.formContainer}>
            <Subheading style={styles.sectionTitle}>Player Photo</Subheading>
            <Divider style={styles.divider} />
            
            <View style={styles.photoContainer}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderText}>No Photo</Text>
                </View>
              )}
              <Button 
                mode="contained" 
                onPress={pickImage} 
                style={styles.photoButton}
              >
                {photo ? 'Change Photo' : 'Add Photo'}
              </Button>
            </View>
            
            <Subheading style={[styles.sectionTitle, styles.topMargin]}>Personal Information</Subheading>
            <Divider style={styles.divider} />
            
            <TextInput
              label="First Name *"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />
            
            <TextInput
              label="Last Name *"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />
            
            <TextInput
              label="Date of Birth (YYYY-MM-DD) *"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              style={styles.input}
              placeholder="e.g. 1995-05-15"
            />
            
            <TextInput
              label="Nationality *"
              value={nationality}
              onChangeText={setNationality}
              style={styles.input}
            />
            
            <TextInput
              label="ID Number"
              value={idNumber}
              onChangeText={setIdNumber}
              style={styles.input}
            />
            
            <Text style={styles.label}>Gender *</Text>
            <Menu
              visible={genderMenuVisible}
              onDismiss={() => setGenderMenuVisible(false)}
              anchor={
                <TouchableRipple
                  onPress={() => setGenderMenuVisible(true)}
                  style={styles.dropdownContainer}
                >
                  <View style={styles.dropdown}>
                    <Text style={styles.dropdownText}>{gender}</Text>
                    <Ionicons name="chevron-down" size={20} color="#757575" />
                  </View>
                </TouchableRipple>
              }
            >
              {genders.map((item) => (
                <Menu.Item
                  key={item}
                  onPress={() => {
                    setGender(item);
                    setGenderMenuVisible(false);
                  }}
                  title={item}
                />
              ))}
            </Menu>
            
            <Subheading style={[styles.sectionTitle, styles.topMargin]}>Hockey Information</Subheading>
            <Divider style={styles.divider} />
            
            <Text style={styles.label}>Position *</Text>
            <Menu
              visible={positionMenuVisible}
              onDismiss={() => setPositionMenuVisible(false)}
              anchor={
                <TouchableRipple
                  onPress={() => setPositionMenuVisible(true)}
                  style={styles.dropdownContainer}
                >
                  <View style={styles.dropdown}>
                    <Text style={styles.dropdownText}>{position}</Text>
                    <Ionicons name="chevron-down" size={20} color="#757575" />
                  </View>
                </TouchableRipple>
              }
            >
              {positions.map((item) => (
                <Menu.Item
                  key={item}
                  onPress={() => {
                    setPosition(item);
                    setPositionMenuVisible(false);
                  }}
                  title={item}
                />
              ))}
            </Menu>
            
            <TextInput
              label="Jersey Number *"
              value={jerseyNumber}
              onChangeText={setJerseyNumber}
              style={styles.input}
              keyboardType="number-pad"
            />
            
            <Text style={styles.label}>Team *</Text>
            <Menu
              visible={teamMenuVisible}
              onDismiss={() => setTeamMenuVisible(false)}
              anchor={
                <TouchableRipple
                  onPress={() => setTeamMenuVisible(true)}
                  style={styles.dropdownContainer}
                  disabled={!!teamId} // Disable if teamId is provided
                >
                  <View style={styles.dropdown}>
                    <Text style={selectedTeamId ? styles.dropdownText : styles.dropdownPlaceholder}>
                      {selectedTeamName}
                    </Text>
                    {!teamId && <Ionicons name="chevron-down" size={20} color="#757575" />}
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
            
            <Subheading style={[styles.sectionTitle, styles.topMargin]}>Contact Information</Subheading>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />
            
            <TextInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              multiline
              numberOfLines={3}
            />
            
            <Subheading style={[styles.sectionTitle, styles.topMargin]}>Medical Information</Subheading>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Medical Conditions or Allergies"
              value={medicalConditions}
              onChangeText={setMedicalConditions}
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="List any medical conditions or allergies"
            />
            
            <TextInput
              label="Emergency Contact Name"
              value={emergencyContactName}
              onChangeText={setEmergencyContactName}
              style={styles.input}
            />
            
            <TextInput
              label="Emergency Contact Phone"
              value={emergencyContactPhone}
              onChangeText={setEmergencyContactPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />
            
            <View style={styles.termsContainer}>
              <Checkbox
                status={acceptedTerms ? 'checked' : 'unchecked'}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                color="#00563F"
              />
              <Text style={styles.termsText}>
                I accept the terms and conditions of the Namibia Hockey Union
              </Text>
            </View>
            
            <HelperText type="info" style={styles.helperText}>
              * Required fields
            </HelperText>
            
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Register Player
            </Button>
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
    textAlign: 'center',
    marginTop: 5,
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
  photoContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoPlaceholderText: {
    color: '#757575',
  },
  photoButton: {
    backgroundColor: '#00563F',
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
});

export default PlayerRegistrationScreen;
