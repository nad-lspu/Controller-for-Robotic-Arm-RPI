import { createContext } from "react";

type AuthDetails = {
    user: User | null,
    isAuthenticated: boolean,
    login: (formData: FormData) => Promise<AuthResult>,
    register: (registerCredentials: RegisterCredentials) => Promise<AuthResult>,
    logOut: () => void,
}

const authDetails: AuthDetails = {
    user: null,
    isAuthenticated: false,
    login: async(_formData: FormData) => new Promise((() => ({ success: false, data: '' }))),
    register: async(_registerCredentials: RegisterCredentials) => new Promise((() => ({ success: false, data: '' }))),
    logOut: () => {}
}

const AuthContext = createContext(authDetails);

export default AuthContext;