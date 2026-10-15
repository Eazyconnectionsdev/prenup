"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getFreshProfile } from "@/store/asyncThunk/authThunk";

export default function SessionWatch() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getFreshProfile());
  }, [dispatch]);

  return null;
}
