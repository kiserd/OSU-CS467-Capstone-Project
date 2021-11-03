import React, { useContext, useState, useEffect } from 'react';
import { getAuth, userInfo } from 'firebase/auth';
import { firebaseApp } from "../Firebase/clientApp.ts";


const AuthContext = React.createContext();
const AuthUpdateContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function useAuthUpdate() {
    return useContext(AuthUpdateContext);
}

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({user: null});
    
    function updateAuth(value) {
        setAuth({user: value});
    }

    useEffect(()=>{
        
        //updateAuth(user)
    }, []);

    

    return (
        <AuthContext.Provider value={auth}>
            <AuthUpdateContext.Provider value={updateAuth}>
                {children}
            </AuthUpdateContext.Provider>
        </AuthContext.Provider>
    )
}