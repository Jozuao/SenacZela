export interface CredenciaisLogin {  
    usuario: string;  
    senha: string; 
} 

export interface RespostaLoginAPI {  
    token: string; 
    is_superuser : boolean
}

export interface RespostaCriarUSer {
    token : string
}
