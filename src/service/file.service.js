import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL + '/files/';


export const UPLOAD_URL = process.env.REACT_APP_BASE_URL + '/files';

const removeFile = (url) => {
    return axios.delete(API_URL, {params: {url: url}})
}

export default {removeFile}