"use client"

import React from "react"

/* ---------------- DUMMY DATA (FULL) ---------------- */

const dummyCase = {
  _id: "69613c4843303b7269a3f2ed",
  title: "Untitled case",
  createdAt: "2026-01-09T17:35:04.070Z",
  updatedAt: "2026-01-14T11:43:14.971Z",
  fullyLocked: false,

  inviteCredentials: {
    email: "c.engineer9925@gmail.com",
    password: "*6)uOu9nRGwb",
    createdAt: "2026-01-09T17:42:58.591Z",
  },

  owner: "69613c4843303b7269a3f2ea",
  invitedUser: "69613e2243303b7269a3f430",
  invitedEmail: "c.engineer9925@gmail.com",

  step1: {
    firstName: "Shah",
    middleNames: "Mir",
    lastName: "Jutt",
    dateOfBirth: "2026-01-17T00:00:00.000Z",
    address: "itfaq town",
    dateOfMarriage: "2026-01-17T00:00:00.000Z",
    hasChildren: false,
    fluentInEnglish: true,
    nationality: "Pakistan",
    domicileResidencyStatus: "Okara",
    occupation: "SE",
    incomeGBP: 400,
    overviewAim:
      "Please provide an overview of what you are both aiming to do with your agreement and why you want it in place. Please avoid first-person (use third-person: e.g., \"Jenny owns a house\").",
    currentLivingSituation:
      "Please provide a summary of your current living situation, and any future plans (e.g., significant asset purchases, house moves, key life decisions). Please avoid first-person (use third-person).",
    confirm_wenup_platform_used: true,
    property_personal_possessions_remain: true,
    family_home_divided_equally: true,
    court_can_depart_for_children: true,
    agree_costs_shared: true,
  },

  step2: {
    separateEarnings: false,
    earningsEntries: [],
    separateProperties: false,
    propertyEntries: [],
    separateSavings: false,
    savingsEntries: [],
    separatePensions: false,
    pensionEntries: [],
    separateDebts: false,
    debtEntries: [],
    separateBusinesses: false,
    businessEntries: [],
    separateChattels: false,
    chattelEntries: [],
    separateOtherAssets: false,
    otherAssetEntries: [],
  },

  step3: {
    firstName: "aziz",
    middleNames: "ahmad",
    lastName: "jutt",
    dateOfBirth: "2026-01-16T00:00:00.000Z",
    address: "",
    dateOfMarriage: "2026-01-23T00:00:00.000Z",
    hasChildren: false,
    fluentInEnglish: true,
    nationality: "PK",
    domicileResidencyStatus: "Okarafsdf",
    occupation: "sdfsdf",
    incomeGBP: 443,
    overviewAim: "frfdgfdg",
    currentLivingSituation: "dfgdfgfd",
    confirm_wenup_platform_used: true,
    property_personal_possessions_remain: true,
    family_home_divided_equally: true,
    court_can_depart_for_children: true,
    agree_costs_shared: true,
  },

  step4: {
    separateEarnings: false,
    earningsEntries: [],
    separateProperties: false,
    propertyEntries: [],
    separateSavings: false,
    savingsEntries: [],
    separatePensions: false,
    pensionEntries: [],
    separateDebts: false,
    debtEntries: [],
    separateBusinesses: false,
    businessEntries: [],
    separateChattels: false,
    chattelEntries: [],
    separateOtherAssets: false,
    otherAssetEntries: [],
  },

  step5: {
    sharedEarnings: false,
    sharedDebts: false,
    sharedBusinesses: false,
    sharedChattels: false,
    sharedOtherAssets: false,
    liveInRentedOrOwned: false,
    sharedSavings: false,
    sharedPensions: false,
  },

  step6: {
    inheritanceConsideredSeparate: true,
    giftConsideredSeparate: true,
    futureAssetsTreatedJointOrSeparate: true,
    willBeSameAsDivorceSplit: true,
    wantWillHelp: true,
    person1FutureInheritance: {
      originalAmount: 656,
      originalCurrency: "in",
      gbpEquivalent: 544,
      basisOfEstimate: "ghgfhghf",
    },
    person2FutureInheritance: {
      originalAmount: 454,
      originalCurrency: "in",
      gbpEquivalent: 354,
      basisOfEstimate: "fsdfsdfds",
    },
  },

  step7: {
    isOnePregnant: true,
    isOnePregnantOverview: "Please provide an overview of it\n",
    businessWorkedTogether: false,
    businessWorkedTogetherOverview: null,
    oneOutOfWorkOrDependent: true,
    oneOutOfWorkOverview: "Please provide an overview of it\n",
    familyHomeOwnedWith3rdParty: true,
    familyHome3rdPartyOverview: "Please provide an overview of it\n",
    combinedAssetsOver3m: true,
    combinedAssetsOver3mOverview: "Please provide an overview of it\n",
    childFromPreviousRelationshipsLivingWithYou: false,
    childFromPreviousOverview: null,
  },

  status: {
    step1: {
      submitted: true,
      submittedBy: "69613c4843303b7269a3f2ea",
      submittedAt: "2026-01-09T17:36:32.911Z",
      locked: false,
    },
    step2: {
      submitted: true,
      submittedBy: "69613c4843303b7269a3f2ea",
      submittedAt: "2026-01-09T17:41:11.330Z",
      locked: false,
    },
    step3: {
      submitted: true,
      submittedBy: "69613e2243303b7269a3f430",
      submittedAt: "2026-01-14T08:32:06.931Z",
      locked: false,
    },
    step4: {
      submitted: true,
      submittedBy: "69613e2243303b7269a3f430",
      submittedAt: "2026-01-14T08:32:11.426Z",
      locked: false,
    },
    step5: {
      submitted: true,
      submittedBy: "69613c4843303b7269a3f2ea",
      submittedAt: "2026-01-14T08:33:01.239Z",
      locked: false,
    },
    step6: {
      submitted: true,
      submittedBy: "69613c4843303b7269a3f2ea",
      submittedAt: "2026-01-14T08:33:35.327Z",
      locked: false,
    },
    step7: {
      submitted: true,
      submittedBy: "69613c4843303b7269a3f2ea",
      submittedAt: "2026-01-14T09:01:34.355Z",
      locked: false,
    },
  },


  preQuestionnaireUser1: {
    answers: [
      "yes","no","yes","yes","no","yes","no","yes","no","yes","no","yes","no","yes","yes","yes","yes","yes","yes",null,"yes","yes","yes","yes","no","yes","yes","yes","no","yes","yes",
    ],
    selectedLawyer: "6954e273090161bb4bbfa75e",
    submitted: true,
    submittedBy: "69613c4843303b7269a3f2ea",
    submittedAt: "2026-01-14T11:14:16.170Z",
    locked: false,
  },

  preQuestionnaireUser2: {
    answers: [
      "yes","yes","yes","yes","yes","yes","no","yes","no","yes","no","yes","no","no","no","no","no","yes","yes","yes","yes","no","yes","no","yes","no","yes","yes","no","yes","yes",
    ],
    selectedLawyer: null,
    submitted: true,
    submittedBy: "69613e2243303b7269a3f430",
    submittedAt: "2026-01-14T11:16:01.113Z",
    locked: false,
  },
}

