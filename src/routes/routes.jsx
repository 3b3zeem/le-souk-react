import { createBrowserRouter } from "react-router-dom";
import LayOut from "../layouts/Layout.jsx";
import { lazy, Suspense } from "react";
import PaymentSuccess from "../pages/CheckOut/PaymentSuccess.jsx";
import PaymentFailed from "../pages/CheckOut/PaymentFail.jsx";

const NotFound = lazy(() => import("../components/NotFound/NotFound.jsx"));
const Unauthorized = lazy(() =>
  import("../components/Unauthorized/Unauthorized.jsx")
);
const AuthRoute = lazy(() => import("./AuthRoute.jsx"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute.jsx"));
const AdminProtectedRoute = lazy(() => import("./AdminProtectedRoute.jsx"));

const Loader = lazy(() => import("../layouts/Loader.jsx"));
const Home = lazy(() => import("../pages/Home/Home.jsx"));
const Contact = lazy(() => import("../pages/Contact/Contact.jsx"));
const Profile = lazy(() => import("../pages/Profile/Profile.jsx"));
const Login = lazy(() => import("../pages/Auth/Login/Login.jsx"));
const Register = lazy(() => import("../pages/Auth/Register/Register.jsx"));
const Products = lazy(() => import("../pages/Products/Products.jsx"));
const ProductId = lazy(() =>
  import("../pages/Products/ProductId/ProductId.jsx")
);
const Packages = lazy(() => import("../pages/Packages/Packages.jsx"));
const PackagesId = lazy(() =>
  import("../pages/Packages/PackagesId/PackagesId.jsx")
);
const MainCategories = lazy(() => import("../pages/Categories/Categories.jsx"));
const CategoryId = lazy(() =>
  import("../pages/Categories/CategoryId/CategoryId.jsx")
);
const Cart = lazy(() => import("../pages/Cart/Cart.jsx"));
const WishList = lazy(() => import("../pages/WishList/WishList.jsx"));
const Order = lazy(() => import("../pages/Profile/Order/Order.jsx"));
const OrderId = lazy(() => import("../pages/Profile/Order/OrderId.jsx"));
const CheckOut = lazy(() => import("../pages/CheckOut/CheckOut.jsx"));
const Payment = lazy(() => import("../pages/CheckOut/Payment.jsx"));
const ResetPassword = lazy(() =>
  import("../pages/Auth/Reset-Password/ResetPassword.jsx")
);
const EmailVerification = lazy(() =>
  import("../pages/Auth/Email-Verification/EmailVerification.jsx")
);

// * Admin
const AdminLayout = lazy(() => import("../dashboard/layouts/Layout.jsx"));
const Dashboard = lazy(() => import("../dashboard/pages/Home/Dashboard.jsx"));
const Users = lazy(() => import("../dashboard/pages/Users/Users.jsx"));
const Categories = lazy(() =>
  import("../dashboard/pages/Categories/Categories.jsx")
);
const AdminProducts = lazy(() =>
  import("./../dashboard/pages/Products/AdminProducts")
);
const AdminPackages = lazy(() =>
  import("../dashboard/pages/Packages/AdminPackages.jsx")
);
const AdminReviews = lazy(() =>
  import("../dashboard/pages/Reviews/AdminReviews.jsx")
);
const AdminOrders = lazy(() =>
  import("./../dashboard/pages/Orders/AdminOrders")
);
const Coupons = lazy(() => import("../dashboard/pages/Coupons/Coupons.jsx"));
const Settings = lazy(() => import("../dashboard/pages/Settings/Settings.jsx"));
const AdminHero = lazy(() => import("../dashboard/pages/Hero/AdminHero.jsx"));

const routes = createBrowserRouter([
  {
    path: "/",
    element: <LayOut />,
    children: [
      {
        index: true,
        element: <Home />,
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
        path: "products/:productId/*",
        element: (
          <Suspense fallback={<Loader />}>
            <ProductId />
          </Suspense>
        ),
      },
      {
        path: "packages",
        element: (
          <Suspense fallback={<Loader />}>
            <Packages />
          </Suspense>
        ),
      },
      {
        path: "packages/:packagesId/*",
        element: (
          <Suspense fallback={<Loader />}>
            <PackagesId />
          </Suspense>
        ),
      },
      {
        path: "categories",
        element: (
          <Suspense fallback={<Loader />}>
            <MainCategories />
          </Suspense>
        ),
      },
      {
        path: "categories/:categoryId/*",
        element: (
          <Suspense fallback={<Loader />}>
            <CategoryId />
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
        path: "contact",
        element: (
          <Suspense fallback={<Loader />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: "checkOut",
        element: (
          <Suspense fallback={<Loader />}>
            <CheckOut />
          </Suspense>
        ),
      },
      {
        path: "reset-password",
        element: (
          <Suspense fallback={<Loader />}>
            <ResetPassword />
          </Suspense>
        ),
      },
      {
        path: "email-verification",
        element: (
          <Suspense fallback={<Loader />}>
            <EmailVerification />
          </Suspense>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
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
          {
            path: "order",
            element: (
              <Suspense fallback={<Loader />}>
                <Order />
              </Suspense>
            ),
          },
          {
            path: "order/:orderId",
            element: (
              <Suspense fallback={<Loader />}>
                <OrderId />
              </Suspense>
            ),
          },
          {
            path: "order/:orderId/success",
            element: (
              <Suspense fallback={<Loader />}>
                <PaymentSuccess />
              </Suspense>
            ),
          },
          {
            path: "order/:orderId/failed",
            element: (
              <Suspense fallback={<Loader />}>
                <PaymentFailed />
              </Suspense>
            ),
          },
          {
            path: "payment/:orderId",
            element: (
              <Suspense fallback={<Loader />}>
                <Payment />
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
                path: "hero",
                element: (
                  <Suspense fallback={<Loader />}>
                    <AdminHero />
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
              {
                path: "categories",
                element: (
                  <Suspense fallback={<Loader />}>
                    <Categories />
                  </Suspense>
                ),
              },
              {
                path: "products",
                element: (
                  <Suspense fallback={<Loader />}>
                    <AdminProducts />
                  </Suspense>
                ),
              },
              {
                path: "packages",
                element: (
                  <Suspense fallback={<Loader />}>
                    <AdminPackages />
                  </Suspense>
                ),
              },
              {
                path: "coupons",
                element: (
                  <Suspense fallback={<Loader />}>
                    <Coupons />
                  </Suspense>
                ),
              },
              {
                path: "orders",
                element: (
                  <Suspense fallback={<Loader />}>
                    <AdminOrders />
                  </Suspense>
                ),
              },
              {
                path: "reviews",
                element: (
                  <Suspense fallback={<Loader />}>
                    <AdminReviews />
                  </Suspense>
                ),
              },
              {
                path: "settings",
                element: (
                  <Suspense fallback={<Loader />}>
                    <Settings />
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
