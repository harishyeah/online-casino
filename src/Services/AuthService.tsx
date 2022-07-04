import axiosService from './AxiosService.tsx';
import configService from './ConfigService.tsx';
import responseService from './ResponseService.tsx';

const apiUrl = configService.getApiUrl();

const login = async (_email, _password) => {
    try {
        const config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosService.post(
            `${apiUrl}/login`,
            {email: _email, password: _password},
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

const AuthService = {
    login
}
export default AuthService