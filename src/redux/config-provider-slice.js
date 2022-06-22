import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
    locale: "en",
    size: "default",
    darkMode: false
}

const configProvider = createSlice({
    name: 'configProvider',
    initialState: initialState,
    reducers: {
        setLocale: (state, action) => {
            state.locale = action.payload
        },
        setSize: (state, action) => {
            state.size = action.payload
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
        }
    },
})

// Extract the action creators object and the reducer
const {actions, reducer} = configProvider
// Extract and export each action creator by name
export const {setLocale, setSize, setDarkMode} = actions
// Export the reducer, either as a default or named export
export default reducer
