import { createContext, useState, useEffect } from "react";
import { getToken } from "../utils/backendCalls";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    useEffect(() => {
        async function checkStatus() {
          const token = await getToken();
          if (token?.accessToken && token?.user) {
            setAuth({...token});
          }
        }
        checkStatus();
    }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };