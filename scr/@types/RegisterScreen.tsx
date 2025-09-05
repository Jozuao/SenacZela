import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { colors } from './theme';
import { useAuth } from './contexts/AuthContext';


export default function RegisterScreen() {
const { register } = useAuth();
const [email, setEmail] = useState('');
const [nome, setNome] = useState('');
const [admin, setAdmin] = useState(false);


const handleRegister = () => {
register(email.trim(), nome.trim(), admin);
};


return (
<View style={{ flex: 1, backgroundColor: colors.bg, padding: 20, justifyContent: 'center' }}>
<Text style={{ fontSize: 26, fontWeight: '800', marginBottom: 16 }}>Crie sua conta</Text>
<TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 12 }} />
<TextInput placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 12 }} />


<TouchableOpacity onPress={() => setAdmin(!admin)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
<View style={{ width: 20, height: 20, marginRight: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', backgroundColor: admin ? colors.primary : 'transparent' }} />
<Text>Sou administrador</Text>
</TouchableOpacity>


<TouchableOpacity onPress={handleRegister} style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 14 }}>
<Text style={{ textAlign: 'center', color: 'white', fontWeight: '800' }}>Cadastrar</Text>
</TouchableOpacity>
</View>
);
}