/* ---------------- PAGE ---------------- */

export default function CaseDetailPage() {
  return (
    <div className="max-w-6xl px-6 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{dummyCase.title}</h1>
        <p className="text-sm text-slate-500">Case ID: {dummyCase._id}</p>
      </div>

      {/* Overview */}
      <CaseOverview data={dummyCase} />

      {/* Steps */}
      <div className="space-y-6">
        <StepCard title="Step 1 – Party One Details" data={dummyCase.step1} />
        <StepCard title="Step 2 – Party One Assets" data={dummyCase.step2} />
        <StepCard title="Step 3 – Party Two Details" data={dummyCase.step3} />
        <StepCard title="Step 4 – Party Two Assets" data={dummyCase.step4} />
        <StepCard title="Step 5 – Shared Assets" data={dummyCase.step5} />
        <StepCard title="Step 6 – Future Planning" data={dummyCase.step6} />
        <StepCard title="Step 7 – Special Circumstances" data={dummyCase.step7} />
      </div>
    </div>
  )
}

/* ---------------- COMPONENTS ---------------- */

function CaseOverview({ data }: any) {
  const lawyerSelected =
    Boolean(data?.preQuestionnaireUser1?.selectedLawyer) ||
    Boolean(data?.preQuestionnaireUser2?.selectedLawyer)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-white rounded-lg border p-4">

      <OverviewItem
        label="Status"
        value={data.fullyLocked ? "Locked" : "Active"}
        badge
        variant={data.fullyLocked ? "danger" : "success"}
      />

      <OverviewItem
        label="Priority"
        value={data.priority || "Normal"}
        badge
        variant={priorityVariant(data.priority)}
      />

      <OverviewItem
        label="Lawyer"
        value={lawyerSelected ? "Selected" : "Not Selected"}
        badge
        variant={lawyerSelected ? "success" : "warning"}
      />

      <OverviewItem label="Created" value={new Date(data.createdAt).toDateString()} />

      <OverviewItem label="Last Update" value={new Date(data.updatedAt).toDateString()} />
    </div>
  )
}


