import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoutes = ({ children }) => {
  const { userInfo, isLoading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!userInfo) {
    return <Navigate to={"/auth/login"} replace={true} />;
  }

  if (userInfo.role !== "admin") {
    return <Navigate to={"/"} replace={true} />;
  }

  // useEffect(() => {
  //   if (user && user.role !== "admin") {
  //     navigate("/", { replace: true });
  //   }
  // }, [navigate, user]);

  return children;
};

export default AdminRoutes;
