import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "../Action/Type.tsx";
import StorageService from "../Services/StorageService.tsx";

const userData = StorageService.getObject("userData");

const initialState = Object.keys(userData).length > 0 
  ? { isLoggedIn: true, userData: userData }
  : { isLoggedIn: false, userData: null};

function authenticate(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userData: payload.userData
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        userData: null
        
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userData: null
      };
    default:
      return state;
  }
}

export default authenticate;
