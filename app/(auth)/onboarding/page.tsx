"use client";

import { useState } from "react";
import appImage from "@/images/app.png";
import bgPoints from "@/images/bg-points.svg";

export default function OnboardingPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const services = [
    {
      id: "prenup-marriage",
      title: "Prenuptial Agreement (Prenup) for Marriage",
      conditions: [
        "I am not yet married, or my wedding date is set more than 28 days from today, or my wedding date has not been set.",
        "I reside in the UK.",
      ],
    },
    {
      id: "prenup-civil",
      title: "Prenuptial Agreement (Prenup) for Civil Partnership",
      conditions: [
        "I am not yet in a civil partnership, or my civil partnership registration date is set for more than 28 days from today, or my registration date has not been set.",
        "I reside in the UK.",
      ],
    },
    {
      id: "postnup-marriage",
      title: "Postnuptial Agreement (Postnup) for Marriage",
      conditions: [
        "I am already married, or my wedding date is within 28 days from today.",
        "I reside in the UK.",
      ],
    },
    {
      id: "postnup-civil",
      title: "Postnuptial Agreement (Postnup) for Civil Partnership",
      conditions: [
        "I am already in a civil partnership, or my civil partnership registration is within 28 days from today.",
        "I reside in the UK.",
      ],
    },
    {
      id: "cohabitation",
      title: "Cohabitation Agreement",
      conditions: ["I reside in the UK."],
    },
  ];

  const handleSubmit = () => {
    if (!selectedService) {
      alert("Please select a service.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd]">
      <div className="flex items-center justify-between gap-36 p-5">
        <div className="h-screen w-[45%] overflow-y-auto scrollbar-hide p-10">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-text-color">
              Welcome to Onboarding <span className="text-yellow-500">😉</span>
            </h1>
            <p className="text-text-color font-light mt-1">
              Simplifying your agreements, stress-free
            </p>
          </div>

          {/* FREE CONSULTATION */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-text-color">
              Free Consultation ?
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              Would you like to book a consultation with our expert?
            </p>

            <div className="flex items-center gap-5 mt-4">
              <button className="text-primary px-14 border border-primary shadow-md py-1 rounded-full font-medium cursor-pointer">
                Yes
              </button>

              <button className=" text-primary px-14 border border-primary shadow-md py-1 rounded-full font-medium cursor-pointer">
                No
              </button>
            </div>
          </div>

          {/* SERVICE SELECTION */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-text-color mb-3">
              Choose the Service
            </h2>

            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-5 rounded-xl border cursor-pointer hover:shadow-md transition
                    ${
                      selectedService === service.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }
                  `}
                >
                  <h3 className="font-semibold text-gray-900">
                    {service.title}
                  </h3>

                  <ul className="text-sm text-muted-foreground mt-2 list-disc pl-4">
                    {service.conditions.map((c, i) => (
                      <li className="mb-1" key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-primary/80 cursor-pointer transition"
          >
            Continue →
          </button>

          {submitted && (
            <p className="text-green-600 text-center mt-4 font-semibold">
              ✔ Submitted successfully!
            </p>
          )}
        </div>

        {/* RIGHT SIDE ILLUSTRATION AREA */}
        
      </div>
    </div>
  );
}


// <div
//           style={{ backgroundImage: `url(${bgPoints.src})` }}
//           className="w-[40%] h-screen z-10 bg-[#081131] rounded-tl-xl rounded-bl-xl p-[3rem] bg-contain bg-no-repeat bg-right"
//         >
//           <div className="w-full h-full flex flex-col gap-8">

//             <div className="h-full relative flex items-center justify-center">
//               <img
//                 src={appImage.src}
//                 alt="app_image"
//                 className="w-[100%] h-[100%] object-contain"
//               />
//             </div>
//           </div>
//         </div>