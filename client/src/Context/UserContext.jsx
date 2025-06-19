import { createContext, useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token= Cookies.get('token');
        if(token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.userId || null);
            } catch (error) {
                console.log(error);
                setUserId(null);
            }
        } else {
            setUserId(null)
        }
    },[userId]);

    const login = (token) => {
        setUserId(token);
    }   
    const logout = () => {
        Cookies.remove('token');
        setUserId(null);

    }
    return <UserContext.Provider value={{userId,login, logout}}>{children}</UserContext.Provider>
}