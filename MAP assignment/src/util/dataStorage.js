import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  TEAMS: 'namibia_hockey_teams',
  PLAYERS: 'namibia_hockey_players',
  EVENTS: 'namibia_hockey_events',
  EVENT_REGISTRATIONS: 'namibia_hockey_event_registrations',
  USERS: 'namibia_hockey_users',
  CURRENT_USER: 'namibia_hockey_currentUser',
};

// Storage keys for real-time information sharing
const STORAGE_KEYS_REALTIME = {
  NEWS: 'namibia_hockey_news',
  ANNOUNCEMENTS: 'namibia_hockey_announcements',
  NOTIFICATIONS: 'namibia_hockey_notifications',
};

// Initial mock data
const initialTeams = [
  { id: '1', name: 'Windhoek Warriors', category: 'Men', division: 'Premier', homeVenue: 'Windhoek Stadium' },
  { id: '2', name: 'Swakopmund Stars', category: 'Women', division: 'Premier', homeVenue: 'Swakopmund Field' },
  { id: '3', name: 'Walvis Bay Wolves', category: 'Mixed', division: 'First', homeVenue: 'Walvis Bay Arena' },
  { id: '4', name: 'Otjiwarongo Owls', category: 'Junior Boys', division: 'Junior', homeVenue: 'Otjiwarongo School' },
  { id: '5', name: 'Keetmanshoop Kings', category: 'Men', division: 'Second', homeVenue: 'Keetmanshoop Field' },
  { id: '6', name: 'Rundu Rangers', category: 'Women', division: 'First', homeVenue: 'Rundu Sports Complex' },
];

const initialPlayers = [
  { 
    id: '1', 
    firstName: 'John', 
    lastName: 'Doe', 
    teamId: '1', 
    position: 'Forward',
    jerseyNumber: '10',
    dateOfBirth: '1995-05-15',
    gender: 'Male',
    nationality: 'Namibian'
  },
  { 
    id: '2', 
    firstName: 'Jane', 
    lastName: 'Smith', 
    teamId: '2', 
    position: 'Midfielder',
    jerseyNumber: '8',
    dateOfBirth: '1997-03-22',
    gender: 'Female',
    nationality: 'Namibian'
  },
  { 
    id: '3', 
    firstName: 'Michael', 
    lastName: 'Johnson', 
    teamId: '1', 
    position: 'Defender',
    jerseyNumber: '4',
    dateOfBirth: '1994-11-10',
    gender: 'Male',
    nationality: 'Namibian'
  },
];

const initialEvents = [
  {
    id: '1',
    title: 'National Championship',
    description: 'Annual national hockey championship tournament',
    date: '2025-06-15',
    location: 'Windhoek National Stadium',
    imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
  },
  {
    id: '2',
    title: 'Youth Hockey Camp',
    description: 'Training camp for young hockey players',
    date: '2025-07-10',
    location: 'Swakopmund Sports Center',
    imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
  },
  {
    id: '3',
    title: 'Coastal Tournament',
    description: 'Regional tournament for coastal teams',
    date: '2025-08-22',
    location: 'Walvis Bay Hockey Field',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1736&q=80',
  },
];

const initialEventRegistrations = [];

const initialUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'password',
    name: 'Admin User',
    role: 'admin',
  }
];

// Initialize the storage with mock data if it doesn't exist
const initializeStorage = async () => {
  try {
    // Check if teams exist
    const teamsData = await AsyncStorage.getItem(STORAGE_KEYS.TEAMS);
    if (!teamsData) {
      await AsyncStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(initialTeams));
    }

    // Check if players exist
    const playersData = await AsyncStorage.getItem(STORAGE_KEYS.PLAYERS);
    if (!playersData) {
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(initialPlayers));
    }

    // Check if events exist
    const eventsData = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!eventsData) {
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(initialEvents));
    }

    // Check if event registrations exist
    const eventRegistrationsData = await AsyncStorage.getItem(STORAGE_KEYS.EVENT_REGISTRATIONS);
    if (!eventRegistrationsData) {
      await AsyncStorage.setItem(STORAGE_KEYS.EVENT_REGISTRATIONS, JSON.stringify(initialEventRegistrations));
    }

    // Check if users exist
    const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    if (!usersData) {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }

    console.log('Storage initialized successfully');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Get all teams
