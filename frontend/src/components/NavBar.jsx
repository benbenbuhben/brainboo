import React, { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
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
    <AppBar
      position="static"
      sx={{ backgroundColor: '#ffffff' }} // White background for AppBar
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Replace BrainBoo title with logo */}
        <IconButton component={Link} to="/" edge="start" sx={{ p: 0 }}>
          <img
            src="/logo.png" // Replace with your logo path
            alt="BrainBoo Logo"
            style={{ height: '40px' }} // Adjust height as needed
          />
        </IconButton>

        {isAuthenticated ? (
          <div>
            {/* Display the user's avatar on the right */}
            <IconButton onClick={handleAvatarClick} sx={{ color: '#000000' }}>
              <Avatar alt={user.name} src={user.picture} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        ) : (
          // Login button with custom styling
          <Button
            onClick={() => loginWithRedirect()}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}