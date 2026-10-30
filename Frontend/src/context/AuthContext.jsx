import {
    createContext,
    useContext,
    useState
} from "react";

import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) || null;
    });

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const login = async (email, password, role) => {

        const response = await api.post("/login", {
            email,
            password,
            role
        });

        const { user, token } = response.data;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        setUser(user);
        setToken(token);

        return user;
    };

    const signup = async (name, email, password, role) => {

        const response = await api.post("/signup", {
            name,
            email,
            password,
            role
        });

        return response.data;
    };

    const logout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        setToken(null);
    };

    const updateUser = (updatedUser) => {

        const newUser = {
            ...user,
            ...updatedUser
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                signup,
                logout,
                updateUser,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);