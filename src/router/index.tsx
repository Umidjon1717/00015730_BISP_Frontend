import { SuspenseContainer } from "@/config";
import { lazy } from "react";
import { useRoutes } from "react-router-dom";

const Order = lazy(() => import("@/pages/auth/profile/order/Order"))
const Self = lazy(() => import("@/pages/auth/profile/self/Self"))
const MainContactPage = lazy(() => import("@/pages/contact/MainContactPage"));
const About = lazy(() => import("@/pages/about/About"));
const MainCart = lazy(() => import("@/pages/cart/MainCart"));
const PaymentOptions = lazy(
  () => import("@/pages/payment-options/PaymentOptions")
);
const Returns = lazy(() => import("@/pages/returns/Returns"));
const PrivacyPolicy = lazy(
  () => import("@/pages/privacy-policy/PrivacyPolicy")
);
const Wishlist = lazy(() => import("@/pages/wishlist/Wishlits"));
const Profile = lazy(() => import("@/pages/auth/profile/Profile"));
const Auth = lazy(() => import("@/pages/auth/Auth"));
const MainDetail = lazy(() => import("@/pages/detail/MainDetail"));
const Home = lazy(() => import("@/pages/home/Home"));
const Shop = lazy(() => import("@/pages/shop/Shop"));
const Layout = lazy(() => import("@/pages/layout/Layout"));
const NotFound = lazy(() => import("@/pages/not-found/NotFound"));
const SignUp = lazy(() => import("@/pages/auth/sign-up/SignUp"));
const SignIn = lazy(() => import("@/pages/auth/sign-in/SignIn"));
const Otp = lazy(() => import("@/pages/auth/otp/Otp"));
const ForgotPassword = lazy(
  () => import("@/pages/auth/forgot-password/ForgotPassword")
);
const ResetPassword = lazy(
  () => import("@/pages/auth/reset-password/ResetPassword")
);
const Checkout = lazy(() => import("@/pages/checkout/Checkout"));

const Routers = () => {
  return (
    <>
      {useRoutes([
        {
          path: "/",
          element: (
            <SuspenseContainer>
              <Layout />
            </SuspenseContainer>
          ),
          children: [
            {
              path: "/",
              element: (
                <SuspenseContainer>
                  <Home />
                </SuspenseContainer>
              ),
            },
            {
              path: "/shop",
              element: (
                <SuspenseContainer>
                  <Shop />
                </SuspenseContainer>
              ),
            },
            {
              path: "/cart",
              element: (
                <SuspenseContainer>
                  <MainCart />
                </SuspenseContainer>
              ),
            },
            {
              path: "/about",
              element: (
                <SuspenseContainer>
                  <About />
                </SuspenseContainer>
              ),
            },
            {
              path: "/contact",
              element: (
                <SuspenseContainer>
                  <MainContactPage/>
                </SuspenseContainer>
              ),
            },
            {
              path: "/payment-options",
              element: (
                <SuspenseContainer>
                  <PaymentOptions />
                </SuspenseContainer>
              ),
            },
            {
              path: "/returns",
              element: (
                <SuspenseContainer>
                  <Returns />
                </SuspenseContainer>
              ),
            },
            {
              path: "/privacy-policy",
              element: (
                <SuspenseContainer>
                  <PrivacyPolicy />
                </SuspenseContainer>
              ),
            },
            {
              path: "/wishlist",
              element: (
                <SuspenseContainer>
                  <Wishlist />
                </SuspenseContainer>
              ),
            },
            {
              path: "/checkout",
              element: (
                <SuspenseContainer>
                  <Checkout />
                </SuspenseContainer>
              ),
            },
            {
              path: "/auth",
              element: (
                <SuspenseContainer>
                  <Auth />
                </SuspenseContainer>
              ),
              children: [
                {
                  path: "profile",
                  element: (
                    <SuspenseContainer>
                      <Profile />
                    </SuspenseContainer>
                  ),
                  children: [
                    {
                      path: "self",
                      element: (
                        <SuspenseContainer>
                          <Self />
                        </SuspenseContainer>
                      ),
                    },
                    {
                      path: "order",
                      element: (
                        <SuspenseContainer>
                          <Order />
                        </SuspenseContainer>
                      ),
                    },
                  ],
                },
              ],
            },

            {
              path: "/auth/otp",
              element: (
                <SuspenseContainer>
                  <Otp />
                </SuspenseContainer>
              ),
            },
            {
              path: "/product/:id",
              element: (
                <SuspenseContainer>
                  <MainDetail />
                </SuspenseContainer>
              ),
            },

            {
              path: "*",
              element: (
                <SuspenseContainer>
                  <NotFound />
                </SuspenseContainer>
              ),
            },
          ],
          // Sign in and sign up start
        },
        {
          path: "/auth/sign-in",
          element: (
            <SuspenseContainer>
              <SignIn />
            </SuspenseContainer>
          ),
        },
        {
          path: "/auth/sign-up",
          element: (
            <SuspenseContainer>
              <SignUp />
            </SuspenseContainer>
          ),
        },
        {
          path: "/forgot-password",
          element: (
            <SuspenseContainer>
              <ForgotPassword />
            </SuspenseContainer>
          ),
        },
        {
          path: "/reset-password",
          element: (
            <SuspenseContainer>
              <ResetPassword />
            </SuspenseContainer>
          ),
        },
        // Sign in and sign up end
      ])}
    </>
  );
};

export default Routers;
