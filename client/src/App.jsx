import { Routes, Route } from "react-router-dom";
import SharedLayout from "./components/SharedLayout";
import Overview from "./pages/dashboard/Overview";
import Products from "./pages/dashboard/products/Products";
import SingleProduct from "./pages/dashboard/products/SingleProduct";
import NewProduct from "./pages/dashboard/products/NewProduct";
import EditProduct from "./pages/dashboard/products/EditProduct";
import Category from "./pages/dashboard/Category";
import Suppliers from "./pages/dashboard/Suppliers";
import Coupons from "./pages/dashboard/Coupons";
import Orders from "./pages/dashboard/Orders";
import Managers from "./pages/dashboard/Managers";
import Profile from "./pages/dashboard/profile";
// import NotFound from "./components/dashboard/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./helpers/ProtectedRoute";
import AdminRoutes from "./helpers/AdminRoutes";
import AuthRoute from "./helpers/AuthRoutes";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ProductsUser from "./pages/Products";
import "./axios/globals";
import SharedLayoutClient from "./components/SharedLayoutClient";
import Cart from "./pages/Cart";
import SingleProductClient from "./pages/SingleProduct";
import Offers from "./pages/Offers";
import { Toaster } from "react-hot-toast";
import UserInformations from "./pages/UserInformations";
import UserAdresses from "./pages/UserAdresses";
import CreateAdress from "./pages/CreateAdresse";
import UserOrders from "./pages/userOrders";
import OrderInfo from "./pages/OrderInfo";
import { CheckoutSuccess, CheckoutFailure } from "./pages/CheckoutStatus";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import OrderDetails from "./pages/dashboard/orderDetails";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Discounts from "./pages/dashboard/Discounts";
import Advetissement from "./pages/dashboard/Advertissement";
import Favourites from "./pages/Favourites";
import Blog from "./pages/Blog";
import PostDetails from "./pages/BlogDetails";
import { useDispatch } from "react-redux";
import { userActions } from "./app/features/User";

// import PersonalDetails from "./pages/PersonalDetails";
// import SharedUserProfileLayout from "./components/SharedUserProfileLayout";

function App() {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userCookie = getCookie("user");
  const dispatch = useDispatch();
  const { login } = userActions;

  useEffect(() => {
    if (!userCookie) return;

    let user = null;
    try {
      user = JSON.parse(decodeURIComponent(userCookie));
    } catch {
      user = null;
    }

    // The OAuth callback cookie is only a short-lived hand-off to the SPA.
    document.cookie = "user=; Max-Age=0; path=/";

    if (!user) return;

    localStorage.setItem("user", JSON.stringify(user));
    dispatch(login(user));
  }, [userCookie, dispatch, login]);

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Users Routes */}
        <Route path="/" element={<SharedLayoutClient />}>
          <Route index element={<Home />} />
          <Route path="products">
            <Route index element={<ProductsUser />} />
            <Route path=":id" element={<SingleProductClient />} />
          </Route>
          <Route path="offers" element={<Offers />} />
          <Route path="cart" element={<Cart />} />
          <Route
            path="userInformations"
            element={
              <ProtectedRoute>
                <UserInformations />
              </ProtectedRoute>
            }
          />
          <Route path="userAdresses">
            <Route
              index
              element={
                <ProtectedRoute>
                  <UserAdresses />
                </ProtectedRoute>
              }
            />
            <Route
              path="addNewAdresse"
              element={
                <ProtectedRoute>
                  <CreateAdress />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="userOrders">
            <Route
              index
              element={
                <ProtectedRoute>
                  <UserOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id"
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="favourites" element={<Favourites />} />
          <Route path="blog">
            <Route index element={<Blog />} />
            <Route path=":id" element={<PostDetails />} />
          </Route>
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          {/* <Route
            path="UserAdresses"
            element={
              <ProtectedRoute>
                <UserAdresses />
              </ProtectedRoute>
            }
          >
            <Route
              path="addNewAdresse"
              element={
                <ProtectedRoute>
                  <CreateAdress />
                </ProtectedRoute>
              }
            />
          </Route> */}
          {/* <Route
            path="myAccount"
            element={
              <ProtectedRoute>
                <SharedUserProfileLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedRoute>
                  <PersonalDetails />
                </ProtectedRoute>
              }
            />
          </Route> */}
          {/* <Route
            path="myAccount"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          /> */}
        </Route>
        <Route path="/checkout">
          <Route path="success" element={<CheckoutSuccess />} />
          <Route path="failure" element={<CheckoutFailure />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        {/* Admin Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <AdminRoutes>
                <SharedLayout />
              </AdminRoutes>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <AdminRoutes>
                  <Overview />
                </AdminRoutes>
              </ProtectedRoute>
            }
          />
          <Route path="products">
            <Route
              index
              element={
                <ProtectedRoute>
                  <AdminRoutes>
                    <Products />
                  </AdminRoutes>
                </ProtectedRoute>
              }
            />
            <Route
              path=":id"
              element={
                <ProtectedRoute>
                  <AdminRoutes>
                    <SingleProduct />
                  </AdminRoutes>
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <AdminRoutes>
                    <NewProduct />
                  </AdminRoutes>
                </ProtectedRoute>
              }
            />
            <Route
              path="edit/:id"
              element={
                <ProtectedRoute>
                  <AdminRoutes>
                    <EditProduct />
                  </AdminRoutes>
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="categories"
            element={
              <ProtectedRoute>
                <AdminRoutes>
                  <Category />
                </AdminRoutes>
              </ProtectedRoute>
            }
          />
          <Route
            path="suppliers"
            element={
              <ProtectedRoute>
                <AdminRoutes>
                  <Suppliers />
                </AdminRoutes>
              </ProtectedRoute>
            }
          />
          <Route
            path="coupons"
            element={
              <ProtectedRoute>
                <AdminRoutes>
                  <Coupons />
                </AdminRoutes>
              </ProtectedRoute>
            }
          />
          <Route path="orders">
            <Route
              index
              element={
                <ProtectedRoute>
                  <AdminRoutes>
                    <Orders />
                  </AdminRoutes>
                </ProtectedRoute>
              }
            />
            <Route
              path=":id"
              element={
                <ProtectedRoute>
                  <AdminRoutes>
                    <OrderDetails />
                  </AdminRoutes>
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="managers"
            element={
              <ProtectedRoute>
                <AdminRoutes>
                  <Managers />
                </AdminRoutes>
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <AdminRoutes>
                  <Profile />
                </AdminRoutes>
              </ProtectedRoute>
            }
          />
          <Route
            path="discounts"
            element={
              <ProtectedRoute>
                <AdminRoutes>
                  <Discounts />
                </AdminRoutes>
              </ProtectedRoute>
            }
          />
          <Route
            path="ads"
            element={
              <ProtectedRoute>
                <AdminRoutes>
                  <Advetissement />
                </AdminRoutes>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="auth">
          <Route
            path="login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />
          <Route
            path="forgetPassword"
            element={
              <AuthRoute>
                <ForgetPassword />
              </AuthRoute>
            }
          />
          <Route
            path="resetPassword/:userId/:token"
            element={
              <AuthRoute>
                <ResetPassword />
              </AuthRoute>
            }
          />
        </Route>
        {/* {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
}

export default App;
