import React from "react"
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Modal, ScrollView, ActivityIndicator, Switch , useWindowDimensions} from "react-native"
import { useState, useEffect } from "react"
import { Dimensions } from "react-native"
import { criarSalas, CriarUsers, obterSalas, obterUsers } from "../services/servicoSalas"
import { CarregarUsuarios } from "../types/salas"
import api from "../api/api"


export default function Users () {
    const [carregando, setCarregando] = useState(true)
    const [users, setUsers] = useState<CarregarUsuarios[]>([])
    const [visivel, setVisivel] = useState(false)
    const [nome, setNome] = useState('')
    const [Senha, setSenha] = useState<any | null>(null)
    const [confirm_Senha, setConfirm_Senha] = useState(0)
    const [on, setOn] = useState<boolean>(false)
    const [admin, setAdmin] = useState<boolean>(false)
    const {width, height} = Dimensions.get('window')


    const viewWidth = width * 0.78;
    const viewHeight = height * 0.5;



    const handleSwitch = () => {
        setOn(!on)
        if (on === false) {
            setAdmin(true)
        }
    }
    const mostrarModal = () => {
        setVisivel(!visivel)
  }
  const carregarUsers = async () => {
            try{
                const resposta = await api.get('accounts/list_users/')
                setUsers(resposta.data)
            } catch(error){
                console.error('Erro ao buscar usuários', error)
            }
    };
    useEffect(() => {
        carregarUsers()
    }, []);
    
     const renderizarSala = ({item} : {item: CarregarUsuarios}) => {
        const imageURL = item.profile?.profile_picture ? `https://zeladoria.tsr.net.br/${item.profile.profile_picture}` : null
        return(
            <View style={style.containerList}>
                <View style={style.CardSala}>
                {imageURL ? (
                        <Image style={{width : 60, height : 60, borderRadius: 30, marginBottom : 30}} source={{uri : imageURL}}/>
                    ) : (
                        <View></View>
                    )}
                    <View style={{flex : 1}}>
                        <Text style={style.nome}>{item.username}</Text>
                        <Text style={style.nome}>{item.email}</Text>
                    </View>
                    
                </View>
     
            </View>
        );
     };
    
    const criarSala = async () => {
        mostrarModal()
        if (Senha !== confirm_Senha){
            console.error("Tente colocar senhas iguais")
        } else if (nome.trim() === '' || Senha === 0 || confirm_Senha === 0) {
            console.error("Insira todos os campos corretamente")
        } else {
            try{
                const resposta = CriarUsers({username : nome, password : Senha, confirm_password : confirm_Senha, is_staff : admin, is_superuser : admin})
                carregarUsers()
                setNome('')
                setSenha(0)
                setConfirm_Senha(0)
            } catch (error) {
                console.error("Erro ao criar usuário", error);
            }
            
        }
        

    }

    return (
        <View style={style.container}>  
            <Modal 
            animationType="slide"
            transparent={true}
            visible={visivel}
            onRequestClose={mostrarModal}>
                <View style={style.containerModal}>
                    <View style={{width : viewWidth > 600 ? width * 0.8 : width * 1, backgroundColor : 'white', padding : 20, borderRadius : 10, height : viewHeight}}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={{fontSize : 16}}>Nome*</Text>
                                <TextInput placeholder="Manuela" style={style.inputs} value={nome} onChangeText={setNome}></TextInput>
                                <Text style={{fontSize : 16}}>Senha*</Text>
                                <TextInput placeholder="Insira a senha" style={style.input2} value={Senha} onChangeText={setSenha}></TextInput>
                                <Text style={{fontSize : 16}}>Confirme a senha*</Text>
                                <TextInput placeholder="Confirme a senha" style={style.localizacao} value={confirm_Senha} onChangeText={setConfirm_Senha}></TextInput>
                                <View style={style.setAdmin}>
                                    <Text style={{fontSize : 16}}>É Admin ?</Text>
                                    <View style={style.Switch}>
                                        <Switch
                                        value={on}
                                        onValueChange={handleSwitch}
                                        />
                                    </View>    
                                </View>
                            </ScrollView>
                            <View style={{alignItems : 'center', flexDirection : 'row', justifyContent : 'space-around', marginTop : 10, position : 'relative'}}>
                                    <TouchableOpacity onPress={mostrarModal} style={{padding : 10, backgroundColor : 'orange'}}>
                                        <Text style={{fontSize : 18}}>
                                            Cancelar
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={style.buttonAdd} onPress={criarSala}>
                                        <Text style={style.textButton}>
                                            +  Adicionar
                                        </Text>
                                    </TouchableOpacity>
                            </View>
                    </View>
                </View>
            </Modal>
            <View style={style.headerAdd}>
                <View style={{width : '100%', alignItems : 'center', justifyContent : 'space-around', flexDirection : 'row'}}>
                    <View style={{marginRight : '30%'}}>
                        <Text style={style.gerenciarUsuarios}>Gerenciar Usuários</Text>
                    </View>
                    <TouchableOpacity style={style.mostrarModal} onPress={mostrarModal}>
                        <Text style={style.textplus}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
                <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderizarSala}
                nestedScrollEnabled={true}
                />

            
        </View>
    )
}

const style = StyleSheet.create({

    container : {
        flex : 1
    },
    headerAdd : {
        justifyContent : 'center',
        height : 100,
        display : 'flex',
        paddingVertical : 20,
        borderBottomWidth : 1,  
        borderBottomColor : '#F7941D'
    },
    CardSala : {
        backgroundColor : "white",
        borderRadius : 10,
        marginTop : 10,
        padding : 15,
        flexDirection : 'row',
        width : '90%',
        borderWidth :1
    },
    containerModal : {
        justifyContent : 'space-around',
        alignItems : 'center',
        flex : 1,
        backgroundColor : 'rgba(99, 99, 99, 0.8)',
    },
    containerList : {
        justifyContent : 'center',
        flexDirection: 'column',
        alignItems : 'center',
        flex : 1,
    },
    inputs : {
        borderWidth : 1,
        borderColor : 'black',
        width : '100%',
        borderRadius : 10,
        marginBottom : 30
    },
    input2 : {
        borderWidth : 1,
        borderColor : 'black',
        width : '100%',
        borderRadius : 10,
        marginBottom : 30
    },
    descricao : {
        borderWidth : 1,
        borderColor : 'black',
        width : '100%',
        borderRadius : 10,
        paddingBottom : 120
    },
    localizacao : {
        borderWidth : 1,
        borderColor : 'black',
        width : '100%',
        borderRadius : 10,
        marginBottom : 30,
    },
    viewAdd : {
        flex : 1,
        alignItems : 'center',
        width : '100%',
        justifyContent : 'space-around',
        flexDirection : 'row'
    },
    buttonAdd : {
        backgroundColor : '#004A8D',
        padding : 10
    },
    textButton : {
        fontSize : 18,
        color : 'white'
    },
    mostrarModal : {
        padding : 10,
        paddingHorizontal : 15,
        backgroundColor : '#004A8D',
        justifyContent : 'center',
        borderRadius : 30,
        marginRight : 5
    },
    info : {
        fontSize : 10
    },
    nome : {
        fontSize : 18,
        margin : 'auto'
    },
    textplus : {
        fontSize : 16,
        margin : 'auto',
        color : 'white'
    },
    gerenciarUsuarios : {
        fontSize : 18,
        fontWeight : 'bold',
        color : '#004A8D'
    },
    setAdmin : {
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        width : '100%',
    },
    Switch : {
        marginLeft : 90,
        alignItems : 'center',
        paddingLeft : 30
    }
});

