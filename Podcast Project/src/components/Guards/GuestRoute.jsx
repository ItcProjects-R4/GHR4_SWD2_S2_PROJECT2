import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "../../context/UserContext";

export default function GuestRoute({ children }) {
  let { isLogin } = useContext(userContext);

  if (isLogin) {
    return <Navigate to="/" />;
  }

  return children;
}
