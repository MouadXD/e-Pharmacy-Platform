import { Outlet } from "react-router-dom";
import Navbar from "./dashboard/Navbar";

const SharedLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default SharedLayout;
