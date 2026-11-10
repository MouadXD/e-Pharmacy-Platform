import Container from "../Container";
import navbarItems from "../../helpers/navbarItems";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useState, useRef, useEffect } from "react"; // Import useRef and useEffect
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../app/features/User";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null); // Ref for profile dropdown

  const user = useSelector((state) => state.user.userInfo);
  const { logout } = userActions;
  const dispatch = useDispatch();

  let currentPath = useLocation().pathname;
  currentPath = "/" + currentPath.split("/").slice(-1);

  useEffect(() => {
    // Function to handle click outside profile dropdown
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    // Event listener for clicks outside profile dropdown
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#fffff]">
      <div className="grid" style={{ gridTemplateRows: "1fr auto" }}>
        <header
          style={{
            boxShadow: "inset 0 calc(-1 * 1px) 0 0 #dce1e7",
          }}
          className="py-2 mlgd:py-0"
        >
          <Container>
            <div className="h-[70px] py-1 flex items-center justify-between relative">
              <Link to={"/dashboard"}>
                <div>
                  <img
                    // src="http://localhost:5173/src/static/logo_green.png"
                    src="https://res.cloudinary.com/dk3yapeaq/image/upload/v1707595165/iik0k3isyqkn3zrhoojl.png"
                    alt="logo"
                    width="48"
                    height="32"
                  />
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-sm font-semibold">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs mt-[-3px] text-gray-500 font-semibold uppercase">
                    {user?.role}
                  </div>
                </div>
                <div className="relative" ref={profileRef}>
                  {isProfileOpen && (
                    <div
                      className="absolute shadow-xl bg-white top-[30px] right-0 rounded-sm w-[150px] z-[100] after:absolute after:w-[10px] after:h-[10px] after:bg-white after:top-[-5px] after:right-[3px] after:rotate-45 after:border-t-[1px] after:border-l-[1px]"
                      style={{
                        border: "1px solid rgba(101,109,119,.16)",
                      }}
                    >
                      <ul>
                        <li
                          className="cursor-pointer"
                          onClick={() => {
                            setIsProfileOpen(false); // Close profile on link click
                          }}
                        >
                          <Link to={"profile"} className="block w-full p-2 ">
                            Profile
                          </Link>
                        </li>
                        <li
                          className="bg-red-500 text-white cursor-pointer block w-full p-2"
                          onClick={() => {
                            dispatch(logout());
                            setIsProfileOpen(false);
                            window.location.assign(
                              "http://localhost:8000/api/v1/auth/logout"
                            );
                          }}
                        >
                          Logout
                        </li>
                      </ul>
                    </div>
                  )}
                  <HiOutlineDotsVertical
                    className="text-lg cursor-pointer"
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                    }}
                  />
                </div>
              </div>
            </div>
          </Container>
          {false && (
            <div className="pl-2 w-full z-[100] top-[86px] shadow-md bg-primary min-h-[500px] absolute">
              ff
            </div>
          )}
        </header>
        <header
          className="h-[60px] hidden lg:block"
          style={{
            boxShadow: "inset 0 calc(-1 * 1px) 0 0 #dce1e7",
          }}
        >
          <Container>
            <div className="h-full">
              <ul className="flex items-center flex-row gap-[20px] h-full">
                {navbarItems.map((item) => {
                  return (
                    <Link
                      key={item.id}
                      to={`/dashboard${item.path}`}
                      className="text-sm h-full flex items-center"
                    >
                      <li
                        className={`h-[100%] w-fit hover:text-primary px-2 cursor-pointer flex items-center text-black after:content-[''] after:w-[100%] after:h-[2px] after:bg-primary after:bottom-0 hover:after:absolute after:left-0 relative ${
                          currentPath == item.path ? "active" : ""
                        }`}
                      >
                        <div className="text-sm mr-[0.5rem]">
                          <item.icon />
                        </div>
                        {item.name}
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </div>
          </Container>
        </header>
      </div>
    </div>
  );
};

export default Navbar;
