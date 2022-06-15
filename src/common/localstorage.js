const CONFIG_PROVIDER = "CONFIG_PROVIDER";
const initialConfigProvider = {
    locale: "vn",
    size: "default"
}

export const loadConfig = () => {
    return JSON.parse(localStorage.getItem(CONFIG_PROVIDER)) || initialConfigProvider;
}
