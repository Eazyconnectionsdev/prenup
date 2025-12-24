"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const AccountManagment = () => {

  const {user} = useSelector((state : RootState) => state.auth)

  const handleChange = () => {
    
  }

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
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs text-gray-500">Your middle name</span>
              <input
                type="text"
                placeholder="Middle name"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs text-gray-500">Your last name</span>
              <input
                type="text"
                placeholder="Last name"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col w-24 gap-1">
              <span className="text-xs text-gray-500">Your suffix</span>
              <input
                type="text"
                placeholder="Jr, Sr."
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
                value={user?.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col w-40 gap-1">
              <span className="text-xs text-gray-500">Your date of birth</span>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
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
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col w-24 gap-1">
              <span className="text-xs text-gray-500">Their suffix</span>
              <input
                type="text"
                placeholder="suffix"
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
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>

            <div className="flex flex-col w-40 gap-1">
              <span className="text-xs text-gray-500">
                Your fiancé’s date of birth
              </span>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-[14px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagment;
