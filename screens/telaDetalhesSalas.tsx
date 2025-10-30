import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import { obterSalasporID } from "../services/servicoSalas";
import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CarregarSalas } from "../types/salas";
import { parseISO, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Load from "./telaLoad";
import api from "../api/api";
import { Ionicons } from '@expo/vector-icons';

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

type DetalheSala = {
    IdSala : number 
}

// Tipo local para 'sala' que inclui 'isClean'
type SalaDetalhada = CarregarSalas & {
    isClean?: boolean;
}

export default function TelaDetalhesSalas() {
    const rota = useRoute()
    const navigation = useNavigation()
    const params = rota.params as DetalheSala | undefined;

    if (!params || typeof params.IdSala === 'undefined') {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{fontFamily: fontFamily.regular}}>Erro: ID da sala não encontrado.</Text>
            </View>
        );
    }

    const {IdSala} = params
    const [sala, setSala] = useState<SalaDetalhada | null>(null)
    const [carregando, setCarregando] = useState<boolean>(true)

    
    const displayLastCleanedTime = (utcDateTimeString: string | null): string => {
            if (!utcDateTimeString) {
              return "N/A";
            }
        
            try {
              const dateObjectUTC = parseISO(utcDateTimeString);
              
              return format(dateObjectUTC, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR });
        
            } catch (error) {
              console.error("Erro ao processar data/hora:", error);
              return "Data Inválida";
            }
    };

    useEffect(() => {
        const CarregarDetalhesSalas = async () => {
            setCarregando(true)
            try {
                const SalaEncontrada = await obterSalasporID(IdSala)
                const tempo = new Promise(resolve => setTimeout(resolve, 1000))
                await Promise.all([SalaEncontrada, tempo])

                // CORREÇÃO 1: 'setSala' chamado apenas uma vez
                const isClean = SalaEncontrada.status_limpeza === 'Limpa';
                setSala({ ...SalaEncontrada, isClean: isClean }); 
                
            } catch(error) {
                console.error("Erro ao encontrar Sala", error)
                setSala(null); 
            } finally {
                setCarregando(false)
            }

        }
        CarregarDetalhesSalas()
    }, [IdSala])

    // Lógica de Cores para o Status de Limpeza (Mantida)
    const getStatusStyles = (status: string | undefined | null) => {
        let statusTextColor;
        let statusBackgroundColor;

        switch(status) {
            case 'Limpa':
                statusTextColor = colors.sgreen;
                statusBackgroundColor = 'rgba(0, 128, 0, 0.1)'; 
                break;
            case 'Em Limpeza':
                statusTextColor = 'white';
                statusBackgroundColor = colors.sblue;
                break;
            default: // limpeza Pendente e outros
                statusTextColor = colors.sred;
                statusBackgroundColor = 'rgba(243, 31, 0, 0.1)'; 
                break;
        }
        return { color: statusTextColor, backgroundColor: statusBackgroundColor };
    }


    return(
        <View style={style.mainContainer}>
            {carregando ? (
                <View style={{flex : 1, justifyContent : 'center', alignItems: 'center'}}>
                    <Load/>
                </View>
            ) : (
                
                <ScrollView contentContainerStyle={style.scrollContent}>
                    <TouchableOpacity style={style.backButton} onPress={()=> navigation.goBack()}>
                        <Text style={style.backButtonText}>{"< Voltar"}</Text>
                    </TouchableOpacity>

                    <View style={style.contentArea}>
                        <Image 
                            style={style.image} 
                            source={{uri : `https://zeladoria.tsr.net.br/${sala?.imagem}`}}
                            // defaultSource={require('../img/placeholder.png')} 
                        />
                        
                        <View style={style.infoContainer}>
                            <Text style={style.roomTitle}>{sala?.nome_numero || 'Sala Desconhecida'}</Text>

                            <Text style={style.infoText}>
                                <Text style={style.infoLabel}>Capacidade:</Text> {sala?.capacidade} pessoas
                            </Text>
                            <Text style={style.infoText}>
                                <Text style={style.infoLabel}>Localização:</Text> {sala?.localizacao}
                            </Text>

                            <View style={style.statusRow}>
                                <Text style={style.infoLabel}>Status:</Text>
                                <Text style={[style.statusBadge, getStatusStyles(sala?.status_limpeza)]}>
                                    {sala?.status_limpeza}
                                </Text>
                            </View>

                            {/* CORREÇÃO 2: Aplicada (|| null) */}
                            <Text style={style.infoText}>
                                <Text style={style.infoLabel}>Última Limpeza:</Text> {displayLastCleanedTime(sala?.ultima_limpeza_data_hora || null)}
                            </Text>

                            {sala?.descricao && (
                                <View style={style.descriptionContainer}>
                                     <Text style={[style.infoLabel, {marginTop: 15}]}>Descrição:</Text>
                                     <Text style={style.infoText}>{sala.descricao}</Text>
                                </View>
                            )}

                        </View>
                    </View>
                </ScrollView>

            )}
        </View>

)}
// O StyleSheet (style) permanece o mesmo
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    scrollContent: {
        paddingTop: 30,
        paddingBottom: 20,
    },
    backButton: {
        marginLeft : 20,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        padding : 8, 
        backgroundColor : colors.sgray, 
        color: 'white',
        fontFamily: fontFamily.medium,
        width : 90, 
        borderRadius : 5, 
        textAlign : 'center',
        opacity: 0.8
    },
    contentArea: {
        width : '100%', 
        backgroundColor: 'white',
        shadowColor: colors.sgray,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    image: {
        height : 220, 
        width : '100%', 
        resizeMode : 'cover',
        marginBottom: 10,
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    roomTitle: {
        fontSize : 28, 
        fontFamily: fontFamily.bold,
        color: colors.sblue,
        marginBottom : 25, 
        marginTop : 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    infoText: {
        fontSize: 16,
        fontFamily: fontFamily.regular,
        color: colors.sgray,
        marginBottom: 8,
    },
    infoLabel: {
        fontFamily: fontFamily.medium,
        color: colors.sblue,
        marginRight: 5,
    },
    statusRow: {
        flexDirection : 'row', 
        alignItems : 'center',
        marginBottom: 15,
    },
    statusBadge: {
        paddingHorizontal : 10,
        paddingVertical : 5, 
        marginLeft : 10, 
        borderRadius : 5,
        fontFamily: fontFamily.medium,
        fontSize: 15,
        overflow: 'hidden',
    },
    descriptionContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    }
});