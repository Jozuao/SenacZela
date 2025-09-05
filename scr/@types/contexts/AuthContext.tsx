import React, { createContext, useContext, useState } from 'react';
import type { User } from '..';


interface AuthContextValue {
user: User | null;
login: (email: string, nome: string, admin?: boolean) => void;
register: (email: string, nome: string, admin?: boolean) => void;
logout: () => void;
}


export const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
const [user, setUser] = useState<User | null>(null);


const login = (email: string, nome: string, admin?: boolean) => {
// Mock simples: e-mails @senac.br viram admin por padrão
const isAdmin = admin ?? email.endsWith('@senac.br');
setUser({ id: email, email, nome, isAdmin });
};


const register = (email: string, nome: string, admin?: boolean) => {
login(email, nome, admin);
};


const logout = () => setUser(null);


return (
<AuthContext.Provider value={{ user, login, register, logout }}>
{children}
</AuthContext.Provider>
);
};

export const useAuth = () => {
const ctx = useContext(AuthContext);
if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
return ctx;
};