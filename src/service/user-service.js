import axios from "axios";
import {extractPaginationToParams} from "../common/utils";

const API_URL = process.env.REACT_APP_BASE_URL + '/users/';

const getAllPagination = (pagination) => {
    return axios.get(API_URL + "", {params: extractPaginationToParams(pagination)});
};

const getAllUsers = () => {
    return axios.get(API_URL + "all",);
};

const getById = (id) => {
    return axios.get(API_URL + "" + id);
};

const create = (group) => {
    return axios.post(API_URL + "", group);
};
const update = (group) => {
    return axios.put(API_URL + "", group);
};

const getInfo = () => {
    return axios.get(API_URL + "info");
};

const deletes = (ids) => {
    return axios({
        url: API_URL + "",
        method: "delete",
        data: ids
    });
};


export default {
    getAllUsers, getAllPagination, create, update, deletes,
    getById, getInfo
};
