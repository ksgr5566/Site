import { createContext, useState, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext({});

const STATUS_URL = '/api/user/refresh';

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    useEffect(() => {
        async function checkStatus() {
          try {
            const response = await axios.get(STATUS_URL, { withCredentials: true });
            const accessToken = response?.data?.accessToken;
            const user = response?.data?.username;
            if (user !== undefined && accessToken !== undefined) {
              setAuth({ user, accessToken });
            }
          } catch (e) {
            console.log(e);
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