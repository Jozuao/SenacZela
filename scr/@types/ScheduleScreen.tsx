import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { colors } from './theme';
import { useData } from './contexts/DataContext';
import { format } from 'date-fns';


export default function ScheduleScreen() {
const { rooms, schedules, addSchedule } = useData();
const [titulo, setTitulo] = useState('');
const [salaId, setSalaId] = useState(rooms[0]?.id ?? '');
const [inicioISO, setInicioISO] = useState('');
const [fimISO, setFimISO] = useState('');


return (
<View style={{ flex: 1, padding: 16, backgroundColor: colors.bg }}>
<Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 12 }}>Agendamentos</Text>


<View style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 16 }}>
<TextInput placeholder="Título" value={titulo} onChangeText={setTitulo} style={{ borderBottomWidth: 1, borderColor: '#eee', marginBottom: 8, paddingVertical: 6 }} />
<TextInput placeholder={`Sala (ID atual: ${salaId || '—'})`} value={salaId} onChangeText={setSalaId} style={{ borderBottomWidth: 1, borderColor: '#eee', marginBottom: 8, paddingVertical: 6 }} />
<TextInput placeholder="Início (ISO) ex: 2025-09-02T14:00:00-03:00" value={inicioISO} onChangeText={setInicioISO} style={{ borderBottomWidth: 1, borderColor: '#eee', marginBottom: 8, paddingVertical: 6 }} />
<TextInput placeholder="Fim (ISO)" value={fimISO} onChangeText={setFimISO} style={{ borderBottomWidth: 1, borderColor: '#eee', marginBottom: 8, paddingVertical: 6 }} />
<TouchableOpacity
onPress={() => {
if (!titulo || !salaId || !inicioISO || !fimISO) return;
addSchedule({ titulo, salaId, inicioISO, fimISO });
setTitulo(''); setInicioISO(''); setFimISO('');
}}
style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 12 }}>
<Text style={{ textAlign: 'center', color: 'white', fontWeight: '800' }}>Adicionar</Text>
</TouchableOpacity>
</View>


<FlatList
data={schedules}
keyExtractor={(i) => i.id}
renderItem={({ item }) => (
<View style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 10 }}>
<Text style={{ fontWeight: '700' }}>{item.titulo}</Text>
<Text style={{ color: colors.muted }}>Sala: {rooms.find(r => r.id === item.salaId)?.numero} • {rooms.find(r => r.id === item.salaId)?.nome}</Text>
<Text>Início: {format(new Date(item.inicioISO), 'dd/MM/yyyy HH:mm')}</Text>
<Text>Fim: {format(new Date(item.fimISO), 'dd/MM/yyyy HH:mm')}</Text>
</View>
)}
/>


<View style={{ marginTop: 8 }}>
<Text style={{ color: colors.muted }}>IDs de salas disponíveis: {rooms.map(r => `${r.id}(${r.numero})`).join(', ')}</Text>
</View>
</View>
);
}