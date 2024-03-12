import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation();
    const userData = JSON.parse(localStorage.getItem("CONT_USER_PERMISS"));

    if(!userData || userData.length < 1){
        return (
            <Navigate to="/login" state={{ from: location }} replace />
        );
    }

    return (
        userData.find(item => item.ROUTE === location.pathname)
            ? <Outlet />
            : <Navigate to="/404" state={{ from: location }} replace />
    );
}

export default RequireAuth;