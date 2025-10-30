import React from "react";
// CORREÇÃO: useWindowDimensions importado
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Modal, ScrollView, ActivityIndicator, useWindowDimensions, Alert } from "react-native"; 
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from "react-native-popup-menu"; 
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from "expo-camera"; // Mantido, mas não usado
import { useState, useEffect } from "react";
import { CarregarSalas } from "../types/salas";
import { criarSalas, obterSalas } from "../services/servicoSalas";
import { obterToken } from "../services/servicoTokken";
// CORREÇÃO: Dimensions removido, pois usaremos o hook
// import { Dimensions } from "react-native"; 
import api from "../api/api";
import Load from "../screens/telaLoad";
import axios from 'axios'; 

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
    
    // CORREÇÃO: Usando useWindowDimensions corretamente
    const { width, height } = useWindowDimensions(); 

    const [visivel, setVisivel] = useState(false); // Modal de Criar
    const [ErroSala, setErroSala] = useState<boolean | null>(null);
    const [permissao, setPermissao] = useState<boolean>(false); // Para câmera, se for usar
    const [mensagemErro, setMensagemErro] = useState('');
    
    // --- State para Modal de CRIAÇÃO ---
    const [nomeSala, setNomeSala] = useState('');
    const [capacidade, setCapacidade] = useState(''); 
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescricao] = useState('');
    
    // --- State para Modal de EDIÇÃO ---
    const [modalEditor, setModalEditor] = useState(false);
    const [salaEditando, setSalaEditando] = useState<CarregarSalas | null>(null); 
    const [editNome, setEditNome] = useState('');
    const [editCapacidade, setEditCapacidade] = useState('');
    const [editLocalizacao, setEditLocalizacao] = useState('');
    const [editDescricao, setEditDescricao] = useState('');

    const navigation = useNavigation();
    
    // Agora 'width' vem do useWindowDimensions
    const telaMobile = width < 600; 

    // --- FUNÇÃO DE CARREGAR (Reutilizável) ---
    const carregarSalas = async() => {
        setCarregando(true);
        setErroSala(null); 
        try{
            const resposta = await obterSalas();
            setSalas(resposta);
            if (resposta.length === 0) {
                setErroSala(true);
                setMensagemErro("Nenhuma sala encontrada.");
            }
        } catch(Error) {
            console.error("Erro ao carregar salas:", Error);
            setErroSala(true);
            setMensagemErro("Falha ao carregar salas.");
        } finally {
            setCarregando(false);
        }
    }
    
    // --- FUNÇÃO DE DELETAR (Com Token) ---
    const deletar = async (qr_code_id : any) => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir esta sala?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try{
                             const token = await obterToken(); 
                             await api.delete(`salas/${qr_code_id}/`, {
                                headers: { 'Authorization': `Token ${token}` }
                             });
                            carregarSalas(); 
                            Alert.alert("Sucesso", "Sala excluída.");
                        } catch(error) {
                            console.error('Erro ao excluir a sala:', error);
                             if (axios.isAxiosError(error) && error.response) {
                                 console.error('Detalhes do erro API:', error.response.data);
                                 Alert.alert("Erro na API", `Não foi possível excluir a sala. Detalhes: ${JSON.stringify(error.response.data)}`);
                            } else {
                                Alert.alert("Erro", "Não foi possível excluir a sala.");
                            }
                        }
                    }
                }
            ]
        );
    }

    
    const mostrarModal = (visible: boolean) => {
        setVisivel(visible);
        if (visible) {
            setNomeSala('');
            setCapacidade('');
            setLocalizacao('');
            setDescricao('');
        }
    }

    // --- FUNÇÕES DE EDIÇÃO ---
    const abrirModalEditor = (item: CarregarSalas) => {
        setSalaEditando(item);
        setEditNome(item.nome_numero || ''); 
        setEditCapacidade(String(item.capacidade)); 
        setEditLocalizacao(item.localizacao || ''); 
        setEditDescricao(item.descricao || ''); 
        setModalEditor(true);
    }

    // Enviando JSON com Token
    const atualizarSala = async () => {
        if (!salaEditando) return;

        const capacidadeNumerica = parseInt(editCapacidade);
        if (isNaN(capacidadeNumerica) || capacidadeNumerica < 0) {
            Alert.alert("Erro", "Capacidade inválida. Insira um número válido (maior ou igual a 0).");
            return;
        }

        if (!editNome.trim() || !editLocalizacao.trim()) {
            Alert.alert("Atenção", "Preencha todos os campos obrigatórios (*).");
            return;
        }

        try {
            const dadosAtualizados = {
                nome_numero: editNome,
                capacidade: capacidadeNumerica,
                localizacao: editLocalizacao,
                descricao: editDescricao,
            };

            const token = await obterToken();

            await api.patch(`salas/${salaEditando.qr_code_id}/`, dadosAtualizados, {
                headers: { 'Authorization': `Token ${token}` }
            });

            setModalEditor(false);
            carregarSalas();
            Alert.alert("Sucesso", "Sala atualizada.");

        } catch (error) {
            console.error('Erro ao atualizar sala:', error);
            if (axios.isAxiosError(error) && error.response) {
                 console.error('Detalhes do erro API:', error.response.data);
                 Alert.alert("Erro na API", `Não foi possível atualizar a sala. Detalhes: ${JSON.stringify(error.response.data)}`);
            } else {
                 Alert.alert("Erro", "Não foi possível atualizar a sala.");
            }
        }
    }


    useEffect(() => {
        carregarSalas();
    }, []);

    // Permissão da Câmera
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setPermissao(status === 'granted');
        })();
    }, [])

    if (carregando) {
        return (<Load />);
    }

    if (ErroSala) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <Text style={{ fontSize: 18, fontFamily: fontFamily.regular, textAlign: 'center' }}>
                    {mensagemErro}
                </Text>
                <TouchableOpacity onPress={carregarSalas} style={[style.confirmButton, { marginTop: 20 }]}>
                    <Text style={style.modalButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }


    const renderizarSala = ({ item }: { item: CarregarSalas }) => (
        <View style={style.listItemContainer}>
            <TouchableOpacity
                onPress={() => {
                    console.log("[Salas.tsx] Navegando para DetalhesSalas com IdSala:", item.qr_code_id);
                    navigation.navigate("DetalhesSalas", { IdSala: item.qr_code_id });
                }}
                style={style.cardContainer}
            >
                <View style={style.cardImageContainer}>
                    <Image style={style.cardImage} source={{ uri: `https://zeladoria.tsr.net.br/${item.imagem}` }} />
                </View>

                <View style={style.cardContentContainer}>
                    <View style={style.cardHeader}>
                        <Text style={style.cardTitle} numberOfLines={2}>{item.nome_numero}</Text>
                        <View style={style.menuContainer}>
                            <Menu style={{ marginRight: 5 }}>
                                <MenuTrigger>
                                    <View style={{ padding: 5 }}>
                                        <Ionicons name="ellipsis-horizontal-outline" size={20} color={colors.sgray} />
                                    </View>
                                </MenuTrigger>
                                <MenuOptions customStyles={{ optionsContainer: style.menu }}>
                                    <MenuOption onSelect={() => deletar(item.qr_code_id)}>
                                        <View style={style.menuOption}>
                                            <Ionicons name="trash-outline" size={22} color={colors.sred} />
                                            <Text style={[style.menuOptionText, { color: colors.sred }]}>Excluir</Text>
                                        </View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => abrirModalEditor(item)}>
                                        <View style={style.menuOption}>
                                            <Ionicons name='color-wand-outline' size={22} color={colors.sblue} />
                                            <Text style={style.menuOptionText}>Editar</Text>
                                        </View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                    </View>
                    <View style={style.cardDetails}>
                        <Text style={style.detailText}>
                            <Text style={style.detailLabel}>Capacidade:</Text> {item.capacidade}
                        </Text>
                        <Text style={style.detailText}>
                            <Text style={style.detailLabel}>Localização:</Text> {item.localizacao}
                        </Text>
                        <View style={style.statusRow}>
                            <Text style={style.detailLabel}>Status:</Text>
                            <Text style={[
                                style.statusBadge,
                                {
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

    // --- FUNÇÃO DE CRIAR ---
    const criarSala = async () => {
        if (nomeSala.trim() === '' || capacidade.trim() === '' || localizacao.trim() === '') {
            Alert.alert("Atenção", "Preencha todos os campos obrigatórios (*).");
            return;
        }
        const capacidadeNumerica = parseInt(capacidade);
         if (isNaN(capacidadeNumerica) || capacidadeNumerica < 0) {
            Alert.alert("Erro", "Capacidade inválida. Insira um número válido (maior ou igual a 0).");
            return;
        }

        setVisivel(false);

        try {
            // Assumindo FormData para criar
            const formData = new FormData();
            const dadosSala = {
                nome_numero: nomeSala,
                capacidade: capacidadeNumerica,
                localizacao: localizacao,
                descricao: descricao
            };
            Object.entries(dadosSala).forEach(([key, value]) => {
                formData.append(key, String(value));
            });

             const token = await obterToken(); // Obter token se necessário
             // const resposta = await criarSalas(formData, token); // Passar token se necessário
            const resposta = await criarSalas(formData); 
            console.log(resposta);

            carregarSalas();
            Alert.alert("Sucesso", "Sala criada.");

        } catch (error: any) {
            console.error('Erro ao adicionar sala:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Detalhes do erro API:', error.response.data);
                Alert.alert("Erro na API", `Não foi possível adicionar a sala. Detalhes: ${JSON.stringify(error.response.data)}`);
            } else {
                Alert.alert("Erro", "Não foi possível adicionar a sala.");
            }
        }
    }


    return (
        <MenuProvider>
            <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>

                {/* --- MODAL DE CRIAÇÃO --- */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visivel}
                    onRequestClose={() => mostrarModal(false)}>
                    <View style={style.containerModal}>
                        {/* Usando a largura dinâmica do hook 'width' */}
                        <View style={[style.modalView, { width: width > 600 ? 500 : '90%' }]}>
                             <ScrollView showsVerticalScrollIndicator={false}>
                                 <Text style={style.modalLabel}>Nome da Sala*</Text>
                                 <TextInput placeholder="Ex : Informática 1" style={style.inputs} value={nomeSala} onChangeText={setNomeSala}></TextInput>

                                 <Text style={style.modalLabel}>Capacidade*</Text>
                                 <TextInput placeholder="Ex: 30" keyboardType="numeric" style={style.input2} value={capacidade} onChangeText={setCapacidade}></TextInput>

                                 <Text style={style.modalLabel}>Localização*</Text>
                                 <TextInput placeholder="Ex: BLOCO A" style={style.localizacao} value={localizacao} onChangeText={setLocalizacao}></TextInput>

                                 <Text style={style.modalLabel}>Descrição (Opcional)</Text>
                                 <TextInput placeholder="Ex: Sala de informatica, com projetor..." multiline={true} numberOfLines={4} style={style.descricao} value={descricao} onChangeText={setDescricao}></TextInput>
                             </ScrollView>
                             <View style={style.modalButtonRow}>
                                         <TouchableOpacity style={style.cancelButton} onPress={() => mostrarModal(false)}>
                                             <Text style={style.modalButtonText}>
                                                 Cancelar
                                             </Text>
                                         </TouchableOpacity>
                                         <TouchableOpacity style={style.confirmButton} onPress={criarSala}>
                                             <Text style={style.modalButtonText}>
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
                    <View style={style.containerModal}>
                         {/* Usando a largura dinâmica do hook 'width' */}
                        <View style={[style.modalView, { width: width > 600 ? 500 : '90%' }]}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={style.modalLabel}>Nome da Sala*</Text>
                                <TextInput placeholder="Ex : Informática 1" style={style.inputs} value={editNome} onChangeText={setEditNome}></TextInput>

                                <Text style={style.modalLabel}>Capacidade*</Text>
                                <TextInput placeholder="Ex: 30" keyboardType="numeric" style={style.input2} value={editCapacidade} onChangeText={setEditCapacidade}></TextInput>

                                <Text style={style.modalLabel}>Localização*</Text>
                                <TextInput placeholder="Ex: BLOCO A" style={style.localizacao} value={editLocalizacao} onChangeText={setEditLocalizacao}></TextInput>

                                <Text style={style.modalLabel}>Descrição (Opcional)</Text>
                                <TextInput placeholder="Ex: Sala de informatica, com projetor..." multiline={true} numberOfLines={4} style={style.descricao} value={editDescricao} onChangeText={setEditDescricao}></TextInput>
                            </ScrollView>
                            <View style={style.modalButtonRow}>
                                <TouchableOpacity style={style.cancelButton} onPress={() => setModalEditor(false)}>
                                    <Text style={style.modalButtonText}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={style.confirmButton} onPress={atualizarSala}>
                                    <Text style={style.modalButtonText}>
                                        Atualizar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Botão Flutuante de Adicionar */}
                <View style={style.headerAdd}>
                    <TouchableOpacity style={style.mostrarModal} onPress={() => mostrarModal(true)}>
                        <Text style={style.buttonAdd}>+</Text>
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

// Estilos Refinados
const style = StyleSheet.create({
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
        width : 100, // Largura fixa para imagem
         backgroundColor: '#eee', // Fundo enquanto a imagem carrega
    },
    cardImage: {
       aspectRatio: 3 / 4, // Proporção mais vertical
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
        paddingLeft: 15, // Padding só à esquerda do header
        paddingRight: 5, // Menos padding à direita (perto do menu)
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
        width : 130, // Aumentado para texto
        borderRadius : 8, // Mais arredondado
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
         paddingVertical: 12, // Mais espaço vertical
         paddingHorizontal: 15,
     },
     menuOptionText: {
         marginLeft: 12, // Mais espaço
         fontSize: 16,
         fontFamily: fontFamily.regular,
         color: colors.sgray,
     },
     cardDetails: {
         paddingLeft : 15, 
         paddingTop: 8, 
         paddingBottom: 12, 
         paddingRight: 15, // Adicionado padding à direita
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
         paddingHorizontal: 10, // Mais padding horizontal
         paddingVertical : 5, 
         marginLeft : 8, // Mais espaço
         borderRadius : 15, // Mais arredondado (pilula)
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
        backgroundColor : "rgba(0, 0, 0, 0.65)" // Mais escuro
    },
    modalView: { 
        backgroundColor : 'white', 
        // Largura definida inline
        padding : 25, 
        borderRadius : 15, 
        maxHeight: '90%', // Permite mais altura se necessário
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
        borderColor : '#ddd', // Borda mais suave
        width : '100%',
        borderRadius : 8,
        marginBottom : 18, // Mais espaço
        padding: 14, // Mais padding
        fontFamily: fontFamily.regular,
        fontSize: 16,
        backgroundColor: '#fff' // Fundo branco padrão
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
        marginBottom: 25, // Mais espaço antes dos botões
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
         paddingVertical: 14, // Mais padding
         paddingHorizontal: 20,
         backgroundColor : colors.sorange, 
         borderRadius: 8,
         flex: 1, 
         marginRight: 10, 
         alignItems: 'center', // Centraliza texto
     },
      confirmButton: { 
        paddingVertical: 14, // Mais padding
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