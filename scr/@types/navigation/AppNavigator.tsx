import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../LoginScreen';
import RegisterScreen from '../RegisterScreen';
import RoomsScreen from '../RoomsScreen';
import ScheduleScreen from '../ScheduleScreen';
import AdminScreen from '../AdminScreen';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';


const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();


function MainTabs() {
const { user } = useAuth();
return (
<Tabs.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
<Tabs.Screen name="Salas" component={RoomsScreen} options={{
tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'business' : 'business-outline'} size={22} />,
}} />
<Tabs.Screen name="Agendamentos" component={ScheduleScreen} options={{
tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={22} />,
}} />
{user?.isAdmin && (
<Tabs.Screen name="Admin" component={AdminScreen} options={{
tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'settings' : 'settings-outline'} size={22} />,
}} />
)}
</Tabs.Navigator>
);
}


export default function AppNavigator() {
const { user } = useAuth();
return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
{!user ? (
<>
<Stack.Screen name="Login" component={LoginScreen} />
<Stack.Screen name="Register" component={RegisterScreen} />
</>
) : (
<Stack.Screen name="Main" component={MainTabs} />
)}
</Stack.Navigator>
);
}