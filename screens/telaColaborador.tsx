import React from "react";
// CORREÇÃO: Removido useIsFocused, useRoute (não usados aqui)
// CORRIGIDO: Removido espaço no nome do pacote
import { useNavigation } from "@react-navigation/native";
// Importações Corrigidas/Adicionadas
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Modal, ScrollView, ActivityIndicator, useWindowDimensions, Alert } from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from "react-native-popup-menu"; 
import { Ionicons } from '@expo/vector-icons';
// CORREÇÃO: Removido Camera se não for usar
// import { Camera, CameraView } from "expo-camera"; 
import { useState, useEffect } from "react";
import { CarregarSalas } from "../types/salas";
import { criarSalas, obterSalas } from "../services/servicoSalas";
import { obterToken } from "../services/servicoTokken";
// CORREÇÃO: Removido Dimensions
// import { Dimensions } from "react-native"; 
import api from "../api/api";
import Load from "../screens/telaLoad";
import axios from 'axios'; // Importar axios para checar tipo de erro

// --- Componentes de Estilo (Mantidos) ---
export const colors = {
    sgray: '#555e67',
    sblue: '#004A8D',
    sorange: '#F7941D',
    sred: '#F31F00',
    sgreen: '#008000',
    syellow: '#fca510',
    tagColors: [
        '#007BFF', '#32CD32', '#FF8C00', '#FF1493', '#8A2BE2', '#FFD700', '#00CED1'
    ]
}
export const fontFamily = {
    regular: 'Roboto', 
    bold: "Roboto_700Bold",
    medium: "Roboto_500Medium",
    arial: 'Arial'
}
// ---------------------------------------------


