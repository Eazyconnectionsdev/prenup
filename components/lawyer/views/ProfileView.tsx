"use client";

import React from 'react';
import { LawyerPersona } from '../../../types/lawyer-portal';
import { Shield, Building, Award, CheckCircle, LogOut } from 'lucide-react';

interface ProfileViewProps {
  activePersona: LawyerPersona;
  onPersonaChange?: (persona: LawyerPersona) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ activePersona, onPersonaChange, onLogout }) => {
  const getPersonaDetails = (persona: LawyerPersona) => {
    switch (persona) {
      case 'L1':
        return {
          name: 'Robert Miller, Esq.',
          title: 'Senior Partner - Family Practice',
          firm: 'Blake Cassels LLP',
          barId: 'LSO-48192',
          jurisdiction: 'Ontario, Canada',
          email: 'robert.miller@blakes.com',
          phone: '+1 (416) 863-2400',
          verifiedDate: '2026-01-10',
          casesCount: 4,
          capacity: '80%',
        };
      case 'L2':
        return {
          name: 'Mark Sterling, Esq.',
          title: 'Managing Partner - Estates & Family',
          firm: 'Torys LLP',
          barId: 'LSO-64109',
          jurisdiction: 'Ontario, Canada',
          email: 'mark.sterling@torys.com',
          phone: '+1 (416) 865-0040',
          verifiedDate: '2026-02-15',
          casesCount: 3,
          capacity: '60%',
        };
      case 'L3':
      default:
        return {
          name: 'Clara Conner, Esq.',
          title: 'Senior Partner - Wealth Planning',
          firm: 'Osler Hoskin LLP',
          barId: 'LSO-57812',
          jurisdiction: 'Ontario, Canada',
          email: 'clara.conner@osler.com',
          phone: '+1 (416) 862-4200',
          verifiedDate: '2025-11-20',
          casesCount: 2,
          capacity: '40%',
        };
    }
  };

  const lawyer = getPersonaDetails(activePersona);

  return (
    <div className="flex flex-col gap-6 max-w-[960px] font-sans">
      <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-xs flex items-center justify-between gap-6">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 rounded-full bg-[#0d1527] text-white border-2 border-emerald-400 font-bold text-2xl flex items-center justify-center">
            {activePersona}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{lawyer.name}</h2>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                <span>Verified Attorney</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">{lawyer.title}</p>
            <p className="text-slate-400 text-xs mt-0.5">{lawyer.firm}</p>
          </div>
        </div>

        {/* Logout Button on Profile Header */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        )}
      </div>

      {/* Account Session & Security Card */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Account Session &amp; Security</span>
          </h3>
          <p className="text-xs text-slate-500">
            Currently logged in as <strong className="text-slate-800">{lawyer.name}</strong> ({lawyer.email}).
          </p>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-300 hover:border-red-200 text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Credentials Card */}
        <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Professional Credentials</span>
          </h3>

          <div className="flex flex-col gap-2.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Bar ID Number:</span>
              <span className="font-mono font-bold text-slate-800">{lawyer.barId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Jurisdiction:</span>
              <span className="font-semibold text-slate-800">{lawyer.jurisdiction}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Verification Date:</span>
              <span className="font-semibold text-slate-800">{lawyer.verifiedDate}</span>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span>Office Directories</span>
          </h3>

          <div className="flex flex-col gap-2.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Corporate Email:</span>
              <span className="font-semibold text-slate-800">{lawyer.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Telephone:</span>
              <span className="font-mono text-slate-800">{lawyer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Assigned Cases:</span>
              <span className="font-bold text-slate-800">{lawyer.casesCount} active matters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
