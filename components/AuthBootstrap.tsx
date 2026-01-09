// components/AuthBootstrap.tsx
"use client";

import useGetCurrentUser from "@/hooks/getCurrentUser";
import { logOutUser } from "@/store/asyncThunk/authThunk";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuth) {
      const logoutUser = async () => {
        const result = await dispatch(logOutUser());
        if (result.type === "auth/logOutUser/fulfilled") {
          window.location.assign("/login");
        }
      };
      
      logoutUser();
    }
  }, [isAuth]);

  useGetCurrentUser();
  return <>{children}</>;
};

export default AuthBootstrap;