export default function Salas () {
    const [carregando, setCarregando] = useState(true);
    const [salas, setSalas] = useState<CarregarSalas[]>([]);
    
    // CORREÇÃO: Usando apenas useWindowDimensions
    const { width, height } = useWindowDimensions(); 

    const [visivel, setVisivel] = useState(false); // Modal de Criar
    const [ErroSala, setErroSala] = useState<boolean | null>(null);
    // const [permissao, setPermissao] = useState<boolean>(false); // Relacionado à câmera, remover se não usar
    const [mensagemErro, setMensagemErro] = useState('');
    
    // States para Modais (mantidos)
    const [nomeSala, setNomeSala] = useState('');
    const [capacidade, setCapacidade] = useState(''); 
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [modalEditor, setModalEditor] = useState(false);
    const [salaEditando, setSalaEditando] = useState<CarregarSalas | null>(null); 
    const [editNome, setEditNome] = useState('');
    const [editCapacidade, setEditCapacidade] = useState('');
    const [editLocalizacao, setEditLocalizacao] = useState('');
    const [editDescricao, setEditDescricao] = useState('');

    const navigation = useNavigation();
    
    // CORREÇÃO: Usando 'width' do hook
    const telaMobile = width < 600; 

    // --- FUNÇÕES ---
    
    const carregarSalas = async() => { /* ... (código mantido) ... */ }
    const deletar = async (qr_code_id : any) => { /* ... (código mantido, com token no delete) ... */ }
    const mostrarModal = (visible: boolean) => { /* ... (código mantido) ... */ }
    const abrirModalEditor = (item: CarregarSalas) => { /* ... (código mantido, com fallbacks) ... */ }
    const atualizarSala = async () => { /* ... (código mantido, com JSON, Token e isAxiosError) ... */ }
    const criarSala = async () => { /* ... (código mantido, com validação e FormData/Token opcional) ... */ }

    // --- UseEffects ---
    useEffect(() => {
        carregarSalas();
    }, []);

    // Remover este useEffect se a câmera não for usada
    /*
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setPermissao(status === 'granted');
        })();
    }, [])
    */

    // --- RENDERIZAÇÃO CONDICIONAL ---
    if (carregando) { return (<Load />); }

    if (ErroSala) {
        return (
            <View style={styles.centeredMessageContainer}>
                <Text style={styles.errorMessageText}>
                    {mensagemErro}
                </Text>
                <TouchableOpacity onPress={carregarSalas} style={[styles.confirmButton, { marginTop: 20 }]}>
                    <Text style={styles.modalButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }


    // --- RENDER ITEM DA LISTA ---
    const renderizarSala = ({ item }: { item: CarregarSalas }) => (
        <View style={styles.listItemContainer}>
            <TouchableOpacity
                onPress={() => {
                    console.log("[Salas.tsx] Navegando para DetalhesSalas com IdSala:", item.qr_code_id);
                    // Verifique se o nome "DetalhesSalas" e o parâmetro "IdSala" estão corretos!
                    navigation.navigate("DetalhesSalas", { IdSala: item.qr_code_id });
                }}
                style={styles.cardContainer}
            >
                {/* Imagem */}
                <View style={styles.cardImageContainer}>
                    <Image style={styles.cardImage} source={{ uri: `https://zeladoria.tsr.net.br/${item.imagem}` }} />
                </View>

                {/* Conteúdo */}
                <View style={styles.cardContentContainer}>
                    {/* Header (Título + Menu) */}
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle} numberOfLines={2}>{item.nome_numero}</Text>
                        <View style={styles.menuContainer}>
                            <Menu style={{ marginRight: 5 }}>
                                <MenuTrigger>
                                    <View style={{ padding: 5 }}> 
                                        <Ionicons name="ellipsis-horizontal-outline" size={20} color={colors.sgray} />
                                    </View>
                                </MenuTrigger>
                                <MenuOptions customStyles={{ optionsContainer: styles.menu }}>
                                    <MenuOption onSelect={() => deletar(item.qr_code_id)}>
                                        <View style={styles.menuOption}>
                                            <Ionicons name="trash-outline" size={22} color={colors.sred} />
                                            <Text style={[styles.menuOptionText, { color: colors.sred }]}>Excluir</Text>
                                        </View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => abrirModalEditor(item)}>
                                        <View style={styles.menuOption}>
                                            <Ionicons name='color-wand-outline' size={22} color={colors.sblue} />
                                            <Text style={styles.menuOptionText}>Editar</Text>
                                        </View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                    </View>
                    {/* Detalhes (Capacidade, Localização, Status) */}
                    <View style={styles.cardDetails}>
                        <Text style={styles.detailText}>
                            <Text style={styles.detailLabel}>Capacidade:</Text> {item.capacidade}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.detailLabel}>Localização:</Text> {item.localizacao}
                        </Text>
                        <View style={styles.statusRow}>
                            <Text style={styles.detailLabel}>Status:</Text>
                            <Text style={[
                                styles.statusBadge,
                                { // Estilos condicionais para o status
                                    color: item.status_limpeza === 'Limpa' ? colors.sgreen : item.status_limpeza === 'Em Limpeza' ? 'white' : colors.sred,
                                    backgroundColor: item.status_limpeza === 'Limpa' ? 'rgba(0, 128, 0, 0.1)' : item.status_limpeza === 'Em Limpeza' ? colors.sblue : 'rgba(243, 31, 0, 0.1)'
                                }
                            ]}>
                                {item.status_limpeza}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    // --- RETURN PRINCIPAL ---
    return (
        <MenuProvider>
            <View style={styles.mainContainer}>

                {/* --- MODAL DE CRIAÇÃO --- */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visivel}
                    onRequestClose={() => mostrarModal(false)}>
                    <View style={styles.containerModal}>
                        {/* CORREÇÃO: Largura dinâmica aplicada aqui */}
                        <View style={[styles.modalView, { width: width > 600 ? 500 : '90%' }]}>
                             <ScrollView showsVerticalScrollIndicator={false}>
                                 <Text style={styles.modalLabel}>Nome da Sala*</Text>
                                 <TextInput placeholder="Ex : Informática 1" style={styles.inputs} value={nomeSala} onChangeText={setNomeSala}></TextInput>

                                 <Text style={styles.modalLabel}>Capacidade*</Text>
                                 <TextInput placeholder="Ex: 30" keyboardType="numeric" style={styles.input2} value={capacidade} onChangeText={setCapacidade}></TextInput>

                                 <Text style={styles.modalLabel}>Localização*</Text>
                                 <TextInput placeholder="Ex: BLOCO A" style={styles.localizacao} value={localizacao} onChangeText={setLocalizacao}></TextInput>

                                 <Text style={styles.modalLabel}>Descrição (Opcional)</Text>
                                 <TextInput placeholder="Ex: Sala de informatica, com projetor..." multiline={true} numberOfLines={4} style={styles.descricao} value={descricao} onChangeText={setDescricao}></TextInput>
                             </ScrollView>
                             <View style={styles.modalButtonRow}>
                                         <TouchableOpacity style={styles.cancelButton} onPress={() => mostrarModal(false)}>
                                             <Text style={styles.modalButtonText}>
                                                 Cancelar
                                             </Text>
                                         </TouchableOpacity>
                                         <TouchableOpacity style={styles.confirmButton} onPress={criarSala}>
                                             <Text style={styles.modalButtonText}>
                                                 + Adicionar
                                             </Text>
                                         </TouchableOpacity>
                             </View>
                        </View>
                    </View>
                </Modal>

                {/* --- MODAL DE EDIÇÃO --- */}
                <Modal
                    transparent={true}
                    visible={modalEditor}
                    onRequestClose={() => setModalEditor(false)}
                    animationType="slide"
                >
                    <View style={styles.containerModal}>
                        {/* CORREÇÃO: Largura dinâmica aplicada aqui */}
                        <View style={[styles.modalView, { width: width > 600 ? 500 : '90%' }]}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.modalLabel}>Nome da Sala*</Text>
                                <TextInput placeholder="Ex : Informática 1" style={styles.inputs} value={editNome} onChangeText={setEditNome}></TextInput>

                                <Text style={styles.modalLabel}>Capacidade*</Text>
                                <TextInput placeholder="Ex: 30" keyboardType="numeric" style={styles.input2} value={editCapacidade} onChangeText={setEditCapacidade}></TextInput>

                                <Text style={styles.modalLabel}>Localização*</Text>
                                <TextInput placeholder="Ex: BLOCO A" style={styles.localizacao} value={editLocalizacao} onChangeText={setEditLocalizacao}></TextInput>

                                <Text style={styles.modalLabel}>Descrição (Opcional)</Text>
                                <TextInput placeholder="Ex: Sala de informatica, com projetor..." multiline={true} numberOfLines={4} style={styles.descricao} value={editDescricao} onChangeText={setEditDescricao}></TextInput>
                            </ScrollView>
                            <View style={styles.modalButtonRow}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalEditor(false)}>
                                    <Text style={styles.modalButtonText}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.confirmButton} onPress={atualizarSala}>
                                    <Text style={styles.modalButtonText}>
                                        Atualizar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Botão Flutuante de Adicionar */}
                <View style={styles.headerAdd}>
                    <TouchableOpacity style={styles.mostrarModal} onPress={() => mostrarModal(true)}>
                        <Text style={styles.buttonAdd}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Lista de Salas */}
                <FlatList
                    data={salas}
                    keyExtractor={(item) => item.qr_code_id.toString()}
                    renderItem={renderizarSala}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ paddingBottom: 100 }} 
                />
            </View>
        </MenuProvider>
    )
}

