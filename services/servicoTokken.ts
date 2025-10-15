import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVETOKEN = 'projetofinal:token';

export async function salvarToken (token : string) : Promise<void> {
    try{
        await AsyncStorage.setItem(CHAVETOKEN, token);
    } catch (error) {
        console.error('Erro ao salvar token', error);
        throw new Error("Problema ao armazenar as informações de login.");
        
    }

}   

export async function obterToken() : Promise<string | null> {
    try{
        const token = await AsyncStorage.getItem(CHAVETOKEN);
        return token; }catch (error) {
            console.error('Erro ao obter token', error)
            return null;
        }
}

export async function removerToken() : Promise<void> {
    try{
        await AsyncStorage.removeItem(CHAVETOKEN);
    } catch (error) {
        console.error('Erro remover token', error);
    }
}