"use client";

import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Bell,
  CheckCircle,
  Mail,
  Briefcase,
  MapPin,
  Clock,
  LogOut,
  Sliders,
  Award,
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

export const CaseManagerAccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [cmStatus, setCmStatus] = useState<'Online' | 'Busy' | 'Away'>('Online');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [slaAlertsEnabled, setSlaAlertsEnabled] = useState(true);

  if (!isOpen) return null;

  const handleStatusChange = (newStatus: 'Online' | 'Busy' | 'Away') => {
    setCmStatus(newStatus);
    onShowToast(`Case Manager status set to "${newStatus}"`, 'info');
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    onShowToast(`Email notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleToggleSlaAlerts = () => {
    setSlaAlertsEnabled(!slaAlertsEnabled);
    onShowToast(`SLA audio alerts ${!slaAlertsEnabled ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleSignOut = () => {
    onShowToast('Signed out of Case Manager Portal', 'warning');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[540px] bg-white border border-slate-300 rounded-2xl p-7 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-base font-sans flex items-center justify-center shadow-xs">
                SJ
              </div>
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 border-white absolute bottom-0 right-0 ${
                  cmStatus === 'Online'
                    ? 'bg-emerald-500'
                    : cmStatus === 'Busy'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-sans text-slate-900 tracking-tight">
                  Sarah Jenkins
                </h3>
                <span className="badge-rose-pill">CASE_MANAGER</span>
              </div>
              <p className="text-xs font-sans text-slate-500">
                sarah.jenkins@letsprenup.com • ID: CM-80492
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Account Details & Controls */}
        <div className="flex flex-col gap-4 font-sans text-xs">
          
          {/* Status Selection */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Interactive Availability Status:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusChange('Online')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                  cmStatus === 'Online'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                <span>Online</span>
              </button>

              <button
                onClick={() => handleStatusChange('Busy')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                  cmStatus === 'Busy'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-300" />
                <span>In Review</span>
              </button>

              <button
                onClick={() => handleStatusChange('Away')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                  cmStatus === 'Away'
                    ? 'bg-slate-700 text-white border-slate-800 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>Away</span>
              </button>
            </div>
          </div>

          {/* Key Staff Profile Attributes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-500" /> Title / Role
              </span>
              <span className="font-bold text-slate-900">Operational Coordinator</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" /> Primary Jurisdiction
              </span>
              <span className="font-bold text-slate-900">Ontario & BC (Canada)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-slate-500" /> Access Level
              </span>
              <span className="font-bold text-emerald-700">Tier 2 Coordinator (Full CM)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> Active Matters
              </span>
              <span className="font-bold text-slate-900">11 Active Cases</span>
            </div>
          </div>

          {/* Interactive Preferences & Toggles */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Interactive Portal Preferences:
            </span>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Email Notifications for SLA Alerts</span>
              <button
                onClick={handleToggleNotifications}
                className={`w-10 h-5 rounded-full transition-all relative ${
                  notificationsEnabled ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                    notificationsEnabled ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Audio Cue on Case Return</span>
              <button
                onClick={handleToggleSlaAlerts}
                className={`w-10 h-5 rounded-full transition-all relative ${
                  slaAlertsEnabled ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                    slaAlertsEnabled ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            onClick={handleSignOut}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold font-sans text-xs py-2 px-5 rounded-lg shadow-xs transition-all"
          >
            Close Account Profile
          </button>
        </div>

      </div>
    </div>
  );
};
