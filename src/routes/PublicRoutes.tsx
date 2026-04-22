import { useRoutes } from "react-router-dom";
import Dashboard from "../pages/dashboard";


const PublicRoutes = [
  {
    path: "/",
    element: <Dashboard />
  }
];


export default PublicRoutes;