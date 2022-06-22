import {loadTranslations, setLocale, syncTranslationWithStore} from "react-redux-i18n";
import store from "../redux/store";
import en from './en.json';
import vi from './vi.json';

const translationsObject = {
    en: en,
    vn: vi
};

const configI18nToStore = (store) => {
    syncTranslationWithStore(store)
    store.dispatch(loadTranslations(translationsObject));
}

export default configI18nToStore;