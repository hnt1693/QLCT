import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL + '/ui/menus';

const getMenus = (searchObject) => {
    return axios.get(API_URL + "",);
};

const getById = (id) => {
    return axios.get(API_URL + "/" + id);
};

const createGroup = (menu) => {
    return axios.post(API_URL , menu);
};
const updateGroup = (menu) => {
    return axios.put(API_URL , menu);
};
const deletes = (ids) => {
    return axios({
        url: API_URL + "",
        method: "delete",
        data: ids
    });
};


export default {
    getMenus, createGroup, updateGroup, deletes, getById
};
