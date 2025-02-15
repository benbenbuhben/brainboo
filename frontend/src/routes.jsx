import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { LandingPage, LoginPage, MatchesPage, ProfilePage, DiscoverPage } from './pages';
import { NavBar, TabNav } from './components';

function Layout() {
  return (
    <>
      <NavBar />
      <TabNav />
      <Outlet />
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
