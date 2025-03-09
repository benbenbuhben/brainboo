// src/components/NavBar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  Container
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import TabNav from './TabNav';

export default function NavBar() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout({ returnTo: window.location.origin });
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #ddd',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Left: Brand */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1,
              mr: 2,
            }}
          >
            <img
              src="/logo.png"
              alt="BrainBoo Logo"
              style={{ height: '40px' }}
            />
            <Typography
              variant="h5"
              sx={{
                color: '#f62f79',
                fontWeight: 700,
              }}
            >
              BrainBoo
            </Typography>
          </Box>

          {/* Use flexGrow to push tabs & avatar to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* The Tab Navigation - to the left of the avatar */}
          <TabNav />

          {/* Spacer to separate tabs from avatar/login */}
          <Box sx={{ width: 24 }} />

          {/* Right: Avatar or Login Button */}
          {isAuthenticated ? (
            <Box>
              <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                <Avatar alt={user?.name} src={user?.picture} />
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
            </Box>
          ) : (
            <Button
              onClick={() => loginWithRedirect()}
              variant="contained"
              sx={{
                backgroundColor: '#f62f79',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#e0296a',
                },
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
