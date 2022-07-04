
import StorageService from "../Services/StorageService.tsx";
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT} from "./Type.tsx";

// Actions - Login

export const login = (_userData ) => async (dispatch) => {
  try {
      StorageService.setObject('userData', _userData);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { userData: _userData},
      });
    return Promise.resolve(_userData);
  }
  catch (error) {
    dispatch({
      type: LOGIN_FAIL,
    });
    return Promise.reject();
  }
};

export const logout = () => async (dispatch) => {
  try {
    StorageService.clear();

    dispatch({
      type: LOGOUT
    });
  }
  catch (error) {
  }
};