import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native"
import api from "../api/api"
import { useState, useEffect, useRef } from "react"
import { Camera, CameraView } from "expo-camera"
import { obterToken } from "../services/servicoTokken"



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
                    const recuperarFoto = async () => {
                        try {
                            const resposta = await api.get('accounts/current_user/')
                            setimagem(resposta.data.profile.profile_picture)
                        } catch(error) {
                            console.error(error)
                        }
                    }
                }
            } catch(error) {
                console.error(error)
            }
            

        }
    }

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setPermissao(status === 'granted')
        })();
        const obterUser =async () => {
        try {
            const resposta = await api.get('accounts/current_user/')
            setUser(resposta.data.username)
            setStatus(resposta.data.is_superuser)
            setimagem(resposta.data.profile.profile_picture)
            if (imagem !==null) {
                setFotoPerfil(true)
            } else {
                setFotoPerfil(false)
            }
        } catch (error) {
            console.error("Erro ao obter usuário")
        }
    }
    obterUser()
    })

    if (showCamera) {
        if(!permissao) {
            return(
                <View>
                    <Text>Permissão não concedida</Text>
                </View>
            )
        }
        return(
            <View style={{flex : 1}}>
                <CameraView style={{flex : 1}} facing="front" zoom={0} ref={foto}/>
                <TouchableOpacity style={{width : 50, backgroundColor : 'rgba(0,0,0,0.8)', borderRadius : 50, alignItems : 'center', position : 'absolute', top : '95%', left : '80%'}} onPress={()=> setShowCamera(false)}>
                    <Text style={{fontSize : 20, color : 'white'}}>X</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderWidth : 5, borderColor : 'black', borderRadius : 50, height : 90, width : 90, position : 'absolute', top : '80%', left : '40%', backgroundColor : 'white'}} onPress={tirarFoto}>
                </TouchableOpacity>
            </View>
        )
    }


    return (
        
        <View style={style.container}>
            <View style={{height : 100, alignItems : 'flex-start', width : '100%', backgroundColor : 'transparent', justifyContent : 'center', borderBottomWidth : 1, borderBottomColor : '#F7941D'}}>
                <Text style={{marginLeft : 10, fontSize : 26, fontWeight : 'bold', color : '#004A8D'}}>
                    Configurações
                </Text>
            </View>
                <View style={style.options}>
                    {fotoPerfil  ?  (
                        <TouchableOpacity onPress={() => setShowCamera(true)}>
                            <Image style={style.user} source={{uri: `https://zeladoria.tsr.net.br/${imagem}`}}/>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setShowCamera(true)}>
                            <Image style={{opacity:0.3}} source={require('../img/camera.png')}/>
                        </TouchableOpacity>
                    )}
                    
                    <Text style={style.nomeUser}>{user}</Text>
                    <View style={style.infosUser}>
                        <View style={style.texts}>
                            <Text>Status : {status ? 'Adminstrador' : 'Usuário'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={style.RangeLogout} onPress={aoLogout}>
                        <Text style={{color : 'white', fontWeight : 'bold'}}>Sair do App</Text>
                    </TouchableOpacity>
                </View>
        </View> 
        

    )
}

const style = StyleSheet.create({
    container : {
        alignItems : 'center',
    },
    user : {
        width : 100,
        height : 100,
        borderRadius : 50
    },
    logout : {
        height : 50,
        width : 50,
    },
    RangeLogout : {
        alignItems : 'center',
        backgroundColor : 'red',
        padding : 10,
        borderRadius : 10,
        marginTop : 10
    },
    options : {
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'space-around',
        marginTop : 50,
        width : '100%',
        alignItems : 'center',
    },
    nomeUser : {
        marginBottom : 20,
        fontSize : 20,
        fontWeight : 'bold'
    },
    infosUser : {
        width : '90%',
        alignItems : 'flex-start',
        height : 50,
        backgroundColor : 'white',
        borderRadius : 10,
        justifyContent : 'center'
    },
    texts : {
        marginLeft : 10
    }

})