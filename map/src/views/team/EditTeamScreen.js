import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Text, Title, Headline, Subheading, HelperText, Divider, Menu, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getTeamById, updateTeam, deleteTeam } from '../../utils/dataStorage';

const EditTeamScreen = ({ route, navigation }) => {
  const { teamId } = route.params;
  
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
  
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch team data
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const team = await getTeamById(teamId);
        if (team) {
          setTeamName(team.name || '');
          setCategory(team.category || 'Men');
          setDivision(team.division || 'Premier');
          setHomeVenue(team.homeVenue || '');
          
          if (team.coach) {
            setCoachName(team.coach.name || '');
            setCoachEmail(team.coach.email || '');
            setCoachPhone(team.coach.phone || '');
          }
          
          if (team.manager) {
            setManagerName(team.manager.name || '');
            setManagerEmail(team.manager.email || '');
            setManagerPhone(team.manager.phone || '');
          }
        }
        setInitialLoading(false);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setInitialLoading(false);
        Alert.alert('Error', 'Failed to load team data');
      }
    };
    
    fetchTeamData();
  }, [teamId]);

  const handleUpdate = async () => {
    // Basic validation
    if (!teamName || !homeVenue) {
      Alert.alert('Error', 'Please fill in all required fields');
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
      updatedAt: new Date().toISOString()
    };
    
    try {
      // Update the team
      const updatedTeam = await updateTeam(teamId, teamData);
      
      if (updatedTeam) {
        setLoading(false);
        Alert.alert('Success', 'Team updated successfully');
        navigation.goBack();
      } else {
        throw new Error('Failed to update team');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', `Update failed: ${error.message}`);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Team',
      'Are you sure you want to delete this team? This will also delete all players associated with this team and cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete }
      ]
    );
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    
    try {
      const success = await deleteTeam(teamId);
      
      if (success) {
        setDeleteLoading(false);
        Alert.alert('Success', 'Team deleted successfully');
        navigation.navigate('TeamList');
      } else {
        throw new Error('Failed to delete team');
      }
    } catch (error) {
      setDeleteLoading(false);
      Alert.alert('Error', `Delete failed: ${error.message}`);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading team data...</Text>
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
            <Headline style={styles.headline}>Edit Team</Headline>
            <Text style={styles.subheading}>Update team information</Text>
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
              label="Coach Name"
              value={coachName}
              onChangeText={setCoachName}
              style={styles.input}
            />
            
            <TextInput
              label="Coach Email"
              value={coachEmail}
              onChangeText={setCoachEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              label="Coach Phone"
              value={coachPhone}
              onChangeText={setCoachPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />
            
            <Subheading style={[styles.sectionTitle, styles.topMargin]}>Manager Information</Subheading>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Manager Name"
              value={managerName}
              onChangeText={setManagerName}
              style={styles.input}
            />
            
            <TextInput
              label="Manager Email"
              value={managerEmail}
              onChangeText={setManagerEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              label="Manager Phone"
              value={managerPhone}
              onChangeText={setManagerPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />
            
            <HelperText type="info" style={styles.helperText}>
              * Required fields
            </HelperText>
            
            <Button
              mode="contained"
              onPress={handleUpdate}
              style={styles.updateButton}
              loading={loading}
              disabled={loading || deleteLoading}
            >
              Update Team
            </Button>
            
            <Button
              mode="outlined"
              onPress={confirmDelete}
              style={styles.deleteButton}
              loading={deleteLoading}
              disabled={loading || deleteLoading}
              color="#D32F2F"
            >
              Delete Team
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  helperText: {
    marginBottom: 10,
  },
  updateButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#00563F',
  },
  deleteButton: {
    marginTop: 15,
    paddingVertical: 8,
    borderColor: '#D32F2F',
  },
});

export default EditTeamScreen;
