import axios from "axios";


const API_URL = process.env.REACT_APP_BASE_URL + '/auth/';

const register = (username, email, fullName, password) => {
    return axios.post(API_URL + "signup", {
        username,
        email,
        fullName,
        password,
    });
};

const login = async (user) => {
    return await axios.post(API_URL + "signin", user);
};

const logout = () => {
    localStorage.removeItem("user");
};

const forgotPassword = async (username) => {
    return await axios.get(API_URL + "forgot-password", {
        params: {username: username}
    });
}

export default {
    register,
    login,
    logout,
    forgotPassword
};
