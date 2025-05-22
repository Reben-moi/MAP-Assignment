import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import { TextInput, Button, Text, Title, Headline, Subheading, HelperText, Divider, Checkbox, Menu, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { addTeam } from '../../utils/dataStorage';

const TeamRegistrationScreen = ({ navigation }) => {
  const [teamName, setTeamName] = useState('');
  
  // Category dropdown state
  const [category, setCategory] = useState('Men');
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const categories = ['Men', 'Women', 'Mixed', 'Junior Boys', 'Junior Girls'];
  
  // Division dropdown state
  const [division, setDivision] = useState('Premier');
  const [divisionMenuVisible, setDivisionMenuVisible] = useState(false);
  const divisions = ['Premier', 'First', 'Second', 'Junior'];
  
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [coachPhone, setCoachPhone] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [homeVenue, setHomeVenue] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Basic validation
    if (!teamName || !coachName || !coachEmail || !coachPhone || !managerName || !managerEmail || !managerPhone || !homeVenue) {
      alert('Please fill in all required fields');
      return;
    }

    if (!acceptedTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    
    // Create team object
    const teamData = {
      name: teamName,
      category,
      division,
      homeVenue,
      coach: {
        name: coachName,
        email: coachEmail,
        phone: coachPhone
      },
      manager: {
        name: managerName,
        email: managerEmail,
        phone: managerPhone
      },
      createdAt: new Date().toISOString()
    };
    
    try {
      // Add the team to storage
      const newTeam = await addTeam(teamData);
      
      if (newTeam) {
        setLoading(false);
        
        // Show success message
        if (Platform.OS === 'android') {
          ToastAndroid.show('Team registered successfully!', ToastAndroid.SHORT);
        } else {
          alert('Team registered successfully!');
        }
        
        // Navigate to team list
        navigation.navigate('TeamList');
      } else {
        throw new Error('Failed to register team');
      }
    } catch (error) {
      setLoading(false);
      alert(`Registration failed: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Headline style={styles.headline}>Team Registration</Headline>
            <Text style={styles.subheading}>Register your team for the upcoming season</Text>
          </View>

          <View style={styles.formContainer}>
            <Subheading style={styles.sectionTitle}>Team Information</Subheading>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Team Name *"
              value={teamName}
              onChangeText={setTeamName}
              style={styles.input}
            />
            
            <Text style={styles.label}>Category *</Text>
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={
                <TouchableRipple
                  onPress={() => setCategoryMenuVisible(true)}
                  style={styles.dropdownContainer}
                >
                  <View style={styles.dropdown}>
                    <Text style={styles.dropdownText}>{category}</Text>
                    <Ionicons name="chevron-down" size={20} color="#757575" />
                  </View>
                </TouchableRipple>
              }
            >
              {categories.map((item) => (
                <Menu.Item
                  key={item}
                  onPress={() => {
                    setCategory(item);
                    setCategoryMenuVisible(false);
                  }}
                  title={item}
                />
              ))}
            </Menu>
            
            <Text style={styles.label}>Division *</Text>
            <Menu
              visible={divisionMenuVisible}
              onDismiss={() => setDivisionMenuVisible(false)}
              anchor={
                <TouchableRipple
                  onPress={() => setDivisionMenuVisible(true)}
                  style={styles.dropdownContainer}
                >
                  <View style={styles.dropdown}>
                    <Text style={styles.dropdownText}>{division}</Text>
                    <Ionicons name="chevron-down" size={20} color="#757575" />
                  </View>
                </TouchableRipple>
              }
            >
              {divisions.map((item) => (
                <Menu.Item
                  key={item}
                  onPress={() => {
                    setDivision(item);
                    setDivisionMenuVisible(false);
                  }}
                  title={item}
                />
              ))}
            </Menu>
            
            <TextInput
              label="Home Venue *"
              value={homeVenue}
              onChangeText={setHomeVenue}
              style={styles.input}
            />
            
            <Subheading style={[styles.sectionTitle, styles.topMargin]}>Coach Information</Subheading>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Coach Name *"
              value={coachName}
              onChangeText={setCoachName}
              style={styles.input}
            />
            
            <TextInput
              label="Coach Email *"
              value={coachEmail}
              onChangeText={setCoachEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              label="Coach Phone *"
              value={coachPhone}
              onChangeText={setCoachPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />
            
            <Subheading style={[styles.sectionTitle, styles.topMargin]}>Manager Information</Subheading>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Manager Name *"
              value={managerName}
              onChangeText={setManagerName}
              style={styles.input}
            />
            
            <TextInput
              label="Manager Email *"
              value={managerEmail}
              onChangeText={setManagerEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              label="Manager Phone *"
              value={managerPhone}
              onChangeText={setManagerPhone}
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
              Register Team
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

export default TeamRegistrationScreen;
