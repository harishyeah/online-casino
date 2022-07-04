
import StorageService from "./StorageService.tsx";

const apiBaseUrl = () => {
    return process.env.REACT_APP_BASE_URL;
};
const getApiUrl = () => {
  return process.env.REACT_APP_API_ENDPOINT;
};

const authorizationToken = () => {
  let _auth = StorageService.getObject("userData");
  let _token = null;

  try {
    // _token = _auth["token"];
    _token = _auth.token;
  } catch (error) {
    _token = null;
  }

  return "Bearer " + _token;
};

 
const configService = {
    apiBaseUrl,
    getApiUrl,
    authorizationToken
}



export default configService;