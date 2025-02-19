// src/routes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { LandingPage, LoginPage, MatchesPage, ProfilePage, DiscoverPage } from './pages';
import { NavBar, TabNav } from './components';
import ProfileGuard from './components/ProfileGuard';

function Layout() {
  return (
    <>
      <NavBar />
      <TabNav />
      <Outlet />
    </>
  );
}

// Wrap only pages that require a complete profile.
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
