import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { colors } from './theme';
import { useData } from './contexts/DataContext';


export default function AdminScreen() {
const { rooms, addRoom } = useData();
const [nome, setNome] = useState('');
const [numero, setNumero] = useState('');
const [capacidade, setCapacidade] = useState('');


return (
<View style={{ flex: 1, padding: 16, backgroundColor: colors.bg }}>
<Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 12 }}>Administração</Text>


<View style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 16 }}>
<TextInput placeholder="Nome da sala" value={nome} onChangeText={setNome} style={{ borderBottomWidth: 1, borderColor: '#eee', marginBottom: 8, paddingVertical: 6 }} />
<TextInput placeholder="Número/Identificador" value={numero} onChangeText={setNumero} style={{ borderBottomWidth: 1, borderColor: '#eee', marginBottom: 8, paddingVertical: 6 }} />
<TextInput placeholder="Capacidade" keyboardType="numeric" value={capacidade} onChangeText={setCapacidade} style={{ borderBottomWidth: 1, borderColor: '#eee', marginBottom: 8, paddingVertical: 6 }} />
<TouchableOpacity
onPress={() => {
if (!nome || !numero || !capacidade) return;
addRoom({ nome, numero, capacidade: Number(capacidade), status: 'pendente' });
setNome(''); setNumero(''); setCapacidade('');
}}
style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 12 }}>
<Text style={{ textAlign: 'center', color: 'white', fontWeight: '800' }}>Adicionar sala</Text>
</TouchableOpacity>
</View>


<FlatList
data={rooms}
keyExtractor={(i) => i.id}
renderItem={({ item }) => (
<View style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 10 }}>
<Text style={{ fontWeight: '700' }}>{item.nome} (Sala {item.numero})</Text>
<Text style={{ color: colors.muted }}>Capacidade: {item.capacidade} • Status: {item.status}</Text>
</View>
)}
/>
</View>
);
}