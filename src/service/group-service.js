import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL + '/auth/';

const getGroups = (searchObject) => {
    return axios.get(API_URL + "groups",);
};

const getById = (id) => {
    return axios.get(API_URL + "groups/" + id);
};

const createGroup = (group) => {
    return axios.post(API_URL + "groups", group);
};
const updateGroup = (group) => {
    return axios.put(API_URL + "groups", group);
};
const deletes = (ids) => {
    return axios({
        url: API_URL + "groups",
        method: "delete",
        data: ids
    });
};


export default {
    getGroups, createGroup, updateGroup, deletes, getById
};
