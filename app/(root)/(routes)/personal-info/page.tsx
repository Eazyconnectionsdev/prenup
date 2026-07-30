"use client"

import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  languageFluency: string;
  nationality: string;
  domicileStatus: string;
  currentProfession: string;
  street1: string;
  city: string;
  county: string;
  postcode: string;
  marriageDate: string;
}

const initialFormData: FormData = {
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

function calculateAge(dobValue: string): number | null {
  if (!dobValue) return null;
  const dob = new Date(dobValue);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

function daysUntil(dateValue: string): number | null {
  if (!dateValue) return null;
  const target = new Date(dateValue);
  const today = new Date();
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

const steps = ["Personal Information", "Family & Dependents", "Finances"];

export default function PersonalInfoForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const age = calculateAge(formData.dateOfBirth);
  const isUnderage = age !== null && age < 18;

  const diffDays = daysUntil(formData.marriageDate);
  const showTimelineWarning =
    diffDays !== null && diffDays >= 0 && diffDays < 28;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isUnderage) {
      window.alert(
        "Form verification failed: Parties must be at least 18 years of age.",
      );
      return;
    }
    // Place your app router / API save logic here
    setSubmitted(true);
    window.alert(
      "Personal information logged successfully. Moving to next module...",
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Main Card */}
        <div className="rounded-2xl bg-white p-12 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Personal Information
          </h2>

          <label className="mb-10 block text-sm text-slate-500">
            Complete this section using your own personal and financial
            information only. Your partner will complete a separate
            questionnaire using their own information.
          </label>

          <form onSubmit={handleSubmit} noValidate>
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
                  onChange={handleChange}
                  required
                  className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
                <input
                  type="text"
                  name="middleName"
                  placeholder="Middle Name(s)"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
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
                  onChange={handleChange}
                  required
                  className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
                {isUnderage && (
                  <div className="mt-4 rounded-[10px] border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-500">
                    Parties must be of legal age to execute a matrimonial
                    agreement.
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                  English Language Proficiency
                </label>
                <select
                  name="languageFluency"
                  value={formData.languageFluency}
                  onChange={handleChange}
                  required
                  className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
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
                  onChange={handleChange}
                  required
                  className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
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
                  maxLength={100}
                  value={formData.domicileStatus}
                  onChange={handleChange}
                  required
                  className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
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
                  onChange={handleChange}
                  required
                  className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
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
                onChange={handleChange}
                required
                className="mb-3.5 w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
                <input
                  type="text"
                  name="county"
                  placeholder="County"
                  value={formData.county}
                  onChange={handleChange}
                  required
                  className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
                <input
                  type="text"
                  name="postcode"
                  placeholder="Postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                  className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
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
                onChange={handleChange}
                required
                className="w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
              {showTimelineWarning && (
                <div className="mt-4 rounded-[10px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
                  <strong>⚠️ Timeline Guidance:</strong> Prenuptial agreements
                  are generally strongest when completed well before the
                  wedding. If your wedding is less than 28 days away, your
                  solicitor will discuss any potential implications with you.
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-[10px] bg-indigo-600 px-10 py-4 font-semibold text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition hover:-translate-y-px hover:bg-indigo-700 hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] active:translate-y-px"
              >
                Save & Continue
              </button>
            </div>
          </form>

          {submitted && (
            <p className="mt-4 text-right text-sm text-emerald-600">
              Saved. Ready for the next module.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
