import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
    locale: "en",
    size: "default",
    darkMode: false
}

function getConfig() {
    try {
        console.log(JSON.parse(localStorage.getItem("currentUser")));
        return JSON.parse(localStorage.getItem("currentUser")).config
    } catch (e) {
        console.log(e)
        return initialState;
    }
}

const configProvider = createSlice({
    name: 'configProvider',
    initialState: getConfig(),
    reducers: {
        setLocale: (state, action) => {
            state.locale = action.payload;
            mergerConfigToUser("locale", action.payload)
        },
        setSize: (state, action) => {
            state.size = action.payload
            mergerConfigToUser("size", action.payload)
        },
        setDarkMode: (state, action) => {
            if (action.payload) {
                document.body.setAttribute('arco-theme', 'dark');
                document.body.style.backgroundColor = 'rgb(var(--gray-2))'
            } else {
                document.body.removeAttribute('arco-theme');
                document.body.style.backgroundColor = 'white'
            }
            state.darkMode = action.payload;
            mergerConfigToUser("darkMode", action.payload)
        },
        setConfig: (state, action) => {
            if (action.payload.darkMode) {
                document.body.setAttribute('arco-theme', 'dark');
                document.body.style.backgroundColor = 'rgb(var(--gray-2))'
            } else {
                document.body.removeAttribute('arco-theme');
                document.body.style.backgroundColor = 'white'
            }
            state.size = action.payload.size;
            state.locale = action.payload.locale;
            state.darkMode = action.payload.darkMode;
        },
    },
})

function mergerConfigToUser(key, value) {
    let us = JSON.parse(localStorage.getItem("currentUser"));
    if (us) {
        us.config[key] = value;
    }
}

// Extract the action creators object and the reducer
const {actions, reducer} = configProvider
// Extract and export each action creator by name
export const {setLocale, setSize, setDarkMode, setConfig} = actions
// Export the reducer, either as a default or named export
export default reducer
