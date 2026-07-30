"use client";

import { ToastContainer } from "react-toastify";

const ToastContext = () => {

  return  <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>;
};

export default ToastContext