import React from 'react'
import PublicRoutes from './PublicRoutes';
import { useRoutes } from 'react-router-dom';

const MainRoutes = () => {
    const routes = [...PublicRoutes];
    const element = useRoutes(routes);
    return element;
}

export default MainRoutes