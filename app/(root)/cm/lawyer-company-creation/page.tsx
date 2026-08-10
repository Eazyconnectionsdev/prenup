'use client'

import React, { useState } from 'react'

// Mock data for companies
const mockCompanies = [
  { id: 1, name: 'SALESQL LTD', photo: '/company1.png' },
  { id: 2, name: 'Tech Solutions', photo: '/company2.png' },
  { id: 3, name: 'LawCorp', photo: '/company3.png' }
]

export default function CompanyAndLawyerPage() {
  // Company form state
  const [companyName, setCompanyName] = useState('')
  const [companyNumber, setCompanyNumber] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [companyNotes, setCompanyNotes] = useState('')

  // Lawyer form state
  const [lawyerName, setLawyerName] = useState('')
  const [lawyerPhoto, setLawyerPhoto] = useState<File | null>(null)
  const [lawyerCompany, setLawyerCompany] = useState<number | null>(null)
  const [lawyerPublicEmail, setLawyerPublicEmail] = useState('')
  const [lawyerPublicPhone, setLawyerPublicPhone] = useState('')
  const [lawyerDirectEmail, setLawyerDirectEmail] = useState('')
  const [lawyerDirectPhone, setLawyerDirectPhone] = useState('')
  const [lawyerWebsite, setLawyerWebsite] = useState('')
  const [lawyerProfile, setLawyerProfile] = useState('')
  const [lawyerAddress, setLawyerAddress] = useState('')
  const [lawyerBarNumber, setLawyerBarNumber] = useState('')
  const [lawyerNotes, setLawyerNotes] = useState('')
  const [lawyerPricePerHour, setLawyerPricePerHour] = useState('')
  const [includingVat, setIncludingVat] = useState(false)
  const [includingVatExempt, setIncludingVatExempt] = useState(false)
  const [excludingVat, setExcludingVat] = useState(false)

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ companyName, companyNumber, companyAddress, companyEmail, companyPhone, companyWebsite, companyNotes })
  }

  const handleLawyerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      lawyerName,
      lawyerPhoto,
      lawyerCompany,
      lawyerPublicEmail,
      lawyerPublicPhone,
      lawyerDirectEmail,
      lawyerDirectPhone,
      lawyerWebsite,
      lawyerProfile,
      lawyerAddress,
      lawyerBarNumber,
      lawyerNotes,
      lawyerPricePerHour,
      includingVat,
      includingVatExempt,
      excludingVat
    })
  }

  return (
    <div className="h-full">
      <div className="w-full max-w-5xl mx-auto pl-16 py-6">
        {/* Company Creation */}
        <header className="mb-4">
          <h1 className="text-3xl font-normal text-text-color">Create Company</h1>
          <p className="mt-2 text-[15px] font-light text-text-color">Fill in company details</p>
        </header>

        <form onSubmit={handleCompanySubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              <div className="text-sm text-slate-900 mb-1">Company Name</div>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Company Number</div>
              <input value={companyNumber} onChange={(e) => setCompanyNumber(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label className="md:col-span-2">
              <div className="text-sm text-slate-900 mb-1">Registered Office Address</div>
              <input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Email</div>
              <input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Phone Number</div>
              <input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Website</div>
              <input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label className="md:col-span-2">
              <div className="text-sm text-slate-900 mb-1">Notes</div>
              <textarea value={companyNotes} onChange={(e) => setCompanyNotes(e.target.value)} rows={3} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>
          </div>

          <div className="flex justify-center mt-4">
            <button type="submit" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow">
              Save Company
            </button>
          </div>
        </form>

        {/* Lawyer Creation */}
        <header className="mt-12 mb-4">
          <h1 className="text-3xl font-normal text-text-color">Add Lawyer</h1>
          <p className="mt-2 text-[15px] font-light text-text-color">Add lawyer details under a company</p>
        </header>

        <form onSubmit={handleLawyerSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              <div className="text-sm text-slate-900 mb-1">Name</div>
              <input value={lawyerName} onChange={(e) => setLawyerName(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Photo</div>
              <input type="file" onChange={(e) => setLawyerPhoto(e.target.files?.[0] ?? null)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label className="md:col-span-2">
              <div className="text-sm text-slate-900 mb-1">Company</div>
              <select
                value={lawyerCompany ?? ''}
                onChange={(e) => setLawyerCompany(Number(e.target.value))}
                className="w-full rounded-md border border-slate-200 px-3 py-2"
              >
                <option value="" disabled>Select Company</option>
                {mockCompanies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {/* Here you could render a company photo next to name with custom component */}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Public Email</div>
              <input value={lawyerPublicEmail} onChange={(e) => setLawyerPublicEmail(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Public Phone</div>
              <input value={lawyerPublicPhone} onChange={(e) => setLawyerPublicPhone(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Direct Email</div>
              <input value={lawyerDirectEmail} onChange={(e) => setLawyerDirectEmail(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Direct Phone</div>
              <input value={lawyerDirectPhone} onChange={(e) => setLawyerDirectPhone(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Website</div>
              <input value={lawyerWebsite} onChange={(e) => setLawyerWebsite(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Profile Link</div>
              <input value={lawyerProfile} onChange={(e) => setLawyerProfile(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Address</div>
              <input value={lawyerAddress} onChange={(e) => setLawyerAddress(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Bar Registration Number</div>
              <input value={lawyerBarNumber} onChange={(e) => setLawyerBarNumber(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label className="md:col-span-2">
              <div className="text-sm text-slate-900 mb-1">Notes</div>
              <textarea value={lawyerNotes} onChange={(e) => setLawyerNotes(e.target.value)} rows={3} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <label>
              <div className="text-sm text-slate-900 mb-1">Price per hour (£)</div>
              <input type="number" value={lawyerPricePerHour} onChange={(e) => setLawyerPricePerHour(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" />
            </label>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={includingVat} onChange={(e) => setIncludingVat(e.target.checked)} />
                Including VAT
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={includingVatExempt} onChange={(e) => setIncludingVatExempt(e.target.checked)} />
                Including VAT and VAT Exempt
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={excludingVat} onChange={(e) => setExcludingVat(e.target.checked)} />
                Excluding VAT
              </label>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button type="submit" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow">
              Save Lawyer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
