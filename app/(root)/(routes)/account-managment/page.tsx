"use client";

import { Button } from "@/components/ui/button";
import Axios from "@/lib/ApiConfig";
import { toDateInputValue } from "@/lib/utils";
import { setUserProfileData } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const AccountManagment = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    middleName: user?.middleName || "",
    lastName: user?.lastName || "",
    suffix: user?.suffix || "",
    email: user?.email || "",
    dateOfBirth: user?.dateOfBirth || "",
    fianceFirstName: user?.fianceDetails?.firstName || "",
    fianceMiddleName: user?.fianceDetails?.middleName || "",
    fianceLastName: user?.fianceDetails?.lastName || "",
    fianceSuffix: user?.fianceDetails?.suffix || "",
    fianceEmail: user?.fianceDetails?.email || "",
    fianceDateOfBirth: user?.fianceDetails?.dateOfBirth || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { data } = await Axios.put("/auth/update-details", form);
      dispatch(setUserProfileData(data));
      toast.success("User details updated successfully!");
    } catch (error: any) {
      console.error("Error While Updating User Profile", error);
      if (error && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message || error.message);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl bg-gray-50  p-6 rounded-xl space-y-10">
      {/* SECTION 1 */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-normal text-text-color">Your Detail</h1>
          <p className="text-xs font-light text-text-color">
            Enter Your detail here!
          </p>
        </div>

        <div className="p-6 rounded-xl space-y-4 bg-white">
          <div className="flex gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs text-gray-500">Your first name</span>
              <input
                type="text"
                placeholder="First name"
                name="firstName"
                onChange={handleChange}
                value={form.firstName}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs text-gray-500">Your middle name</span>
              <input
                type="text"
                placeholder="Middle name"
                name="middleName"
                onChange={handleChange}
                value={form.middleName}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs text-gray-500">Your last name</span>
              <input
                type="text"
                placeholder="Last name"
                name="lastName"
                onChange={handleChange}
                value={form.lastName}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col w-24 gap-1">
              <span className="text-xs text-gray-500">Your suffix</span>
              <input
                type="text"
                placeholder="Jr, Sr."
                name="suffix"
                onChange={handleChange}
                value={form.suffix}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs text-gray-500">Your email</span>
              <input
                type="email"
                placeholder="example@email.com"
                name="email"
                onChange={handleChange}
                value={form.email}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col w-40 gap-1">
              <span className="text-xs text-gray-500">Your date of birth</span>
              <input
                type="date"
                placeholder="dd/mm/yyyy"
                name="dateOfBirth"
                onChange={handleChange}
                value={toDateInputValue(form.dateOfBirth)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 */}

      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-normal text-text-color">
            Fiance's Details
          </h1>
          <p className="text-xs font-light text-text-color">
            Enter Your Fiance's detail here!
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl space-y-4">
          <div className="flex gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs text-gray-500">
                Your fiancé’s first name
              </span>
              <input
                type="text"
                placeholder="Your fiancé’s first name"
                name="fianceFirstName"
                onChange={handleChange}
                value={form.fianceFirstName}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs text-gray-500">
                Your fiancé’s middle name
              </span>
              <input
                type="text"
                placeholder="Your fiancé’s middle name"
                name="fianceMiddleName"
                onChange={handleChange}
                value={form.fianceMiddleName}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs text-gray-500">
                Your fiancé’s last name
              </span>
              <input
                type="text"
                placeholder="Your fiancé’s last name"
                name="fianceLastName"
                onChange={handleChange}
                value={form.fianceLastName}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col w-24 gap-1">
              <span className="text-xs text-gray-500">Their suffix</span>
              <input
                type="text"
                placeholder="suffix"
                name="fianceSuffix"
                onChange={handleChange}
                value={form.fianceSuffix}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs text-gray-500">Your fiancé’s email</span>
              <input
                type="email"
                placeholder="Your fiancé’s email"
                name="fianceEmail"
                onChange={handleChange}
                value={form.fianceEmail}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col w-40 gap-1">
              <span className="text-xs text-gray-500">
                Your fiancé’s date of birth
              </span>
              <input
                type="date"
                placeholder="dd/mm/yyyy"
                name="fianceDateOfBirth"
                onChange={handleChange}
                value={toDateInputValue(form.fianceDateOfBirth)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>
          </div>
        </div>
      </div>
      {/* button for saving changes */}
      <Button
        size="lg"
        onClick={handleSubmit}
        className="ml-auto block text-base text-white font-normal cursor-pointer"
      >
        Save Changes
      </Button>
    </div>
  );
};

export default AccountManagment;
