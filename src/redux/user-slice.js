import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Axios as axios} from "axios";
import authService from '../service/auth-service'

const getUser = () => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

const initialState = {
    currentUser: getUser(),
    pending: false
};

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
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload;
            if (action.payload) {
                localStorage.setItem("currentUser", JSON.stringify(action.payload))
            } else {
                localStorage.removeItem("currentUser")
            }
        }
    },
    extraReducers: {

    },
})

// Extract the action creators object and the reducer
const {actions, reducer} = userSlice
// Extract and export each action creator by name
export const {setUser} = actions
// Export the reducer, either as a default or named export
export default reducer
