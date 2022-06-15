import {configureStore} from '@reduxjs/toolkit'
import userSlice from './user-slice'
import configProvider from './config-provider-slice'

const store = configureStore({
    reducer: {
        user: userSlice,
        configProvider: configProvider
    },

})

export default store
