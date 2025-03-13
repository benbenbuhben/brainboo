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
  const currentTab = tabItems.findIndex((tab) => tab.path === location.pathname);

  return (
    <Box>
      <Tabs
        value={currentTab === -1 ? false : currentTab}
        variant="standard" // or "scrollable"
        TabIndicatorProps={{ style: { backgroundColor: '#f62f79', height: '2px' } }}
        sx={{
          minHeight: '64px',
          '& .MuiTabs-flexContainer': {
            gap: 2, // spacing between tabs
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            color: '#555',
            px: 1,
            py: 0,
          },
          '& .Mui-selected': {
            color: '#f62f79',
            fontWeight: 600,
          },
          // Remove bottom border if you want it cleaner
          borderBottom: 'none !important',
        }}
      >
        {tabItems.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            component={Link}
            to={tab.path}
          />
        ))}
      </Tabs>
    </Box>
  );
}

