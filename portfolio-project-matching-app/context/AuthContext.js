import React, { useContext, useState, useEffect } from 'react';
import { getAuth, userInfo, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from "../Firebase/clientApp.ts";
import { getUserById } from '../backend/daoUser';


export const AuthContext = React.createContext();
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
        let authObject = getAuth();
        // The code below listens for auth state change and will update the auth value
        const unlisten = authObject.onAuthStateChanged(
            async (authUser) => {
                if(authUser){
                    let user = await getUserById(authUser.uid);
                    setAuth({user: user})
                } else {
                    setAuth({user: null});
                }
            },
         );
        return unlisten();
    }, []);

    return (
        <AuthContext.Provider value={auth}>
            <AuthUpdateContext.Provider value={updateAuth}>
                {children}
            </AuthUpdateContext.Provider>
        </AuthContext.Provider>
    )
}