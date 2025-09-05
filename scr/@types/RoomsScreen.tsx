import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useData } from './contexts/DataContext';
import { useAuth } from './contexts/AuthContext';
import RoomCard from './components/RoomCard';
import { colors } from './theme';


export default function RoomsScreen() {
const { rooms, toggleRoomStatus, subscribeRoom } = useData();
const { user } = useAuth();


return (
<View style={{ flex: 1, padding: 16, backgroundColor: colors.bg }}>
<Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 12 }}>Salas</Text>
<FlatList
data={rooms}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<RoomCard
room={item}
onToggleStatus={() => toggleRoomStatus(item.id)}
onSubscribe={() => subscribeRoom(item.id)}
subscribed={!!user && item.subscribers.includes(user.id)}
/>
)}
/>
</View>
);
}