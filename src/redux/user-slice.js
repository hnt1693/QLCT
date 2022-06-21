import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Axios as axios} from "axios";
import authService from '../service/auth-service'
import userService from '../service/user-service'

const getUser = () => {
    const user = localStorage.getItem("currentUser");
    console.log(user)
    return user ? JSON.parse(user) : null;
}

const initialState = {
    currentUser: getUser(),
    pending: false
};

export const getUserInfo = createAsyncThunk(
    'users/getUserInfo',
    async (thunkAPI) => {
        const response = await userService.getInfo();
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
        [getUserInfo.fulfilled]: (state, action) => {
            state.currentUser = action.payload;
            if (action.payload) {
                localStorage.setItem("currentUser", JSON.stringify(action.payload))
            } else {
                localStorage.removeItem("currentUser")
            }
        },
    },
})

// Extract the action creators object and the reducer
const {actions, reducer} = userSlice
// Extract and export each action creator by name
export const {setUser} = actions
// Export the reducer, either as a default or named export
export default reducer
