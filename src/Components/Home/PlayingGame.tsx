
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { createRef, useState } from 'react';
// @ts-ignore
import UserService from '../../Services/UserService.tsx'
// @ts-ignore
import StorageService from '../../Services/StorageService.tsx'
// @ts-ignore
import {Alert} from '../../Services/AlertService.tsx'
import image1 from '../../Assets/Images/Icon-1.png'
import image2 from '../../Assets/Images/Icon-2.png'
import image3 from '../../Assets/Images/Icon-3.png'
import image4 from '../../Assets/Images/Icon-4.png'
import { useSelector, useDispatch } from 'react-redux';
// @ts-ignore
import { login } from '../../Action/Auth.tsx'

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

export default function PlayingGame({setPlayGame}) {

    const { isLoggedIn, userData }:any = useSelector<any>(state => state.auth);

    const dispatch = useDispatch();

    const [open, setOpen] = useState(true)
    const [fee, setFee] = useState(2)
    const [playing, setPlaying] = useState(false)
    const [creditPlaying, setCreditPlaying] = useState(false)

    const [cards, setCards] = useState([2,2,2]);
    const [fruits, setFruits] = useState([image1, image2, image3,image4])

    

    const slotRef = [createRef(), createRef(), createRef()];

    const InsertGameDetails = async(_data, isWin) => {

        try
        {
            // check use is guest 
            if(isLoggedIn && userData.id === 0)
            {
                
                storeGuestGameDetails(_data, isWin)
                return;
            }
            // deduction of $2
            let response = await UserService.insertGameDetails(_data);
  
            if (response.status === "failure") {

                Alert.error(response.message);
                return false;
            }

            console.log("user details", response.data);

            response.data.token = userData.token
            
            dispatch(login(response.data));

            isWin === 1 ? Alert.success("Congratulations you win the game..."): Alert.error("Oops...you lose the game")
        }
        catch(err)
        {
            Alert.error(err.message)
        }
    }

    const handleplayingForWin = () => {
        
        try{
            setCreditPlaying(true);

            setTimeout(() => {
                setCreditPlaying(false);
            }, 400);

            slotRef.forEach((slot, i) => {
                // this will trigger rolling effect
                triggerSlotRotation(slot.current, true);
            });
            
            // after shuffle we need to credit $5 to users account
            let _data = {
                user_id: userData.id,
                id: userData.id,
                fee: fee,
                credits: userData.credits,
                winning: 1,
                reward: 5,
                slot: JSON.stringify([2,2,2]),
            }

            InsertGameDetails(_data, 1)
        }
        catch(err){
            Alert.error(err.message)
        }
  
    };

    const handleplaying = async() => {

        try{

            let _winning = 1
            let _reward = 0;

            if(creditIsLow())
            {
                Alert.error("Your credit is low for playing game")

                return
            }

            let result:any = [];

            setPlaying(true);

            setTimeout(() => {
                setPlaying(false);
            }, 400);

            // looping through all 3 slots to start rolling
            slotRef.forEach((slot, i) => {
                // this will trigger rolling effect
                const selected = triggerSlotRotation(slot.current, false);
                
                result.push(selected)
            });
            
            setCards(result)

            console.log("result", result);

            // check how many pairs of cards
            if(isCountPairs(result, 3) && result[0] === 2)
            {
                // pair of 3 is exist & card number is 2 then credit $5 to users account
                _reward = 5
            }
            else if(isCountPairs(result, 3))
            {
                // pair of 3 is exist then credit $2 to users account
                _reward = 2
            }

            else if(isCountPairs(result, 2))
            {
                // pair of 2 is exist then credit $0.5 to users account
                _reward = 0.5
            }
            else
            {
                // no pair match
                _winning = 0;
            }

            let _data = {
                user_id: userData.id,
                fee: fee,
                credits: userData.credits,
                winning: _winning,
                reward: _reward,
                slot: JSON.stringify(result),
            }

            InsertGameDetails(_data, _winning)

        }
        catch(err){
            Alert.error(err.message)
        }
    };
    
  
    // this will create a rolling effect and return random selected option
    const triggerSlotRotation = (ref, win) => {

      function setTop(top) {
        
        ref.style.top = `${top}px`;
      }
      let options = ref.children;

      let randomOption = Math.floor(
        Math.random() * fruits.length
      );

      if(win)
      {
        let choosenOption = options[2];
        setTop(-choosenOption.offsetTop + 2);

        return;
      }
      let choosenOption = options[randomOption];
      setTop(-choosenOption.offsetTop + 2);
      
      return randomOption;

    };

    const isCountPairs = (ar, pair) => {
        let obj = {};
      
        ar.forEach((item) => {
          obj[item] = obj[item] ? obj[item] + 1 : 1;
        });
        
        return Object.values(obj).filter(e => e === pair).length > 0;
      };

    const creditIsLow = () => {

        return userData.credits >= 2 ? false : true
    }

    const storeGuestGameDetails = (_data, isWin) => {

        let _totalCredits = _data.credits - 2 + _data.reward;

        let _records = StorageService.getObject("guestUserGameData")

        _data.id = _records?.length + 1 || 1;
        _data.created_at = new Date();
        _data.credits = _totalCredits;
        _data.remaining_credits = _totalCredits;

        if(!_records)
        {
            StorageService.setObject("guestUserGameData", [_data])
        } 
        else
        {
            StorageService.setObject("guestUserGameData", [..._records, _data])
        }
        

        dispatch(login({name: "Guest User", credits: _totalCredits, id:0}));

        isWin === 1 ? Alert.success("Congratulations you win the game..."): Alert.error("Oops...you lose the game")

    }

  return (
    <div>
      <Button variant="contained" > Play </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Play Casino Game
            </Typography>
            <Box
                component="div"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '100%' },
                  }}
                noValidate
                autoComplete="off"
            >
            <ButtonGroup size="small" aria-label="small button group">
                <Button 
                    variant="contained"
                    className="mr-8"
                    onClick={handleplaying}
                    color="success"
                    disabled={playing}
                > Play 
                </Button>

                <Button 
                    variant="contained"
                    onClick={handleplayingForWin}
                    disabled={creditPlaying}
                > Credit Score 
                </Button>

                <Button 
                    variant="contained"
                    onClick={(e) => setPlayGame(false)}
                    color="error"
                > Close 
                </Button>
            </ButtonGroup>

                <div className="card-layout">
                    <div className="crads-group">
                    <section className='card'>
                        <div className="card-container" ref={slotRef[0]}>
                        {fruits.map((fruit, index) => (
                            <div key={index}>
                            <span><img width="100%" src={fruit} alt="" /></span>
                            </div>
                        ))}
                        </div>
                    </section>
                    </div>
                    <div className="crads-group">
                    <section className='card'>
                        <div className="card-container" ref={slotRef[1]}>
                        {fruits.map((fruit, index) => (
                            <div key={index}>
                            <span><img width="100%" src={fruit} alt="" /></span>
                            </div>
                        ))}
                        </div>
                    </section>
                    </div>
                    <div className="crads-group">
                    <section className='card'>
                        <div className="card-container" ref={slotRef[2]}>
                        {fruits.map((fruit, index) => (
                            <div key={index}>
                            <span><img width="100%" src={fruit} alt="" /></span>
                            </div>
                        ))}
                        </div>
                    </section>
                    </div>
                </div>

            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
