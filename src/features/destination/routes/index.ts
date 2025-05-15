import { RouteObject } from 'react-router-dom';
import React from 'react';
import DaNangGuidePage from '../pages/DaNangGuidePage';

// Export routes as an array of RouteObject
const destinationRoutes: RouteObject[] = [
  {
    path: '/destinations/danang',
    element: React.createElement(DaNangGuidePage),
  },
  // Add more destination routes here as needed
];

export default destinationRoutes;