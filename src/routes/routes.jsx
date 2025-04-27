import { createBrowserRouter } from "react-router-dom";
import LayOut from "../layouts/Layout.jsx";
import { lazy, Suspense } from "react";
import NotFound from "../components/NotFound/NotFound.jsx";
import AuthRoute from "./AuthRoute.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminProtectedRoute from "./AdminProtectedRoute.jsx";

const Loader = lazy(() => import("../layouts/Loader.jsx"));
const Home = lazy(() => import("../pages/Home/Home.jsx"));
const Profile = lazy(() => import("../pages/Profile/Profile.jsx"));
const Login = lazy(() => import("../pages/Auth/Login/Login.jsx"));
const Register = lazy(() => import("../pages/Auth/Register/Register.jsx"));
const Products = lazy(() => import("../pages/Products/Products.jsx"));
const ProductId = lazy(() => import("../pages/Products/ProductId/ProductId.jsx"));
const Cart = lazy(() => import("../pages/Cart/Cart.jsx"));
const WishList = lazy(() => import("../pages/WishList/WishList.jsx"));

// * Admin
const AdminLayout = lazy(() => import("../dashboard/layouts/Layout.jsx"));
const Dashboard = lazy(() => import("../dashboard/pages/Home/Dashboard.jsx"));
const Users = lazy(() => import("../dashboard/pages/Users/Users.jsx"));
const Unauthorized = lazy(() => import("./../components/Unauthorized/Unauthorized.jsx"));

const routes = createBrowserRouter([
  {
    path: "/",
    element: <LayOut />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        element: <AuthRoute />,
        children: [
          {
            path: "login",
            element: (
              <Suspense fallback={<Loader />}>
                <Login />
              </Suspense>
            ),
          },
          {
            path: "register",
            element: (
              <Suspense fallback={<Loader />}>
                <Register />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<Loader />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: "products/:productId",
        element: (
          <Suspense fallback={<Loader />}>
            <ProductId />
          </Suspense>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "cart",
            element: (
              <Suspense fallback={<Loader />}>
                <Cart />
              </Suspense>
            ),
          },
          {
            path: "wishlist",
            element: (
              <Suspense fallback={<Loader />}>
                <WishList />
              </Suspense>
            ),
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<Loader />}>
                <Profile />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "admin-dashboard",
        element: <AdminProtectedRoute />,
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loader />}>
                <AdminLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<Loader />}>
                    <Dashboard />
                  </Suspense>
                ),
              },
              {
                path: "users",
                element: (
                  <Suspense fallback={<Loader />}>
                    <Users />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "unauthorized",
        element: (
          <Suspense fallback={<Loader />}>
            <Unauthorized />
          </Suspense>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);


export default routes;
