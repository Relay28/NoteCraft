import React from 'react';
import { Outlet } from 'react-router-dom';

const NonAuthLayout = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
      <Outlet />
    </div>
  );
};

export default NonAuthLayout;
