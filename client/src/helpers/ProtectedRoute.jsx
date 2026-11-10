import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { userInfo, isLoading } = useSelector((state) => state.user);
  // const user = localStorage.getItem("user");

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!userInfo) {
    return <Navigate to={"/auth/login"} replace={true} />;
  }

  // Navigate;

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/auth/login", { replace: true });
  //   }
  // }, [navigate, user]);

  return children;
};

export default ProtectedRoute;
