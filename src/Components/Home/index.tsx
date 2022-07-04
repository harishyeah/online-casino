import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
// @ts-ignore
import UserService from '../../Services/UserService.tsx'
// @ts-ignore
import {Alert} from '../../Services/AlertService.tsx'
// @ts-ignore
import StorageService from '../../Services/StorageService.tsx'
import Button from '@mui/material/Button';
// @ts-ignore
import PlayingGame from './PlayingGame.tsx'
// @ts-ignore
import GuestLogin from '../Common/GuestLogin.tsx';

import image1 from '../../Assets/Images/Icon-1.png'
import image2 from '../../Assets/Images/Icon-2.png'
import image3 from '../../Assets/Images/Icon-3.png'
import image4 from '../../Assets/Images/Icon-4.png'

export default function Home() {

  const { isLoggedIn, userData }: any = useSelector<any>(state => state.auth);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [playGame, setPlayGame] = useState(false);

  const [gameData, setGameData] = useState([]);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      sortable: true,
      width: 180,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => userData.name
    },
    {
      field: 'created_at',
      headerName: 'Playing Date',
      sortable: true,
      type:"datetime",
      width: 180,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => new Date(`${params.row.reward}`).toLocaleString()
    },
    {
      field: 'slot',
      headerName: 'Slot',
      sortable: false,
      width: 180,
      editable: false,
      renderCell: (params) => {
        let result:any = []
          
            for (let slot of JSON.parse(params.row.slot)) { 
              let html:any = ""
                  if(slot === 0)
                  {
                  
                  html = <img width={30} alt='' src={image1} /> 
                  }
                  else if(slot=== 1)
                  {
                  html = <img width={30} alt='' src={image2} /> 
                  }
                  else if(slot=== 2)
                  {
                  html = <img width={30} alt='' src={image3} /> 
                  }
                  else if(slot=== 3)
                  {
                  html = <img width={30} alt='' src={image4} /> 
                  }

                  result.push(html);
            }

            return result

      }
    },
    {
      field: 'fee',
      headerName: 'Game Fee',
      width: 180,
      type:"number",
      editable: false,
      valueGetter: (params: GridValueGetterParams) => '$ 2'
    },
    {
      field: 'winning',
      headerName: 'Winning',
      width: 180,
      type:"number",
      editable: false,
      valueGetter: (params: GridValueGetterParams) => params.row.winning===1?'Yes':'No'
    },
    {
      field: 'reward',
      headerName: 'Reward',
      width: 180,
      type:"number",
      editable: false,
      valueGetter: (params: GridValueGetterParams) => `$ ${params.row.reward}`
    },
    {
      field: 'remaining_credits',
      headerName: 'Remaining Credits',
      sortable: true,
      width: 180,
      type:"number",
      editable: false,
      valueGetter: (params: GridValueGetterParams) => `$ ${params.row.remaining_credits}`
    },
  ];

  useEffect(() => {

    async function fetchData() {
      console.log("enter", userData)
      try {

        // check user login as guest
        if(isLoggedIn && userData.id === 0)
        {
          let _records = StorageService.getObject("guestUserGameData")
          console.log("_records", _records)
          setGameData(_records);
        }
        
        // only for logged in users
        if(isLoggedIn && userData.id > 0)
        {
          setLoading(true);
    
          let response = await UserService.getGameDetails(page, userData.id);
    
          if (response.status === "failure") {
            setLoading(false)
            Alert.error(response.message);
            return false;
          }
          console.log(response);
          
          setGameData(response.data.data);

          setLoading(true)
        }
      }
      catch (error) {
  
        setLoading(true)
        Alert.error(error.message);
      }

    }

    !playGame && fetchData()

  }, [isLoggedIn, playGame])

  const handlePlay = () => {

    setPlayGame(true);

  }

  return (
    <Container maxWidth="xl">
        <Box sx={{ height: 400, width: '100%' }}>
        <h3 style={{textAlign:'center'}}>Welcome To Online Casino</h3>
        {
        isLoggedIn ?
        <>
        <Button variant="contained" style={{marginBottom: '8px'}} onClick={handlePlay} > Play Game </Button>
        <DataGrid
            rows={gameData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[10]}
            // checkboxSelection
            // disableSelectionOnClick
        />
        </>
        :
        <p style={{textAlign:'center'}}>Please Login to play the game OR <GuestLogin /></p>
        }
        </Box>

        {
          playGame &&

          <PlayingGame setPlayGame={setPlayGame} />
        }

    </Container>
  );
}
