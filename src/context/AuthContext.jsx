import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [username, setUsername] = useState(localStorage.getItem("username"));

    const login = (newToken, name) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("username", name);
        setToken(newToken);
        setUsername(name);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUsername(null);
    };

    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{ token, username, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
