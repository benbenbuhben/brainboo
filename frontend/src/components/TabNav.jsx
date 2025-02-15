import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const tabItems = [
  { label: 'Home', path: '/' },
  { label: 'Discover', path: '/discover' },
  { label: 'Matches', path: '/matches' },
  { label: 'Profile', path: '/profile' },
];

export default function TabsNav() {
  const location = useLocation();

  // Determine the current tab index by matching the path.
  // If no match, default to false (which means no tab selected).
  const currentTab = tabItems.findIndex((tab) => tab.path === location.pathname);

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={currentTab === -1 ? false : currentTab}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="navigation tabs"
      >
        {tabItems.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            component={Link}
            to={tab.path}
            // Optionally, you can add a sx prop here to further customize the look.
            sx={{ textTransform: 'none', fontWeight: 'medium' }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
