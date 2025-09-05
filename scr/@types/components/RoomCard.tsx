import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, shadow } from '../theme';
import type { Room } from '..';
import { Ionicons } from '@expo/vector-icons';


interface Props {
room: Room;
onToggleStatus: () => void;
onSubscribe: () => void;
subscribed: boolean;
}


const RoomCard: React.FC<Props> = ({ room, onToggleStatus, onSubscribe, subscribed }) => {
const statusColor = room.status === 'limpo' ? colors.success : colors.danger;
return (
<View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, ...shadow }}>
<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
<View>
<Text style={{ fontSize: 18, fontWeight: '700' }}>{room.nome}</Text>
<Text style={{ color: colors.muted }}>Sala {room.numero} • Capacidade {room.capacidade}</Text>
</View>
<TouchableOpacity onPress={onSubscribe} accessibilityLabel="Sino de notificação">
<Ionicons name={subscribed ? 'notifications' : 'notifications-outline'} size={26} />
</TouchableOpacity>
</View>


<View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
<View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: statusColor }} />
<Text style={{ fontWeight: '600' }}>Status: {room.status.toUpperCase()}</Text>
</View>


<View style={{ marginTop: 12, flexDirection: 'row', gap: 12 }}>
<TouchableOpacity onPress={onToggleStatus} style={{ backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 }}>
<Text style={{ color: 'white', fontWeight: '700' }}>Alternar Limpeza</Text>
</TouchableOpacity>
</View>
</View>
);
};


export default RoomCard;