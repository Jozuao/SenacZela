import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native"
import api from "../api/api"
import { useState, useEffect, useRef } from "react"
import { Camera, CameraView } from "expo-camera"
import { obterToken } from "../services/servicoTokken"
import { Ionicons } from '@expo/vector-icons';


// --- Importação dos Componentes de Estilo ---
export const colors = {
    sgray: '#555e67',
    sblue: '#004A8D',
    sorange: '#F7941D',
    sred: '#F31F00',
    sgreen: '#008000',
    syellow: '#fca510',
    tagColors: [
        '#007BFF', // Azul Elétrico
        '#32CD32', // Verde Limão
        '#FF8C00', // Laranja Vibrante
        '#FF1493', // Rosa Choque
        '#8A2BE2', // Roxo Escuro
        '#FFD700', // Amarelo Ouro
        '#00CED1', // Ciano
    ]
}
export const fontFamily = {
    regular: 'Roboto', 
    bold: "Roboto_700Bold",
    medium: "Roboto_500Medium",
    arial: 'Arial'
}
// ---------------------------------------------


interface telaColaboradorProps {
    aoLogout : () => void
}



export default function Settings ({aoLogout} : telaColaboradorProps){
    const [user, setUser] = useState('')
    const [status, setStatus] = useState('')
    const [imagem, setimagem] = useState<any | null>(null)
    const [fotoPerfil, setFotoPerfil] = useState<boolean>(false)
    const [showCamera, setShowCamera] = useState<boolean | null>(null)
    const [permissao, setPermissao] = useState<boolean>(false)
    const foto = useRef<CameraView>(null)


    const tirarFoto = async () => {
        const formData = new FormData()
        if (foto.current) {
            const newFoto = await foto.current.takePictureAsync({
                quality : 0.5,
                skipProcessing : false
            });
            const filename = newFoto.uri.split('/').pop();
            const fileType = 'image/jpeg'
            formData.append('profile_picture', {
                uri : newFoto.uri,
                name : filename,
                type : fileType
            } as any);

            try {
                const token = await obterToken()
                const resposta = await api.patch('accounts/profile/', formData, {
                    headers : {
                        'Content-Type' : 'multipart/form-data',
                        'Authorization' : `Token ${token}`
                    }
                })
                if (resposta.status === 200) {
                    // Atualiza a imagem sem a necessidade de uma nova função async/await aninhada
                    // apenas usando a URL de resposta se disponível, ou forçando um recarregamento
                    console.log("Foto de perfil atualizada com sucesso!");
                    setShowCamera(false); // Fecha a câmera
                }
            } catch(error) {
                console.error(error)
            }
            

        }
    }

    useEffect(() => {
        (async () => {
            // Solicitação de permissão da câmera
            const {status} = await Camera.requestCameraPermissionsAsync();
            setPermissao(status === 'granted')
        })();

        const obterUser =async () => {
            try {
                const resposta = await api.get('accounts/current_user/')
                setUser(resposta.data.username)
                // Assumindo que is_superuser é um boolean
                setStatus(resposta.data.is_superuser) 
                setimagem(resposta.data.profile.profile_picture)
                
                // Verifica se a imagem existe para decidir o ícone
                if (resposta.data.profile.profile_picture) { 
                    setFotoPerfil(true)
                } else {
                    setFotoPerfil(false)
                }
            } catch (error) {
                console.error("Erro ao obter usuário", error)
            }
        }
        obterUser()
        
        // Adicionei um array de dependências para evitar loop infinito de re-renderização
    }, [showCamera]) 

    if (showCamera) {
        if(!permissao) {
            return(
                <View style={{flex : 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontFamily: fontFamily.regular}}>Permissão de câmera não concedida</Text>
                    <TouchableOpacity style={[style.RangeLogout, {backgroundColor: colors.sgray, marginTop: 20}]} onPress={()=> setShowCamera(false)}>
                        <Text style={{color : 'white', fontFamily : fontFamily.bold}}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        return(
            <View style={{flex : 1}}>
                <CameraView style={{flex : 1}} facing="front" zoom={0} ref={foto}/>
                {/* Botão de Fechar - Usando sorange */}
                <TouchableOpacity style={style.cameraCloseButton} onPress={()=> setShowCamera(false)}>
                    <Text style={{fontSize : 20, color : 'white', fontFamily: fontFamily.bold}}>X</Text>
                </TouchableOpacity>
                {/* Botão de Tirar Foto - Estilizado com sblue */}
                <TouchableOpacity style={style.cameraCaptureButton} onPress={tirarFoto}>
                </TouchableOpacity>
            </View>
        )
    }


    return (
        
        <View style={[style.container, {backgroundColor: '#f0f0f0'}]}>
            {/* Header */}
            <View style={style.header}>
                <Text style={style.headerText}>
                    Configurações
                </Text>
            </View>
            
            {/* Opções de Perfil/Logout */}
                <View style={style.options}>
                    
                    {/* Imagem do Perfil */}
                    <TouchableOpacity style={style.userContainer} onPress={() => setShowCamera(true)}>
                        {fotoPerfil && imagem ? (
                            <Image style={style.user} source={{uri: `https://zeladoria.tsr.net.br/${imagem}`}}/>
                        ) : (
                            // Placeholder caso não haja foto
                            <View style={[style.user, {backgroundColor: colors.sgray, justifyContent: 'center', alignItems: 'center'}]}>
                                <Ionicons name="camera-outline" size={50} color="white" />
                            </View>
                            
                        )}
                    </TouchableOpacity>
                    
                    {/* Nome do Usuário */}
                    <Text style={style.nomeUser}>{user}</Text>
                    
                    {/* Infos do Usuário (Status) */}
                    <View style={style.infosUser}>
                        <View style={style.texts}>
                            <Text style={{fontFamily: fontFamily.regular, color: colors.sgray}}>
                                <Text style={{fontFamily: fontFamily.medium}}>Status:</Text> {status ? 'Administrador' : 'Usuário'}
                            </Text>
                        </View>
                    </View>
                    
                    {/* Botão de Logout */}
                    <TouchableOpacity style={style.RangeLogout} onPress={aoLogout}>
                        <Text style={style.logoutText}>Sair do App</Text>
                    </TouchableOpacity>
                </View>
        </View> 
        

    )
}

const style = StyleSheet.create({
    container : {
        flex: 1, // Para ocupar toda a tela
        alignItems : 'center',
    },
    // Header
    header : {
        height : 100, 
        alignItems : 'flex-start', 
        width : '100%', 
        justifyContent : 'flex-end', 
        borderBottomWidth : 3, 
        borderBottomColor : colors.sorange,
        backgroundColor: 'white',
        paddingBottom: 10,
        // Sombra leve para destacar o header
        shadowColor: colors.sgray,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    headerText: {
        marginLeft : 20, 
        fontSize : 26, 
        fontFamily : fontFamily.bold, 
        color : colors.sblue
    },
    // Imagem do Perfil
    userContainer: {
        marginBottom: 20,
    },
    user : {
        width : 100,
        height : 100,
        borderRadius : 50,
        borderWidth: 3,
        borderColor: colors.sblue,
        overflow: 'hidden', // Para garantir que a imagem se encaixe no borderRadius
    },
    nomeUser : {
        marginBottom : 25,
        fontSize : 24,
        fontFamily : fontFamily.bold,
        color: colors.sgray
    },
    // Infos do Usuário
    infosUser : {
        width : '90%',
        height : 50,
        backgroundColor : 'white',
        borderRadius : 10,
        justifyContent : 'center',
        // Sombra para destacar o box de info
        shadowColor: colors.sgray,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    texts : {
        marginLeft : 15
    },
    // Botão de Logout
    RangeLogout : {
        width: '90%',
        alignItems : 'center',
        backgroundColor : colors.sred,
        padding : 15,
        borderRadius : 10,
        marginTop : 40, // Aumentado o espaçamento
        // Sombra para destacar o botão de ação
        shadowColor: colors.sred,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    logoutText: {
        color : 'white', 
        fontFamily : fontFamily.bold,
        fontSize: 18
    },
    options : {
        flexDirection : 'column',
        marginTop : 40,
        width : '100%',
        alignItems : 'center',
    },
    // Estilos da Câmera (Modal)
    cameraCloseButton: {
        width : 50, 
        height: 50,
        backgroundColor : colors.sorange,
        borderRadius : 50, 
        alignItems : 'center', 
        justifyContent: 'center',
        position : 'absolute', 
        bottom : 40, // Ajustado para não ficar muito no canto
        right : 20,
    },
    cameraCaptureButton: {
        borderWidth : 5, 
        borderColor : colors.sblue, // Borda em sblue
        borderRadius : 50, 
        height : 90, 
        width : 90, 
        position : 'absolute', 
        bottom : 30, 
        left : '50%',
        marginLeft: -45, // Centraliza o botão
        backgroundColor : 'white',
    }

})