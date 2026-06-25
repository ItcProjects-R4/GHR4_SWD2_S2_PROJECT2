/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { getLoggedInUser } from "../services/LocalStorage";

export let userContext = createContext(); 

export default function UserContextProvider(props) {
  const [isLogin, setLogin] = useState(getLoggedInUser());

  // Auto-login from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (savedUser && isLoggedIn && !isLogin) {
      try {
        const user = JSON.parse(savedUser);
        setLogin(user);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
      }
    }
  }, []);

  return (
    <userContext.Provider value={{ isLogin, setLogin }}>
      {props.children}
    </userContext.Provider>
  );
}