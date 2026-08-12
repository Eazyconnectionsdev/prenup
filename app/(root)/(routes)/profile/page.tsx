"use client";

import React, { useState } from "react";
import Axios from "@/lib/ApiConfig";
import {
  inputClasses,
  PartHeader,
} from "@/components/Formprimitives";

interface UserProfileFormProps {
  onContinue?: () => void;
}

export default function UserProfileForm({
  onContinue,
}: UserProfileFormProps) {
 
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    dateOfBirth: "",
    phone: "",
    marketingConsent: false,
  });

 

 const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
 const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

const handleImageUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  setProfileImage(file);
  setImagePreview(URL.createObjectURL(file));
};

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    setLoading(true);

    const payload = new FormData();

    payload.append("firstName", form.firstName);
    payload.append("middleName", form.middleName);
    payload.append("lastName", form.lastName);
    payload.append("suffix", form.suffix);
    payload.append("dateOfBirth", form.dateOfBirth);
    payload.append("phone", form.phone);
    payload.append(
      "marketingConsent",
      String(form.marketingConsent)
    );

    if (profileImage) {
      payload.append("profileImage", profileImage);
    }

    await Axios.patch(
      "/users/profile",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setSubmitted(true);

    if (onContinue) {
      onContinue();
    }
  } catch (error) {
    console.error("Profile update failed:", error);
  } finally {
    setLoading(false);
  }
};

return (
  <div className="min-h-screen bg-slate-100 px-5 py-10">
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl bg-white p-11 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">
        <h2 className="mb-2 text-[1.35rem] font-extrabold tracking-tight text-slate-900">
          Profile Information
        </h2>

        <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
          Please review and update your personal details.
        </p>

        <form onSubmit={handleSubmit}>
          <PartHeader tooltip="Upload a profile picture">
            Profile Photo
          </PartHeader>

          <div className="mb-8 flex flex-col items-center">
            

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block text-sm text-slate-600"
            />
          </div>

          <PartHeader tooltip="Personal details">
            Personal Information
          </PartHeader>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              className={inputClasses}
            />

            <input
              type="text"
              name="middleName"
              placeholder="Middle Name"
              value={form.middleName}
              className={inputClasses}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              className={inputClasses}
            />

            <input
              type="text"
              name="suffix"
              placeholder="Suffix"
              value={form.suffix}
              className={inputClasses}
            />
          </div>

          <PartHeader tooltip="Additional account details">
            Additional Details
          </PartHeader>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              className={inputClasses}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              className={inputClasses}
            />
          </div>

          <PartHeader tooltip="Communication preference">
            Communication Preferences
          </PartHeader>

          <label className="mb-8 flex items-center gap-3 rounded-[10px] border border-slate-300 p-4">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={form.marketingConsent}
            />

            <span className="text-sm text-slate-700">
              I consent to receive marketing communications
            </span>
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-[10px] bg-indigo-600 px-10 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>

        {submitted && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            Profile updated successfully.
          </div>
        )}
      </div>
    </div>
  </div>
);
}