const getTeams = async () => {
  try {
    const teamsData = await AsyncStorage.getItem(STORAGE_KEYS.TEAMS);
    return teamsData ? JSON.parse(teamsData) : [];
  } catch (error) {
    console.error('Error getting teams:', error);
    return [];
  }
};

// Add a new team
const addTeam = async (team) => {
  try {
    const teams = await getTeams();
    const newTeam = {
      ...team,
      id: Date.now().toString(), // Generate a unique ID
    };
    const updatedTeams = [...teams, newTeam];
    await AsyncStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(updatedTeams));
    return newTeam;
  } catch (error) {
    console.error('Error adding team:', error);
    return null;
  }
};

// Update a team
const updateTeam = async (teamId, updatedData) => {
  try {
    const teams = await getTeams();
    const teamIndex = teams.findIndex(team => team.id === teamId);
    
    if (teamIndex === -1) {
      throw new Error('Team not found');
    }
    
    // Merge the existing team data with the updated data
    const updatedTeam = {
      ...teams[teamIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    teams[teamIndex] = updatedTeam;
    await AsyncStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    return updatedTeam;
  } catch (error) {
    console.error('Error updating team:', error);
    return null;
  }
};

// Delete a team
const deleteTeam = async (teamId) => {
  try {
    const teams = await getTeams();
    const updatedTeams = teams.filter(team => team.id !== teamId);
    
    if (updatedTeams.length === teams.length) {
      throw new Error('Team not found');
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(updatedTeams));
    
    // Also delete all players associated with this team
    const players = await getPlayers();
    const updatedPlayers = players.filter(player => player.teamId !== teamId);
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(updatedPlayers));
    
    // Delete event registrations for this team
    const registrations = await getEventRegistrations();
    const updatedRegistrations = registrations.filter(reg => reg.teamId !== teamId);
    await AsyncStorage.setItem(STORAGE_KEYS.EVENT_REGISTRATIONS, JSON.stringify(updatedRegistrations));
    
    return true;
  } catch (error) {
    console.error('Error deleting team:', error);
    return false;
  }
};

// Get a team by ID
const getTeamById = async (teamId) => {
  try {
    const teams = await getTeams();
    return teams.find(team => team.id === teamId) || null;
  } catch (error) {
    console.error('Error getting team by ID:', error);
    return null;
  }
};

// Get all players
const getPlayers = async () => {
  try {
    const playersData = await AsyncStorage.getItem(STORAGE_KEYS.PLAYERS);
    return playersData ? JSON.parse(playersData) : [];
  } catch (error) {
    console.error('Error getting players:', error);
    return [];
  }
};

// Get players by team ID
const getPlayersByTeamId = async (teamId) => {
  try {
    const players = await getPlayers();
    return players.filter(player => player.teamId === teamId);
  } catch (error) {
    console.error('Error getting players by team ID:', error);
    return [];
  }
};

// Add a new player
const addPlayer = async (player) => {
  try {
    const players = await getPlayers();
    const newPlayer = {
      ...player,
      id: Date.now().toString(), // Generate a unique ID
    };
    const updatedPlayers = [...players, newPlayer];
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(updatedPlayers));
    return newPlayer;
  } catch (error) {
    console.error('Error adding player:', error);
    return null;
  }
};

