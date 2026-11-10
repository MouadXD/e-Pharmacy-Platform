import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = ({ children }) => {
  const { userInfo, isLoading } = useSelector((state) => state.user);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (userInfo) {
    return <Navigate to={"/dashboard/"} replace={true} />;
  }

  return children;
};

export default AuthRoute;
