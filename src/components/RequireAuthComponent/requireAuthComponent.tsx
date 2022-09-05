import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuthComponent = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.name 
            ? <Outlet/>
            : <Navigate to="/" state={{from: location}} replace />
    )
}

export default RequireAuthComponent;