// Estilos Refinados (Incluindo os estilos de card e modal da resposta anterior)
// CORREÇÃO: Renomeado 'style' para 'styles' para seguir convenção
const styles = StyleSheet.create({
    mainContainer: { // Adicionado estilo para o container principal
        flex: 1, 
        backgroundColor: '#f0f0f0'
    },
     centeredMessageContainer: { // Para tela de erro
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 20 
    },
    errorMessageText: { // Para texto de erro
        fontSize: 18, 
        fontFamily: fontFamily.regular, 
        textAlign: 'center',
        color: colors.sred // Cor de erro
    },
    // --- Geral ---
    headerAdd : { 
        position: 'absolute', 
        bottom: 30,
        right: 20,
        zIndex: 10, 
    },
    mostrarModal : { 
        backgroundColor : colors.sblue,
        width: 60, 
        height: 60,
        borderRadius : 30, 
        justifyContent: 'center', 
        alignItems: 'center',
        shadowColor: colors.sblue,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
     buttonAdd : { 
        fontSize : 30, 
        color : 'white',
        fontFamily: fontFamily.bold,
        lineHeight: 35 
    },
    listItemContainer: { 
        alignItems : 'center',
        width: '100%',
    },

    // --- Card da Sala ---
    cardContainer: {
        backgroundColor : "white",
        flexDirection : 'row', 
        borderRadius : 10, 
        marginVertical: 8, 
        marginHorizontal: '5%', 
        // minHeight: 150, // Removido para altura dinâmica
        width : '90%',
        shadowColor: colors.sgray,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        overflow: 'hidden', 
    },
    cardImageContainer: {
        width : 100, // Largura fixa menor
        backgroundColor: '#eee', 
    },
    cardImage: {
        aspectRatio: 3 / 4, 
        width: '100%',
        height: undefined, 
        resizeMode : 'cover', 
    },
    cardContentContainer: {
        flex : 1,
        flexDirection : 'column',
        justifyContent: 'space-between', 
    },
    cardHeader: {
        width : '100%', 
        flexDirection : 'row', 
        justifyContent : 'space-between', 
        alignItems: 'flex-start', 
        borderBottomWidth : 1, 
        borderBottomColor: '#eee', 
        paddingVertical : 10, 
        paddingLeft: 15, 
        paddingRight: 5, 
    },
     cardTitle: {
        fontSize : 17, 
        fontFamily: fontFamily.bold, 
        color: colors.sblue,
        flex: 1, 
        marginRight: 5, 
     },
     menuContainer: {
         // Ajustes finos se o ícone do menu não alinhar bem
     },
     menu : { 
        width : 130, 
        borderRadius : 8, 
        backgroundColor: 'white', 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
     },
     menuOption: {
         flexDirection: 'row',
         alignItems: 'center',
         paddingVertical: 12, 
         paddingHorizontal: 15,
     },
     menuOptionText: {
         marginLeft: 12, 
         fontSize: 16,
         fontFamily: fontFamily.regular,
         color: colors.sgray,
     },
     cardDetails: {
         paddingLeft : 15, 
         paddingTop: 8, 
         paddingBottom: 12, 
         paddingRight: 15, 
     },
     detailText: {
         fontSize : 14, 
         fontFamily: fontFamily.regular, 
         color: colors.sgray,
         marginBottom: 4, 
     },
     detailLabel: {
         fontFamily: fontFamily.medium, 
         color: colors.sgray, 
         marginRight: 4,
     },
     statusRow: {
         flexDirection : 'row', 
         alignItems : 'center',
         marginTop: 6, 
     },
     statusBadge: {
         paddingHorizontal: 10, 
         paddingVertical : 5, 
         marginLeft : 8, 
         borderRadius : 15, 
         fontFamily: fontFamily.medium,
         fontSize: 13, 
         overflow: 'hidden', 
         textAlign: 'center',
     },

    // --- Modal ---
    containerModal : { 
        ...StyleSheet.absoluteFillObject,
        justifyContent : 'center',
        alignItems : 'center',
        flex : 1,
        backgroundColor : "rgba(0, 0, 0, 0.65)" 
    },
    modalView: { 
        backgroundColor : 'white', 
        // Largura definida inline no JSX
        padding : 25, 
        borderRadius : 15, 
        maxHeight: '90%', 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
     modalLabel: {
         fontSize: 16,
         fontFamily: fontFamily.medium,
         color: colors.sgray,
         marginBottom: 6,
     },
    inputs : { 
        borderWidth : 1,
        borderColor : '#ddd', 
        width : '100%',
        borderRadius : 8,
        marginBottom : 18, 
        padding: 14, 
        fontFamily: fontFamily.regular,
        fontSize: 16,
        backgroundColor: '#fff' 
    },
    input2 : { 
        borderWidth : 1,
        borderColor : '#ddd',
        width : '100%',
        borderRadius : 8,
        marginBottom : 18,
        padding: 14,
        fontFamily: fontFamily.regular,
        fontSize: 16,
        backgroundColor: '#fff'
    },
    descricao : { 
        borderWidth : 1,
        borderColor : '#ddd',
        width : '100%',
        borderRadius : 8,
        height: 120, 
        padding: 14,
        textAlignVertical: 'top', 
        fontFamily: fontFamily.regular,
        fontSize: 16,
        marginBottom: 25, 
        backgroundColor: '#fff'
    },
    localizacao : { 
        borderWidth : 1,
        borderColor : '#ddd',
        width : '100%',
        borderRadius : 8,
        marginBottom : 18,
        padding: 14,
        fontFamily: fontFamily.regular,
        fontSize: 16,
        backgroundColor: '#fff'
    },
     modalButtonRow: { 
         flexDirection : 'row', 
         justifyContent:'space-between', 
         paddingTop : 15, 
         width : '100%', 
         marginTop: 10,
         borderTopWidth: 1, 
         borderTopColor: '#eee',
     },
     cancelButton: {
         paddingVertical: 14, 
         paddingHorizontal: 20,
         backgroundColor : colors.sorange, 
         borderRadius: 8,
         flex: 1, 
         marginRight: 10, 
         alignItems: 'center', 
     },
      confirmButton: { 
        paddingVertical: 14, 
        paddingHorizontal: 20,
        backgroundColor : colors.sblue,
        borderRadius: 8,
        alignItems : 'center',
        flex: 1, 
     },
     modalButtonText : { 
        fontSize : 16, 
        color : 'white',
        fontFamily: fontFamily.bold,
        textAlign: 'center',
     },
});