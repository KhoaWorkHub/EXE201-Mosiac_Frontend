import { RouteObject } from 'react-router-dom';
import React from 'react';
import DaNangGuidePage from '../pages/DaNangGuidePage';
import HanoiGuidePage from '../pages/HaNoiGuidePage';
import KhanhHoaGuidePage from '../pages/KhanhHoaGuidePage';
import HoChiMinhGuidePage from '../pages/HCMGuidePage';
import QuangNinhGuidePage from '../pages/QuangNinhGuidePage';

// Export routes as an array of RouteObject
const destinationRoutes: RouteObject[] = [
  {
    path: '/destinations/danang',
    element: React.createElement(DaNangGuidePage),
  },
  {
    path: '/destinations/hanoi',
    element: React.createElement(HanoiGuidePage),
  },
  {
    path: '/destinations/khanhhoa',
    element: React.createElement(KhanhHoaGuidePage),
  },
  {
    path: '/destinations/hochiminh',
    element: React.createElement(HoChiMinhGuidePage),
  },
  {
    path: '/destinations/quangninh',
    element: React.createElement(QuangNinhGuidePage),
  }
  // Add more destination routes here as needed
];

export default destinationRoutes;