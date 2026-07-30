// hooks/useGetCurrentUser.ts
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getFreshProfile } from "@/store/asyncThunk/authThunk";
import { AppDispatch } from "@/store/store";

const useGetCurrentUser = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getFreshProfile());
  }, [dispatch]);
};

export default useGetCurrentUser;