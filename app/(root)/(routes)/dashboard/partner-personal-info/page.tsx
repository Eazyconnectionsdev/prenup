"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";
import { personalInfoFormData } from "@/types/routesTypes";

const initialFormData: personalInfoFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  languageFluency: "",
  nationality: "",
  domicileStatus: "",
  currentProfession: "",
  street1: "",
  city: "",
  county: "",
  postcode: "",
  marriageDate: "",
};

const inputClasses =
  "w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 disabled:cursor-not-allowed disabled:opacity-70";

export default function PartnerPersonalInfoView() {
  const [formData, setFormData] = useState<personalInfoFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector((state: RootState) => state.auth.user);
  const caseId = useSelector((state: RootState) => state.auth.caseId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: {
            data: { personalInformation },
          },
        } = await Axios.get(
          `/cases/${caseId}/section/${user.endUserType === "user1" ? "partnerInformation" : "myInformation"}`,
        );

        if (personalInformation) {
          setFormData({ ...personalInformation });
        }
      } catch (error) {
        console.error("Error fetching partner personal information:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (caseId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [caseId, user?.endUserType]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-500">Loading your information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-12 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Partner Information
          </h2>

          <p className="mb-10 text-sm text-slate-500">
            This is the personal information your partner has provided. It is read-only.
          </p>

          <div>
            {/* Full Legal Name */}
            <div className="mb-7">
              <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                Full Legal Name
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1.5fr_2fr]">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  disabled
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="middleName"
                  placeholder="Middle Name(s)"
                  value={formData.middleName}
                  disabled
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  disabled
                  className={inputClasses}
                />
              </div>
            </div>

            {/* DOB & Language */}
            <div className="mb-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  disabled
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                  English Language Proficiency
                </label>
                <select
                  name="languageFluency"
                  value={formData.languageFluency}
                  disabled
                  className={inputClasses}
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes, fully fluent in English</option>
                  <option value="No">No, language assistance needed</option>
                </select>
              </div>
            </div>

            {/* Nationality & Domicile */}
            <div className="mb-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                  Nationality
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  disabled
                  className={inputClasses}
                >
                  <option value="">Select Country</option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="IE">Ireland</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                  Domicile & Residency
                </label>
                <input
                  type="text"
                  name="domicileStatus"
                  placeholder="Country of domicile and current country of residence."
                  value={formData.domicileStatus}
                  disabled
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Profession */}
            <div className="mb-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                  Current Profession / Occupation
                </label>
                <input
                  type="text"
                  name="currentProfession"
                  placeholder="Primary Job Title"
                  value={formData.currentProfession}
                  disabled
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-7">
              <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                Current Home Address
              </label>
              <input
                type="text"
                name="street1"
                placeholder="Street Address Line 1"
                value={formData.street1}
                disabled
                className={`mb-3.5 ${inputClasses}`}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  disabled
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="county"
                  placeholder="County"
                  value={formData.county}
                  disabled
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="postcode"
                  placeholder="Postcode"
                  value={formData.postcode}
                  disabled
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Wedding Date */}
            <div className="mb-7">
              <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                Planned Wedding Date
              </label>
              <input
                type="date"
                name="marriageDate"
                value={formData.marriageDate}
                disabled
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}