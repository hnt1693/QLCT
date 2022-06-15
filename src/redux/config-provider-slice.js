import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
    locale: "vn",
    size: "default"
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
    },
})

// Extract the action creators object and the reducer
const {actions, reducer} = configProvider
// Extract and export each action creator by name
export const {setLocale,setSize} = actions
// Export the reducer, either as a default or named export
export default reducer
