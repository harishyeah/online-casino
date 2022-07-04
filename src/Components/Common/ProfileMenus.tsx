
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux/es/exports';
// @ts-ignore
import {Alert} from '../../Services/AlertService.tsx'
// @ts-ignore
import { logout } from '../../Action/Auth.tsx'

const ProfileMenus = () => {
    
  const { userData }:any = useSelector<any>(state => state.auth);

  const dispatch = useDispatch();
    
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async() => {

      try{
          let _confirm = await Alert.confirmAction()
  
          if(!_confirm)
          {
            return false;
          }
  
          dispatch(logout());
  
          Alert.success("Logged out successfully")
      }
      catch(err)
      {
          Alert.error(err.message)
      }
  }

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem>
                <Typography textAlign="center"><b> Welcome:</b> {userData?.name || "Guest User"}</Typography>
              </MenuItem>

              <MenuItem>
                <Typography textAlign="center"><b> Credits: </b> {userData?.credits || 0}</Typography>
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
            </Menu>
          </Box>
    )

}

export default ProfileMenus