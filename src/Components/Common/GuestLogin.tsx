import Button from '@mui/material/Button';
// @ts-ignore
import {Alert} from '../../Services/AlertService.tsx'
// @ts-ignore
import { login } from '../../Action/Auth.tsx'
import { useDispatch } from 'react-redux'

const GuestLogin = () => {

    const dispatch = useDispatch();

    const handleGuestLogin = () => {
    
        try{
          dispatch(login({name: "Guest User", credits: 5, id:0}));
          Alert.success("Login as Guest successfully")
        }
        catch(err)
        {
          Alert.error(err.message)
        }
      }

    return (

        <span className='ml-8'> <Button onClick={handleGuestLogin} > Play as Guest </Button>
        </span>
    )
}

export default GuestLogin