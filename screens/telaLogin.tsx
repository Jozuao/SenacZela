import { Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ImageBackground, Modal, Image} from "react-native";
import { useEffect, useState, useRef} from "react";
import { TextInput} from "react-native-paper";
import LottieView from 'lottie-react-native'
import { realizarLogin } from "../services/servicoAutenticacao";
import { salvarToken } from "../services/servicoTokken";
import { useNavigation } from "@react-navigation/native";
import api from "../api/api";
import Load from "./telaLoad";



interface telaLoginProps{
    aoLoginSucesso: () => void;
    LoginAdmin: (eAdmin : boolean) => void
}


const image = require('../img/fundoSenac.jpg')
const Error = require('../lotties/ErrorAnimation.json')


export default function TelaLogin({aoLoginSucesso,LoginAdmin } : telaLoginProps)  {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [modal, setModal] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [Erro, setErro] = useState<boolean | null>(null);

    const mostrarModal = () => {
        setModal(!modal)
  }

    const mostrarSenha = () => {
        setShowPassword(!showPassword)
    }



    const Login = async ()=> {
        setCarregando(true);
        setErro(null);
        
        try {

            const resposta = await realizarLogin({usuario : login, senha : password});
            const tempo = new Promise(resolve=> setTimeout(resolve, 5000))
            const [loginResposta] = await Promise.all([resposta, tempo]);

            await salvarToken(loginResposta.token);
            
            const super_user = await api.get('/accounts/current_user', {})
            const verificacao = super_user.data.is_superuser

            LoginAdmin(verificacao)
            aoLoginSucesso()

        } catch (erro : any) {
            setErro(true)
            setModal(true)
            console.error(erro)
        } finally {
            setCarregando(false);
        }
        
    };  

    return(
            <ImageBackground source={image} style={style.background}>
                <View style={style.geral}>
                    {carregando ? (
                        <Load/>
                    ) : (
                        <>
                        
                        <KeyboardAvoidingView behavior="padding" style={style.container}>
                            <View style={style.child}>
                                    <View style={style.container_input}>
                                        <TextInput style={style.input}
                                        label={"ID"}
                                        mode="outlined"
                                        onSubmitEditing={Login}
                                        placeholder="Insira o ID"
                                        value={login}
                                        onChangeText={setLogin}>
                                        </TextInput>
                                    </View>
                                    <View style={style.container_input}>
                                        <TextInput style={style.input}
                                        mode="outlined"
                                        label="Senha"
                                        onSubmitEditing={Login}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        contentStyle={style.input}
                                        right={
                                            <TextInput.Icon 
                                            style={style.password} 
                                            icon={showPassword ? 'eye-off' : 'eye'}
                                            onPress={mostrarSenha}
                                            />
                                        }
                                        />
                                    </View>
                                    <View style={style.viewBotao}>
                                        <TouchableOpacity onPress={Login} style={style.botao}>
                                            <Text style ={style.TextoBotao}>
                                                Continuar
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {modal ? <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modal}
                                    onRequestClose={mostrarModal}
                                    >
                                        <View style={{width : "100%", height: '100%',alignItems : 'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.3)'}}>
                                            <View style={{backgroundColor : 'white', padding : 10, alignItems : 'center', justifyContent : 'center', borderRadius : 10}}>
                                                <LottieView
                                                source={Error}
                                                autoPlay={true}
                                                loop={true}
                                                speed={0.5}
                                                style={{width : 200, height : 200}}
                                                />
                                                <Text style={{fontSize : 20, textAlign : 'center', marginBottom : 20}}>
                                                    Erro ao fazer login. {'\n'} Preencha as credenciais e tente novamente!
                                                </Text>
                                                <TouchableOpacity onPress={mostrarModal}>
                                                    <Text style={{padding : 10, fontSize : 16, color : 'white', backgroundColor : '#004A8D', borderRadius : 10, paddingHorizontal : 50}}>
                                                        {'< Voltar'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal> : null}
                            </View>
                        </KeyboardAvoidingView>
                        </>
                    )}
                </View>
            </ImageBackground>
    );
}

const style = StyleSheet.create({
    geral : {
        width : "100%",
        flex : 1,
        backgroundColor : 'rgba(17, 0, 0, 0.6)',
    },
    background : {
        flex : 1,
        resizeMode : 'center',
        justifyContent : 'center',
        alignItems : 'center',
        width : 'auto',
        height : 'auto'

    },
    password : {
        margin : 'auto'
    },
    container : {
        
        margin : 'auto',
        width : 300,
        paddingTop : 30,
        paddingBottom : 30,
        justifyContent : 'center',
        borderRadius : 15,
        flexDirection : 'column',
        backgroundColor : 'rgba(17,0,0,0.3)'
    },
    container_input : {
        paddingVertical : 30
    },
    child : {
        paddingBottom : 50,
        padding : 20,
        margin : 10
    },
    text : {
        color : 'white'
    },
    input : {
        paddingVertical : 40,
        flex : 1,
        justifyContent : 'center'

    },
    controls : {
        padding : 20
    },
    viewBotao : {
        alignItems : 'center',
        marginTop : 30,
        width : 100,
        padding : 10,
        margin : 'auto',
        borderRadius : 10,
        backgroundColor  : '#004A8D',
    },
    botao : {
        borderRadius : 5,
        width : 'auto',
        
    },
    TextoBotao : {
        color : 'white'
    },
    Erro : {
        color : 'white'
    },
    viewLoad : {
        flex : 1,
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : 'white',
        height : '100%',
        position : 'absolute',
        top : 0,
        right : 0,
        left : 0,
        bottom : 0,
        resizeMode : 'center',
    },
    imagem : {
        width : 100,
        height : 100
    }
});

