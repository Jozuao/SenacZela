import api from "../api/api";
import { CredenciaiSalas, CarregarSalas, CriarUsuarios, CarregarUsuarios } from "../types/salas";
import { obterToken } from "./servicoTokken";
import { RespostaCriarUSer } from "../types/api";

export async function criarSalas(formData : FormData) {
    
    try {
        const resposta = await api.post('salas/', formData, {
            headers: {
                'Content-Type' : 'multipart/form-data',
            },
        });
        console.log(resposta.status)
    } catch (error : any) {
        if (error.response && error.response.status === 401) {      
            throw new Error('Credenciais inválidas. Verifique seu usuário e senha.');    
        }
        throw new Error('erro na requisição', error)
    }
    

}

export async function obterSalas() : Promise<CarregarSalas[]> {
    try {
        const resposta = await api.get<CarregarSalas[]>('salas/');
        return resposta.data
    } catch (error : any) {
        console.error(error)
        throw new Error('Erro ao buscar Salas.');
    }
}   

export async function obterSalasporID(id : number) : Promise<CarregarSalas> {
    try {
        const resposta = await api.get<CarregarSalas>(`salas/${id}`);
        return resposta.data
    } catch (error : any) {
        throw new Error(error.mensage || 'Erro ao buscar Sala.');
    }
}



export async function CriarUsers(credenciais: CriarUsuarios) {
    try {
        const resposta  = await api.post('accounts/create_user/', {
            username : credenciais.username,
            password : credenciais.password,
            confirm_password : credenciais.confirm_password,
            is_staff : credenciais.is_staff,
            is_superuser : credenciais.is_superuser

        })
        console.log(resposta.status)
    } catch(error){
        console.error("Erro na requisição", error)
    }
}

export async function obterUsers() : Promise<CarregarUsuarios[]> {
    try {
        const resposta = await api.get<CarregarUsuarios[]>('accounts/list_users/');
        return resposta.data
    } catch (error : any) {
        throw new Error(error.mensage || 'Erro ao buscar Salas.');
    }
}