// Update a player
const updatePlayer = async (playerId, updatedData) => {
  try {
    const players = await getPlayers();
    const playerIndex = players.findIndex(player => player.id === playerId);
    
    if (playerIndex === -1) {
      throw new Error('Player not found');
    }
    
    // Merge the existing player data with the updated data
    const updatedPlayer = {
      ...players[playerIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    players[playerIndex] = updatedPlayer;
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    return updatedPlayer;
  } catch (error) {
    console.error('Error updating player:', error);
    return null;
  }
};

// Delete a player
const deletePlayer = async (playerId) => {
  try {
    const players = await getPlayers();
    const updatedPlayers = players.filter(player => player.id !== playerId);
    
    if (updatedPlayers.length === players.length) {
      throw new Error('Player not found');
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(updatedPlayers));
    return true;
  } catch (error) {
    console.error('Error deleting player:', error);
    return false;
  }
};

// Get a player by ID
const getPlayerById = async (playerId) => {
  try {
    const players = await getPlayers();
    return players.find(player => player.id === playerId) || null;
  } catch (error) {
    console.error('Error getting player by ID:', error);
    return null;
  }
};

// Get all events
const getEvents = async () => {
  try {
    const eventsData = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
    return eventsData ? JSON.parse(eventsData) : [];
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

// Add a new event
const addEvent = async (event) => {
  try {
    const events = await getEvents();
    const newEvent = {
      ...event,
      id: Date.now().toString(), // Generate a unique ID
    };
    const updatedEvents = [...events, newEvent];
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents));
    return newEvent;
  } catch (error) {
    console.error('Error adding event:', error);
    return null;
  }
};

// Get an event by ID
const getEventById = async (eventId) => {
  try {
    const events = await getEvents();
    return events.find(event => event.id === eventId) || null;
  } catch (error) {
    console.error('Error getting event by ID:', error);
    return null;
  }
};

// Get all event registrations
const getEventRegistrations = async () => {
  try {
    const registrationsData = await AsyncStorage.getItem(STORAGE_KEYS.EVENT_REGISTRATIONS);
    return registrationsData ? JSON.parse(registrationsData) : [];
  } catch (error) {
    console.error('Error getting event registrations:', error);
    return [];
  }
};

// Add a new event registration
const addEventRegistration = async (registration) => {
  try {
    const registrations = await getEventRegistrations();
    const newRegistration = {
      ...registration,
      id: Date.now().toString(), // Generate a unique ID
    };
    const updatedRegistrations = [...registrations, newRegistration];
    await AsyncStorage.setItem(STORAGE_KEYS.EVENT_REGISTRATIONS, JSON.stringify(updatedRegistrations));
    return newRegistration;
  } catch (error) {
    console.error('Error adding event registration:', error);
    return null;
  }
};

// Get registrations by event ID
const getRegistrationsByEventId = async (eventId) => {
  try {
    const registrations = await getEventRegistrations();
    return registrations.filter(registration => registration.eventId === eventId);
  } catch (error) {
    console.error('Error getting registrations by event ID:', error);
    return [];
  }
};

// Get registrations by team ID
const getRegistrationsByTeamId = async (teamId) => {
  try {
    const registrations = await getEventRegistrations();
    return registrations.filter(registration => registration.teamId === teamId);
  } catch (error) {
    console.error('Error getting registrations by team ID:', error);
    return [];
  }
};

// Clear all data (for testing purposes)
const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TEAMS,
      STORAGE_KEYS.PLAYERS,
      STORAGE_KEYS.EVENTS,
      STORAGE_KEYS.EVENT_REGISTRATIONS,
      STORAGE_KEYS.USERS,
      STORAGE_KEYS.CURRENT_USER,
    ]);
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// User management functions
const getUsers = async () => {
  const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
  return usersData ? JSON.parse(usersData) : [];
};

const registerUser = async (user) => {
  const users = await getUsers();
  
  // Check if username already exists
  const existingUser = users.find(u => u.username === user.username);
  if (existingUser) {
    throw new Error('Username already exists');
  }
  
  const newUser = {
    ...user,
    id: Date.now().toString(),
  };
  
  const updatedUsers = [...users, newUser];
  await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  
  // Store current user
  await storeUser(newUser);
  
  return newUser;
};

const loginUser = async (username, password) => {
  const users = await getUsers();
  
  // Find user with matching credentials
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    throw new Error('Invalid username or password');
  }
  
  // Store current user
  await storeUser(user);
  
  return user;
};

const storeUser = async (user) => {
  // Remove password before storing current user
  const { password, ...userWithoutPassword } = user;
  await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
};

const getUser = async () => {
  const userData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userData ? JSON.parse(userData) : null;
};

