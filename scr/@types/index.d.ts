export type CleaningStatus = 'limpo' | 'pendente';


export type Room = {
id: string;
nome: string;
numero: string;
capacidade: number;
status: CleaningStatus;
subscribers: string[]; // userId dos inscritos no sino
};


export type ScheduleItem = {
id: string;
salaId: string;
titulo: string;
inicioISO: string; // ISO string
fimISO: string; // ISO string
responsavelId: string; // userId
};


export type User = {
id: string;
nome: string;
email: string;
isAdmin: boolean;
};