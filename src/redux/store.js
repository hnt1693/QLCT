import {configureStore} from '@reduxjs/toolkit'
import userSlice from './user-slice'
import configProvider from './config-provider-slice'
import { loadTranslations, setLocale, syncTranslationWithStore, i18nReducer } from 'react-redux-i18n';
import configI18nToStore from "../locale/i18n-config";
const store = configureStore({
    reducer: {
        user: userSlice,
        configProvider: configProvider,
        i18n: i18nReducer
    },
})

configI18nToStore(store);

export default store
