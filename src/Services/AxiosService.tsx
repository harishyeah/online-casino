import axios from 'axios';


const AxiosService = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
});

AxiosService.interceptors.request.use((config:any) => {
    // const user = JSON.parse(localStorage.getItem('user'));

    // const token = user.data.token;
    config.params = config.params || {};
    config.headers["Accept"] = "application/json";
    config.headers["Content-type"] = "application/json";
    // config.headers["Authorization"] = "bearer " + token;

    return config;
});

export default AxiosService;