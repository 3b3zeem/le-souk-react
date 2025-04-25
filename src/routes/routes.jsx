import { createBrowserRouter } from "react-router-dom";
import LayOut from "../layouts/Layout.jsx";
import { lazy, Suspense } from "react";
import NotFound from "../components/NotFound/NotFound.jsx";

const Loader = lazy(() => import("../layouts/Loader.jsx"));
const Home = lazy(() => import("../pages/Home/Home.jsx"));
const Profile = lazy(() => import("../pages/User/Profile.jsx"));
const Login = lazy(() => import("../pages/Auth/Login/Login.jsx"));
const Register = lazy(() => import("./../pages/Auth/Register/Register"));
const Products = lazy(() => import("../pages/Products/Products.jsx"));
const ProductId = lazy(() => import("../pages/Products/ProductId/ProductId.jsx"));
const Cart = lazy(() => import("./../pages/Cart/Cart.jsx"));
const WishList = lazy(() => import("./../pages/WishList/WishList.jsx"));

const routes = createBrowserRouter([
  {
    path: "/",
    element: <LayOut />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
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
      {
        path: "products",
        element: (
          <Suspense fallback={<Loader />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: "product/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <ProductId />
          </Suspense>
        ),
      },
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
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default routes;
