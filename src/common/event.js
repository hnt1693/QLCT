

export const initLocaleEvent = () => {
    document.body.addEventListener('changeLocaleEvent', function (event) {
        alert("change");
    });
}

export const emitLocaleEvent = (language) => {
    document.body.dispatchEvent(new CustomEvent("changeLocaleEvent", {detail: {language}}));
}

