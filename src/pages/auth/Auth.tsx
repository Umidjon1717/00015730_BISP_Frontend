import { RootState } from "@/redux";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Auth = () => {
  const token = useSelector((state: RootState) => state.token.access_token);
  return token ? <Outlet /> : <Navigate replace to={"/"} />;
};

export default Auth;
