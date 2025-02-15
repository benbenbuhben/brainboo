import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout({ returnTo: window.location.origin });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Brand/Logo – linking to home */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          BrainBoo
        </Typography>

        {isAuthenticated ? (
          <>
            {/* Display the user's avatar */}
            <IconButton onClick={handleAvatarClick} color="inherit">
              <Avatar alt={user.name} src={user.picture} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {/* Link to profile page */}
              <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                Profile
              </MenuItem>
              {/* Logout option */}
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          // If not authenticated, show a Login button
          <Button color="inherit" onClick={() => loginWithRedirect()}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
