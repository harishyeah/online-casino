
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
// @ts-ignore
import AuthService from '../../Services/AuthService.tsx'
// @ts-ignore
import {Alert} from '../../Services/AlertService.tsx'
// @ts-ignore
import { login } from '../../Action/Auth.tsx'
// @ts-ignore
import  GuestLogin  from '../Common/GuestLogin.tsx'
import { useDispatch } from 'react-redux'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Login() {

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function handleLogin() {
    try {

      // email validation
      if (!email) {

        setEmailError(true);
        setEmailErrorMsg("Please enter your email Address.")
        return false

      }

      if (typeof email !== "undefined") {

        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

        if (!pattern.test(email)) {

          setEmailError(true);
          setEmailErrorMsg("Please enter valid email address.")
          return false

        }

      }

      setEmailError(false);
      setEmailErrorMsg("");

      // Password validation
      if (!password) {

        setPasswordError(true);
        setPasswordErrorMsg("Please enter your password")
        return false

      }

      setPasswordError(false);
      setPasswordErrorMsg("");
    

      setLoading(true);

      let response = await AuthService.login(email, password);

      if (response.status === "failure") {
        setLoading(false)
        Alert.error(response.message);
        return false;
      }
      console.log(response);
      
      dispatch(login(response.data));

      Alert.success("Logged in successfully")
      setLoading(true)
    }
    catch (error) {

      setLoading(true)
      Alert.error(error.message);
    }
  }


  return (
    <div>
      <Button variant="contained" onClick={handleOpen} > Login </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Login
            </Typography>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '100%' },
                  }}
                noValidate
                autoComplete="off"
            >
                    <TextField
                        fullWidth 
                        error={emailError}
                        id="standard-email" 
                        type="email"
                        label="Email" 
                        variant="standard"
                        helperText={emailError?emailErrorMsg:''}
                        placeholder='Enter your email'
                        onChange={(e) => setEmail(e.target.value)}
                     />

                     <TextField
                        fullWidth
                        error={passwordError}
                        type="password"
                        id="standard-password" 
                        label="Password" 
                        variant="standard"
                        helperText={passwordError?passwordErrorMsg:''}
                        placeholder='Enter your Password'
                        onChange={(e) => setPassword(e.target.value)}
                     />

                    <Button variant="contained" color="success" onClick={ handleLogin} > Login </Button>
                    <GuestLogin />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}