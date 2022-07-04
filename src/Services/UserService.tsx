import axiosService from './AxiosService.tsx';
import configService from './ConfigService.tsx';
import responseService from './ResponseService.tsx';

const apiUrl = configService.getApiUrl();

const getGameDetails = async (_page, _userId) => {
    try {
        const config = {
            headers: {
                "content-type": "application/json",
                Authorization: configService.authorizationToken(),
              }
        };


        const response = await axiosService.get(
            `${apiUrl}/users/get-games-details?page=${_page}&user_id=${_userId}&paginate=10`,
            config
        );
        
        return response.data;

    } catch (error) {
       if(error.response.status === 500 ){
        return responseService.buildFailure(error.response.data.message)
       } 

       return responseService.buildFailure(error.message)
    }
}

const insertGameDetails = async (_data) => {
    try {
        const config = {
            headers: {
                "content-type": "application/json",
                Authorization: configService.authorizationToken(),
              }
        };


        const response = await axiosService.post(
            `${apiUrl}/users/insert-game-details`,
            _data,
            config
        );
        
        return response.data;

    } catch (error) {
       if(error.response.status === 500 ){
        return responseService.buildFailure(error.response.data.message)
       } 

       return responseService.buildFailure(error.message)
    }
}

const UserService = {
    getGameDetails,
    insertGameDetails
}
export default UserService