import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL + '/users/';

const getGroups = (searchObject) => {
    return axios.get(API_URL + "",);
};

const getAllUsers = () => {
    return axios.get(API_URL + "all",);
};

const getById = (id) => {
    return axios.get(API_URL + "" + id);
};

const createGroup = (group) => {
    return axios.post(API_URL + "", group);
};
const updateGroup = (group) => {
    return axios.put(API_URL + "", group);
};
const deletes = (ids) => {
    return axios({
        url: API_URL + "",
        method: "delete",
        data: ids
    });
};


export default {
    getAllUsers
};
