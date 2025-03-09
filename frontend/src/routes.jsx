import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { LandingPage, LoginPage, MatchesPage, ProfilePage, DiscoverPage } from './pages';
import { NavBar, TabNav } from './components';
import ProfileGuard from './components/ProfileGuard';
import { Box } from '@mui/material';

function Layout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <NavBar />
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
}


function ProtectedPages() {
  return (
    <ProfileGuard>
      <Outlet />
    </ProfileGuard>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedPages />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="matches" element={<MatchesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}