
const setObject = (_key, _data) => {
    localStorage.setItem(_key, (JSON.stringify(_data)));
};

const getObject = (_key) => {
    let _data = localStorage.getItem(_key) || '';

    try {
        return JSON.parse(_data);
    } catch (e) {
        return "";
    }
};

const clear = () => {
    return localStorage.clear();
}

const storageService = {
    setObject,
    getObject,
    clear,
};

export default storageService;