function OverviewItem({ label, value, badge = false, variant = "default" }: any) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>

      {badge ? (
        <span
          className={`inline-flex mt-1 px-2 py-1 rounded text-xs font-semibold ${variantClasses(
            variant
          )}`}
        >
          {value}
        </span>
      ) : (
        <div className="font-medium mt-1">{value}</div>
      )}
    </div>
  )
}

function variantClasses(variant: string) {
  switch (variant) {
    case "success":
      return "bg-green-100 text-green-700"
    case "warning":
      return "bg-yellow-100 text-yellow-700"
    case "danger":
      return "bg-red-100 text-red-700"
    default:
      return "bg-slate-100 text-slate-700"
  }
}

function priorityVariant(priority?: string) {
  switch (priority) {
    case "High":
      return "danger"
    case "Medium":
      return "warning"
    case "Low":
      return "default"
    default:
      return "default"
  }
}

function StepCard({ title, data }: any) {
  if (!data) return null

  return (
    <div className="bg-white border rounded-lg">
      <div className="px-4 py-3 border-b font-semibold">{title}</div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <Field key={key} label={key} value={value} />
        ))}
      </div>
    </div>
  )
}

function Field({ label, value }: any) {
  const isObject =
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)

  return (
    <div>
      <div className="text-xs text-slate-500 capitalize">
        {label.replace(/_/g, " ")}
      </div>

      {isObject ? (
        <div className="mt-2 ml-3 space-y-1 border-l pl-3">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="text-sm">
              <span className="text-slate-500 capitalize">
                {k.replace(/_/g, " ")}:
              </span>{" "}
              <span className="font-medium">{formatPrimitive(v)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm font-medium">
          {formatPrimitive(value)}
        </div>
      )}
    </div>
  )
}

function formatValue(value: any) {
  if (value === null || value === undefined) return "-"
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (Array.isArray(value)) return value.length ? value.join(", ") : "-"
  if (typeof value === "object") {
    try {
      return JSON.stringify(value)
    } catch (e) {
      return String(value)
    }
  }
  return value.toString()
}

function formatPrimitive(value: any) {
  if (value === null || value === undefined) return "-"
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (Array.isArray(value)) return value.length ? value.join(", ") : "-"
  return value.toString()
}