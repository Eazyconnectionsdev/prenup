'use client'

import React, { useState } from 'react'

// Mock available slots
const availableSlots = [
  { date: '2025-12-15', times: ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
  { date: '2025-12-16', times: ['9:00 AM', '1:00 PM', '3:00 PM'] },
  { date: '2025-12-17', times: ['10:00 AM', '12:00 PM', '5:00 PM'] }
]

export default function EnquiryPage() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ name, email, phone, notes, selectedDate, selectedTime })
    setSubmitted(true)
  }

  return (
    <div className="h-full">
      <div className="w-full max-w-5xl mx-auto pl-16 py-6">
        <header className="mb-4">
          <h1 className="text-3xl font-normal text-text-color">Book an Enquiry Appointment</h1>
          <p className="mt-2 text-[15px] font-light text-text-color">
            Select a date and time, and provide your details to book.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {submitted ? (
            <div className="text-center p-6 bg-gray-50 rounded">
              <h2 className="text-xl font-medium mb-2">Booking Confirmed!</h2>
              <p>
                You have booked <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label>
                <div className="text-sm text-slate-900 mb-1">Select Date</div>
                <select
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    setSelectedTime('')
                  }}
                  required
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                >
                  <option value="" disabled>Select a date</option>
                  {availableSlots.map(slot => (
                    <option key={slot.date} value={slot.date}>{slot.date}</option>
                  ))}
                </select>
              </label>

              {selectedDate && (
                <label>
                  <div className="text-sm text-slate-900 mb-1">Select Time</div>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="w-full rounded-md border border-slate-200 px-3 py-2"
                  >
                    <option value="" disabled>Select a time</option>
                    {availableSlots.find(s => s.date === selectedDate)?.times.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </label>
              )}

              <label>
                <div className="text-sm text-slate-900 mb-1">Name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>

              <label>
                <div className="text-sm text-slate-900 mb-1">Email</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>

              <label>
                <div className="text-sm text-slate-900 mb-1">Phone</div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>

              <label className="md:col-span-2">
                <div className="text-sm text-slate-900 mb-1">Notes</div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>

              <div className="md:col-span-2 flex justify-center mt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
