import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Axios as axios} from "axios";

const initialState = {
    currentUser: {name: "anymous"}
}

const fetchUserById = createAsyncThunk(
    'users/fetchByIdStatus',
    async (userId, thunkAPI) => {
        const response = await axios.get(userId);
        return response.data
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    extraReducers: {
        [fetchUserById.pending]: (state, action) => {
            return state + action.payload
        }
    },
})

// Extract the action creators object and the reducer
const {actions, reducer} = userSlice
// Extract and export each action creator by name
export const {createPost, updatePost, deletePost} = actions
// Export the reducer, either as a default or named export
export default reducer