const removeUser = async () => {
  await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Initialize real-time data if it doesn't exist
const initializeRealtimeData = async () => {
  try {
    // Check if news exists
    const newsData = await AsyncStorage.getItem(STORAGE_KEYS_REALTIME.NEWS);
    if (!newsData) {
      await AsyncStorage.setItem(STORAGE_KEYS_REALTIME.NEWS, JSON.stringify([]));
    }

    // Check if announcements exist
    const announcementsData = await AsyncStorage.getItem(STORAGE_KEYS_REALTIME.ANNOUNCEMENTS);
    if (!announcementsData) {
      await AsyncStorage.setItem(STORAGE_KEYS_REALTIME.ANNOUNCEMENTS, JSON.stringify([]));
    }

    // Check if notifications exist
    const notificationsData = await AsyncStorage.getItem(STORAGE_KEYS_REALTIME.NOTIFICATIONS);
    if (!notificationsData) {
      await AsyncStorage.setItem(STORAGE_KEYS_REALTIME.NOTIFICATIONS, JSON.stringify([]));
    }

    console.log('Real-time data initialized successfully');
  } catch (error) {
    console.error('Error initializing real-time data:', error);
  }
};

// Get all news
const getNews = async () => {
  try {
    const newsData = await AsyncStorage.getItem(STORAGE_KEYS_REALTIME.NEWS);
    return newsData ? JSON.parse(newsData) : [];
  } catch (error) {
    console.error('Error getting news:', error);
    return [];
  }
};

// Add a news item
const addNewsItem = async (newsItem) => {
  try {
    const news = await getNews();
    const newNewsItem = {
      ...newsItem,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updatedNews = [newNewsItem, ...news];
    await AsyncStorage.setItem(STORAGE_KEYS_REALTIME.NEWS, JSON.stringify(updatedNews));
    return newNewsItem;
  } catch (error) {
    console.error('Error adding news item:', error);
    return null;
  }
};

// Get all announcements
const getAnnouncements = async () => {
  try {
    const announcementsData = await AsyncStorage.getItem(STORAGE_KEYS_REALTIME.ANNOUNCEMENTS);
    return announcementsData ? JSON.parse(announcementsData) : [];
  } catch (error) {
    console.error('Error getting announcements:', error);
    return [];
  }
};

// Add an announcement
const addAnnouncement = async (announcement) => {
  try {
    const announcements = await getAnnouncements();
    const newAnnouncement = {
      ...announcement,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updatedAnnouncements = [newAnnouncement, ...announcements];
    await AsyncStorage.setItem(STORAGE_KEYS_REALTIME.ANNOUNCEMENTS, JSON.stringify(updatedAnnouncements));
    
    // Also add a notification for this announcement
    await addNotification({
      title: 'New Announcement',
      message: announcement.title,
      type: 'announcement',
      relatedId: newAnnouncement.id,
    });
    
    return newAnnouncement;
  } catch (error) {
    console.error('Error adding announcement:', error);
    return null;
  }
};

// Get all notifications
const getNotifications = async () => {
  try {
    const notificationsData = await AsyncStorage.getItem(STORAGE_KEYS_REALTIME.NOTIFICATIONS);
    return notificationsData ? JSON.parse(notificationsData) : [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

// Add a notification
const addNotification = async (notification) => {
  try {
    const notifications = await getNotifications();
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      read: false,
    };
    const updatedNotifications = [newNotification, ...notifications];
    await AsyncStorage.setItem(STORAGE_KEYS_REALTIME.NOTIFICATIONS, JSON.stringify(updatedNotifications));
    return newNotification;
  } catch (error) {
    console.error('Error adding notification:', error);
    return null;
  }
};

// Mark notification as read
const markNotificationAsRead = async (notificationId) => {
  try {
    const notifications = await getNotifications();
    const notificationIndex = notifications.findIndex(notification => notification.id === notificationId);
    
    if (notificationIndex === -1) {
      throw new Error('Notification not found');
    }
    
    notifications[notificationIndex].read = true;
    await AsyncStorage.setItem(STORAGE_KEYS_REALTIME.NOTIFICATIONS, JSON.stringify(notifications));
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

export {
  initializeStorage,
  initializeRealtimeData,
  getTeams,
  getTeamById,
  addTeam,
  updateTeam,
  deleteTeam,
  getPlayers,
  getPlayerById,
  getPlayersByTeamId,
  addPlayer,
  updatePlayer,
  deletePlayer,
  getEvents,
  getEventById,
  getRegistrationsByTeamId,
  getRegistrationsByEventId,
  getNotifications,
  markNotificationAsRead,
  getAnnouncements,
  addAnnouncement,
  getNews,
  addNewsItem,
  registerUser,
  loginUser,
  getUser,
  storeUser,
  removeUser,
};
