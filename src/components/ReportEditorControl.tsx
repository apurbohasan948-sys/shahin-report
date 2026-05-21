import React, { useState, useEffect } from "react";
import {
  FileText,
  User,
  Activity,
  Beaker,
  Award,
  Plus,
  Trash2,
  Copy,
  Save,
  ChevronDown,
  Info,
  CheckCircle,
  FileCheck,
  Globe,
  Upload,
  UserCheck,
  Share2,
  Link
} from "lucide-react";
import { MedicalReport, PatientDetails, PhysicalExamination, LabInvestigations, SignatureConfig } from "../types";
import { MALE_FIT_PRESET, FEMALE_FIT_PRESET, TEMPLATE_REPORT } from "../defaultData";

interface ReportEditorControlProps {
  currentReport: MedicalReport;
  reportsList: MedicalReport[];
  onSelectReport: (id: string) => void;
  onSaveReport: (report: MedicalReport) => void;
  onDeleteReport: (id: string) => void;
  onAddNewReport: (type: "male" | "female" | "blank") => void;
  onDuplicateReport: (report: MedicalReport) => void;
  onUpdateReport: (updatedReport: MedicalReport) => void;
  onDownloadPDF: () => void;
  isInlineEditMode: boolean;
  onToggleInlineEditMode: () => void;
  isGeneratingPdf?: boolean;
  globalHospitalLogo: string;
  globalHospitalSeal: string;
  globalCheckedSignature: string;
  globalDoctorSignature: string;
  onUpdateGlobalLogo: (url: string) => void;
  onUpdateGlobalSeal: (url: string) => void;
  onUpdateGlobalCheckedSignature: (url: string) => void;
  onUpdateGlobalDoctorSignature: (url: string) => void;
  onResetGlobalLogo: () => void;
  onResetGlobalSeal: () => void;
  onResetGlobalCheckedSignature: () => void;
  onResetGlobalDoctorSignature: () => void;
  globalGoogleSheetUrl?: string;
  onUpdateGoogleSheetUrl?: (url: string) => void;
  onResetGoogleSheetUrl?: () => void;
  isAgentRole?: boolean;
  onRequestApproval?: (id: string, agentName?: string) => void;
  onApproveReport?: (id: string) => void;
  onRejectReport?: (id: string) => void;
  isUserAdmin?: boolean;
  adminsList?: string[];
  onAddAdmin?: (email: string) => void;
  onRemoveAdmin?: (email: string) => void;
  currentUser?: any;
}

type TabType = "general" | "patient" | "physical" | "lab" | "signatures" | "admins";

export default function ReportEditorControl({
  currentReport,
  reportsList,
  onSelectReport,
  onSaveReport,
  onDeleteReport,
  onAddNewReport,
  onDuplicateReport,
  onUpdateReport,
  onDownloadPDF,
  isInlineEditMode,
  onToggleInlineEditMode,
  isGeneratingPdf = false,
  globalHospitalLogo,
  globalHospitalSeal,
  globalCheckedSignature,
  globalDoctorSignature,
  onUpdateGlobalLogo,
  onUpdateGlobalSeal,
  onUpdateGlobalCheckedSignature,
  onUpdateGlobalDoctorSignature,
  onResetGlobalLogo,
  onResetGlobalSeal,
  onResetGlobalCheckedSignature,
  onResetGlobalDoctorSignature,
  globalGoogleSheetUrl = "",
  onUpdateGoogleSheetUrl,
  onResetGoogleSheetUrl,
  isAgentRole = false,
  onRequestApproval,
  onApproveReport,
  onRejectReport,
  isUserAdmin = false,
  adminsList = [],
  onAddAdmin,
  onRemoveAdmin,
  currentUser = null,
}: ReportEditorControlProps) {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [copiedLink, setCopiedLink] = useState(false);
  const [agentInputName, setAgentInputName] = useState(() => {
    try {
      return localStorage.getItem("aljabbar_last_agent_name") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    if (isAgentRole && activeTab === "signatures") {
      setActiveTab("general");
    }
  }, [isAgentRole, activeTab]);

  // Local helper to update nested structures
  const updatePatient = (fieldUpdates: Partial<PatientDetails>) => {
    onUpdateReport({
      ...currentReport,
      patient: { ...currentReport.patient, ...fieldUpdates },
    });
  };

  const updatePhysical = (fieldUpdates: Partial<PhysicalExamination>) => {
    onUpdateReport({
      ...currentReport,
      physical: { ...currentReport.physical, ...fieldUpdates },
    });
  };

  const updateLabs = (fieldUpdates: Partial<LabInvestigations>) => {
    onUpdateReport({
      ...currentReport,
      labs: { ...currentReport.labs, ...fieldUpdates },
    });
  };

  const updateSignatures = (fieldUpdates: Partial<SignatureConfig>) => {
    onUpdateReport({
      ...currentReport,
      signatures: { ...currentReport.signatures, ...fieldUpdates },
    });
  };

  // Image Upload helper in the sidebar too
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePatient({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm h-full overflow-hidden">
      
      {/* 1. HEADER SECTION */}
      <div className="p-4 bg-slate-900 text-white flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold tracking-tight">Report Control Panel</h2>
        </div>
        <p className="text-[11px] text-slate-300">
          Replicate the Al-Jabbar medical certificate. Fully customize dates, values, names, or stamps below.
        </p>

        {/* Primary PDF / Approval Status Action Widgets */}
        {isAgentRole ? (
          <div className="mt-2 w-full space-y-1.5">
            {currentReport.approvalStatus === "Approved" ? (
              <button
                onClick={onDownloadPDF}
                disabled={isGeneratingPdf}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-white font-bold text-xs rounded-lg shadow-sm transition-all focus:outline-none ${
                  isGeneratingPdf
                    ? "bg-slate-700 opacity-75 cursor-wait"
                    : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 cursor-pointer"
                }`}
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    Download A4 PDF Report
                  </>
                )}
              </button>
            ) : currentReport.approvalStatus === "Pending Approval" ? (
              <div className="w-full flex flex-col gap-1 text-center">
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-slate-300 font-bold text-xs rounded-lg shadow-sm bg-amber-600/75 cursor-wait focus:outline-none"
                >
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Waiting SHAHIN SIR Approval... (অপেক্ষায়...)
                </button>
                <p className="text-[10px] text-amber-300 italic font-medium">
                  {currentReport.requestedBy ? `এজেন্ট "${currentReport.requestedBy}" - এর ` : ""}রিপোর্টটি এডমিন শাহীন স্যারের অনুমোদনের অপেক্ষায় রয়েছে
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-2">
                <div className="bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/20 space-y-2 text-left">
                  <label className="block text-[11px] font-bold text-indigo-200">
                    👤 আপনার নাম (Agent Name):
                  </label>
                  <input
                    type="text"
                    required
                    value={agentInputName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAgentInputName(val);
                      try {
                        localStorage.setItem("aljabbar_last_agent_name", val);
                      } catch {
                        // ignore
                      }
                    }}
                    placeholder="যেমন: Agent Kabir"
                    className="w-full text-xs py-1.5 px-3 bg-slate-800 border border-indigo-500/30 text-indigo-50 placeholder-indigo-400/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 font-semibold"
                  />
                </div>
                
                <button
                  onClick={() => {
                    if (!agentInputName.trim()) {
                      alert("প্রথমে আপনার সুন্দর নামটি লিখুন! তারপর শাহীন স্যারের কাছে অনুমোদনের রিকোয়েস্ট পাঠান।");
                      return;
                    }
                    if (onRequestApproval) {
                      onRequestApproval(currentReport.id, agentInputName.trim());
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-white font-bold text-xs rounded-lg shadow-sm bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all cursor-pointer focus:outline-none"
                >
                  <FileCheck className="w-4 h-4 text-indigo-200" />
                  Request Shahin Sir for Approval (শাহীন স্যারের কাছে এপ্রুভাল রিকোয়েস্ট পাঠান)
                </button>
                <p className="text-[10.5px] text-indigo-300 text-center">
                  প্রিন্ট বা পিডিএফ সেভ করতে প্রথমে শাহীন স্যারের অনুমোদন রিকোয়েস্ট পাঠান
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2 w-full space-y-2">
            {/* Standard Admin Download PDF Button */}
            <button
              onClick={onDownloadPDF}
              disabled={isGeneratingPdf}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-white font-bold text-xs rounded-lg shadow-sm transition-all focus:outline-none ${
                isGeneratingPdf
                  ? "bg-slate-700 opacity-75 cursor-wait"
                  : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 cursor-pointer"
              }`}
            >
              {isGeneratingPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  Download A4 PDF Report (Admin)
                </>
              )}
            </button>

            {/* Admin Approval Decision Bar (Only shown if pending approval or has special state) */}
            {currentReport.approvalStatus === "Pending Approval" && (
              <div className="bg-slate-800 border border-amber-500/30 rounded-xl p-2.5 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 block text-center">
                  ⚠️ Agent print request is pending approval!
                </span>
                {currentReport.requestedBy && (
                  <div className="bg-slate-900/60 p-2 rounded border border-amber-500/20 text-[10.5px]">
                    <span className="text-gray-400">রিকোয়েস্ট করেছেন:</span>{" "}
                    <span className="text-amber-300 font-extrabold">{currentReport.requestedBy}</span>
                    {currentReport.requestedAt && (
                      <span className="text-gray-500 text-[9px] block">সময়: {currentReport.requestedAt}</span>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onApproveReport && onApproveReport(currentReport.id)}
                    className="py-1.5 px-2 text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10.5px] transition-colors cursor-pointer"
                  >
                    Approve (অনুমোদন)
                  </button>
                  <button
                    onClick={() => onRejectReport && onRejectReport(currentReport.id)}
                    className="py-1.5 px-2 text-center bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-[10.5px] transition-colors cursor-pointer"
                  >
                    Reject (বাতিল)
                  </button>
                </div>
              </div>
            )}

            {currentReport.approvalStatus === "Approved" && (
              <div className="bg-slate-800 border border-emerald-500/20 rounded-xl p-2 flex flex-col gap-1.5 text-[11px] px-3 font-semibold text-emerald-400">
                <div className="flex items-center justify-between">
                  <span>✓ Report Approved & Print Unlocked</span>
                  <button
                    onClick={() => onRejectReport && onRejectReport(currentReport.id)}
                    className="text-[9.5px] text-red-400 underline hover:text-red-300 cursor-pointer"
                  >
                    Revoke
                  </button>
                </div>
                {currentReport.requestedBy && (
                  <div className="text-[9.5px] text-gray-400 bg-slate-900/40 p-1.5 rounded">
                    অনুমোদিত হয়েছে এজেন্টের জন্য: <span className="text-emerald-300 font-bold">{currentReport.requestedBy}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. TAB CONTROLLER BAR */}
      <div className="flex border-b border-gray-200 bg-slate-50 overflow-x-auto text-xs scrollbar-none antialiased">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex-1 py-3 px-2 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[75px] ${
            activeTab === "general"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          General
        </button>
        <button
          onClick={() => setActiveTab("patient")}
          className={`flex-1 py-3 px-2 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[75px] ${
            activeTab === "patient"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Patient
        </button>
        <button
          onClick={() => setActiveTab("physical")}
          className={`flex-1 py-3 px-2 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[75px] ${
            activeTab === "physical"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Physical
        </button>
        <button
          onClick={() => setActiveTab("lab")}
          className={`flex-1 py-3 px-2 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[75px] ${
            activeTab === "lab"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Beaker className="w-3.5 h-3.5" />
          Labs
        </button>
        {!isAgentRole && (
          <button
            onClick={() => setActiveTab("signatures")}
            className={`flex-1 py-3 px-2 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[75px] ${
              activeTab === "signatures"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Signatures
          </button>
        )}
        {isUserAdmin && (
          <button
            onClick={() => setActiveTab("admins")}
            className={`flex-1 py-3 px-2 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[75px] ${
              activeTab === "admins"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Admins
          </button>
        )}
      </div>

      {/* 3. SCROLLABLE TAB CONTENT PANEL */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin space-y-4 text-xs font-sans text-gray-700">
        
        {/* ==================== TAB: GENERAL (Reports List & Presets) ==================== */}
        {activeTab === "general" && (
          <div className="space-y-4">
            
            {/* Quick Edit Mode Info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-blue-900 text-xs block">Double Editing Options:</span>
                <span className="text-blue-800 text-[11px] leading-relaxed block">
                  You can edit values using the form tabs here, <strong>or</strong> turn on <strong>Direct Paper Edit Mode</strong> below and type directly onto the certificate form!
                </span>
                <button
                  onClick={onToggleInlineEditMode}
                  className={`mt-1.5 py-1 px-3 text-[10.5px] font-bold rounded-md shadow-sm border transition-colors cursor-pointer flex items-center gap-1 ${
                    isInlineEditMode
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {isInlineEditMode ? "Direct Sheet Editing: ON" : "Turn ON Direct Sheet Editing"}
                </button>
              </div>
            </div>

            {/* Presets and Reports Section */}
            <div>
              <span className="font-bold text-gray-900 block mb-2 text-xs uppercase tracking-tight">
                Create / Load Templates
              </span>

              {/* Template generator buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onAddNewReport("male")}
                  className="py-2 px-1 text-center bg-sky-50 text-sky-700 font-bold border border-sky-200 hover:bg-sky-100 rounded-lg text-[10px] transition-colors cursor-pointer flex flex-col items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Male Preset
                </button>
                <button
                  onClick={() => onAddNewReport("female")}
                  className="py-2 px-1 text-center bg-pink-50 text-pink-700 font-bold border border-pink-200 hover:bg-pink-100 rounded-lg text-[10px] transition-colors cursor-pointer flex flex-col items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Female Preset
                </button>
                <button
                  onClick={() => onAddNewReport("blank")}
                  className="py-2 px-1 text-center bg-gray-50 text-gray-700 font-bold border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] transition-colors cursor-pointer flex flex-col items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Blank Form
                </button>
              </div>
            </div>

            {/* File Records Manager */}
            <div className="border-t border-gray-100 pt-3">
              <span className="font-bold text-gray-900 block mb-2 text-xs uppercase tracking-tight flex items-center justify-between">
                <span>Saved Reports ({reportsList.length})</span>
                <span className="text-[10px] text-gray-400 font-normal">Stored in local browser</span>
              </span>

              {reportsList.length === 0 ? (
                <div className="text-center py-6 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                  No custom records saved yet. Adjust any details and save!
                </div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-1.5 bg-slate-50/50 scrollbar-thin">
                  {reportsList.map((report) => (
                    <div
                      key={report.id}
                      className={`flex items-center justify-between p-2 rounded-lg transition-colors text-[11px] ${
                        currentReport.id === report.id
                          ? "bg-blue-50 border border-blue-200 text-blue-900 font-bold"
                          : "bg-white hover:bg-gray-50 text-gray-700 border border-transparent"
                      }`}
                    >
                      <button
                        onClick={() => onSelectReport(report.id)}
                        className="flex-1 text-left font-semibold truncate focus:outline-none cursor-pointer"
                      >
                        {report.patient.fullName || "Unnamed"} ({report.patient.destinationCountry || "N/A"})
                        <span className="block text-[9px] text-gray-400 font-normal">
                          {report.patient.regNo} | {report.patient.examDate}
                        </span>
                      </button>

                      <div className="flex items-center gap-1 pl-2">
                        <button
                          onClick={() => onDuplicateReport(report)}
                          title="Duplicate"
                          className="p-1 text-gray-400 hover:text-blue-600 rounded-md hover:bg-white"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteReport(report.id)}
                          title="Delete"
                          className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Current Report */}
            <div className="flex gap-2 border-t border-gray-100 pt-3">
              <button
                onClick={() => onSaveReport(currentReport)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Report File
              </button>
            </div>

            {/* Global Branding & Hospital Assets Panel */}
            {!isAgentRole && (
              <div className="border-t border-gray-200 pt-4 space-y-3 mt-1.5">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-tight">
                  🏥 Hospital custom branding (গ্লোবাল লোগো)
                </span>
                <p className="text-[10px] text-gray-400 leading-normal">
                  এখানে আপলোডকৃত লোগোটি ব্রাউজার লোকাল ডাটাবেজে স্থায়ীভাবে সেভ হয়ে থাকবে। সকল রিপোর্টে এটি ব্যানার লোগো হিসেবে প্রদর্শিত হবে।
                </p>

                <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 border border-gray-300 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden">
                      {globalHospitalLogo ? (
                        <img
                          src={globalHospitalLogo}
                          alt="Global Logo"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-[10px] text-blue-600 font-extrabold text-center leading-none">AMC default</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-bold block text-[11px] text-gray-800">Hospital Banner Logo</span>
                      <span className="text-[9px] text-gray-400 block mb-1">Click below or on sheet logo to upload</span>
                      <div className="flex gap-1.5">
                        <label className="inline-flex items-center gap-1 py-1 px-3 bg-white hover:bg-slate-100 text-gray-700 font-bold text-[10px] border border-gray-300 rounded shadow-xs cursor-pointer transition-colors">
                          <Upload className="w-2.5 h-2.5" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const r = new FileReader();
                                r.onloadend = () => onUpdateGlobalLogo(r.result as string);
                                r.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        {globalHospitalLogo && (
                          <button
                            onClick={onResetGlobalLogo}
                            className="py-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] border border-red-200 rounded cursor-pointer transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Agent Panel Share Link (Admin Only) */}
            {!isAgentRole && (
              <div className="border-t border-gray-200 pt-4 space-y-2.5 mt-2">
                <span className="font-bold text-indigo-950 block text-xs uppercase tracking-tight flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  👥 Copy Agent Panel Link (এজেন্টদের জন্য লিংক)
                </span>
                <p className="text-[10px] text-gray-500 leading-normal">
                  কপি করে আপনার এজেন্টদের পাঠান। এই লিংকে ঢুকলে তারা শুধুমাত্র এজেন্ট প্যানেল দেখতে পারবে এবং সিগনেচার, লোগো বা এজেন্সি এডিট করতে পারবেনা। প্রিন্ট করার সময় আপনার এপ্রুভাল লাগবে।
                </p>

                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-1.5 bg-white border border-indigo-200 rounded-lg p-1.5 pl-2">
                    <Link className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="text-[10px] text-indigo-900 font-mono font-semibold truncate flex-1 block select-all">
                      {typeof window !== "undefined"
                        ? `${window.location.origin}${window.location.pathname}?role=agent`
                        : "Loading agent URL..."}
                    </span>
                    <button
                      onClick={() => {
                        const agentUrl = `${window.location.origin}${window.location.pathname}?role=agent`;
                        navigator.clipboard.writeText(agentUrl);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className={`py-1 px-3 rounded text-[10px] font-bold shadow-xs transition-colors cursor-pointer flex-shrink-0 ${
                        copiedLink
                          ? "bg-emerald-600 text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white hover:text-indigo-50"
                      }`}
                    >
                      {copiedLink ? "কপি হয়েছে!" : "Copy Link"}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB: PATIENT DETAILS ==================== */}
        {activeTab === "patient" && (
          <div className="space-y-3.5">
            <span className="font-bold text-gray-900 block mb-1 text-xs uppercase tracking-tight">Patient Personal Metrics</span>

            {/* Photo upload row */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-gray-200">
              <div className="w-14 h-16 border border-gray-300 bg-white rounded overflow-hidden flex items-center justify-center">
                {currentReport.patient.photoUrl ? (
                  <img
                    src={currentReport.patient.photoUrl}
                    alt="Current upload preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <span className="font-semibold block text-[11px] text-gray-800">Add Patient Photo</span>
                <span className="text-[9px] text-gray-400 block mb-1">Upload headshot or passport picture</span>
                <label className="inline-flex items-center gap-1.5 py-1 px-3 bg-white hover:bg-gray-100 text-gray-700 font-bold text-[10px] border border-gray-300 rounded shadow-sm cursor-pointer transition-colors">
                  <Upload className="w-3 h-3" />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Reg No</label>
                <input
                  type="text"
                  value={currentReport.patient.regNo}
                  onChange={(e) => updatePatient({ regNo: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-slate-50/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Date Of Exam</label>
                <input
                  type="text"
                  value={currentReport.patient.examDate}
                  onChange={(e) => updatePatient({ examDate: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-slate-50/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Full Name</label>
              <input
                type="text"
                value={currentReport.patient.fullName}
                onChange={(e) => updatePatient({ fullName: e.target.value.toUpperCase() })}
                className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold bg-slate-50/20 uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Father's Name</label>
                <input
                  type="text"
                  value={currentReport.patient.fatherName}
                  onChange={(e) => updatePatient({ fatherName: e.target.value.toUpperCase() })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold bg-slate-50/20 uppercase"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Mother's Name</label>
                <input
                  type="text"
                  value={currentReport.patient.motherName}
                  onChange={(e) => updatePatient({ motherName: e.target.value.toUpperCase() })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold bg-slate-50/20 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Sex</label>
                <select
                  value={currentReport.patient.sex}
                  onChange={(e) => updatePatient({ sex: e.target.value })}
                  className="w-full py-1.5 px-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-white"
                >
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Date Of Birth</label>
                <input
                  type="text"
                  value={currentReport.patient.dob}
                  onChange={(e) => updatePatient({ dob: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-slate-50/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Passport No</label>
                <input
                  type="text"
                  value={currentReport.patient.passportNo}
                  onChange={(e) => updatePatient({ passportNo: e.target.value.toUpperCase() })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-slate-50/20 uppercase"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Agency</label>
                <input
                  type="text"
                  disabled={isAgentRole}
                  value={isAgentRole ? "SHAHIN/AF-1" : currentReport.patient.agency}
                  onChange={(e) => updatePatient({ agency: e.target.value.toUpperCase() })}
                  className={`w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold uppercase ${
                    isAgentRole ? "bg-slate-100 text-gray-500 cursor-not-allowed font-extrabold" : "bg-slate-50/20"
                  }`}
                  title={isAgentRole ? "Agency is locked for Agent accounts" : undefined}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                Destination Country
              </label>
              <input
                type="text"
                value={currentReport.patient.destinationCountry}
                onChange={(e) => updatePatient({ destinationCountry: e.target.value.toUpperCase() })}
                className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-extrabold text-blue-900 bg-blue-50/10 uppercase"
              />
            </div>

          </div>
        )}

        {/* ==================== TAB: PHYSICAL EXAMS ==================== */}
        {activeTab === "physical" && (
          <div className="space-y-3.5">
            <span className="font-bold text-gray-900 block mb-1 text-xs uppercase tracking-tight">Physical Parameters</span>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Height</label>
                <input
                  type="text"
                  value={currentReport.physical.height}
                  onChange={(e) => updatePhysical({ height: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Weight</label>
                <input
                  type="text"
                  value={currentReport.physical.weight}
                  onChange={(e) => updatePhysical({ weight: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Pulse</label>
                <input
                  type="text"
                  value={currentReport.physical.pulse}
                  onChange={(e) => updatePhysical({ pulse: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Blood Pressure</label>
                <input
                  type="text"
                  value={currentReport.physical.bloodPressure}
                  onChange={(e) => updatePhysical({ bloodPressure: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Heart</label>
                <input
                  type="text"
                  value={currentReport.physical.heart}
                  onChange={(e) => updatePhysical({ heart: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Liver</label>
                <input
                  type="text"
                  value={currentReport.physical.liver}
                  onChange={(e) => updatePhysical({ liver: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Spleen</label>
                <input
                  type="text"
                  value={currentReport.physical.spleen}
                  onChange={(e) => updatePhysical({ spleen: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Ear, Nose & Throat (ENT)</label>
                <input
                  type="text"
                  value={currentReport.physical.ent}
                  onChange={(e) => updatePhysical({ ent: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Eye Left (LT)</label>
                <input
                  type="text"
                  value={currentReport.physical.eyeLeft}
                  onChange={(e) => updatePhysical({ eyeLeft: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Eye Right (RT)</label>
                <input
                  type="text"
                  value={currentReport.physical.eyeRight}
                  onChange={(e) => updatePhysical({ eyeRight: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Skin</label>
                <input
                  type="text"
                  value={currentReport.physical.skin}
                  onChange={(e) => updatePhysical({ skin: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Physical Quality</label>
                <input
                  type="text"
                  value={currentReport.physical.physicalCondition}
                  onChange={(e) => updatePhysical({ physicalCondition: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">ECG</label>
                <input
                  type="text"
                  value={currentReport.physical.ecg}
                  onChange={(e) => updatePhysical({ ecg: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Chest P/A View</label>
                <input
                  type="text"
                  value={currentReport.physical.chestP_A_View}
                  onChange={(e) => updatePhysical({ chestP_A_View: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB: LAB INVESTIGATIONS ==================== */}
        {activeTab === "lab" && (
          <div className="space-y-4">
            
            {/* Serology Section */}
            <div>
              <span className="font-bold text-gray-900 block mb-2 text-[11px] uppercase tracking-wide border-b border-gray-200 pb-1 text-blue-800">
                1. Serology
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">HBsAg</label>
                  <input
                    type="text"
                    value={currentReport.labs.serology.hbsag}
                    onChange={(e) => updateLabs({
                      serology: { ...currentReport.labs.serology, hbsag: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">VDRL</label>
                  <input
                    type="text"
                    value={currentReport.labs.serology.vdrl}
                    onChange={(e) => updateLabs({
                      serology: { ...currentReport.labs.serology, vdrl: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">TPHA</label>
                  <input
                    type="text"
                    value={currentReport.labs.serology.tpha}
                    onChange={(e) => updateLabs({
                      serology: { ...currentReport.labs.serology, tpha: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Blood Group</label>
                  <input
                    type="text"
                    value={currentReport.labs.serology.bloodGroup}
                    onChange={(e) => updateLabs({
                      serology: { ...currentReport.labs.serology, bloodGroup: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Biochemical, Hematology, Urine */}
            <div>
              <span className="font-bold text-gray-900 block mb-2 text-[11px] uppercase tracking-wide border-b border-gray-200 pb-1 text-blue-800">
                2. Biochemical, Hematology, Urine
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">S. Bilirubin (BIOC)</label>
                  <input
                    type="text"
                    value={currentReport.labs.biochemical.sBilirubin}
                    onChange={(e) => updateLabs({
                      biochemical: { ...currentReport.labs.biochemical, sBilirubin: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Sugar Random (BIOC)</label>
                  <input
                    type="text"
                    value={currentReport.labs.biochemical.sugarRandom}
                    onChange={(e) => updateLabs({
                      biochemical: { ...currentReport.labs.biochemical, sugarRandom: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Hemoglobin (HEMA)</label>
                  <input
                    type="text"
                    value={currentReport.labs.hematology.hemoglobin}
                    onChange={(e) => updateLabs({
                      hematology: { hemoglobin: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Pregnancy Test (URINE)</label>
                  <input
                    type="text"
                    value={currentReport.labs.urine.pregnancyTest}
                    onChange={(e) => updateLabs({
                      urine: { pregnancyTest: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB: SIGNATURES & MEDICAL OUTCOME ==================== */}
        {activeTab === "signatures" && (
          <div className="space-y-4">
            
            {/* Fit Medical Outcome Box */}
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 space-y-2">
              <span className="font-bold text-gray-950 block text-[11px] uppercase tracking-wide flex items-center gap-1">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Medical Outcome Assessment
              </span>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">FIT STATUS DISPLAY</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onUpdateReport({ ...currentReport, fitStatus: "FIT" });
                    }}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      currentReport.fitStatus === "FIT"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-400"
                        : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    FIT
                  </button>
                  <button
                    onClick={() => {
                      onUpdateReport({ ...currentReport, fitStatus: "UNFIT" });
                    }}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      currentReport.fitStatus === "UNFIT"
                        ? "bg-red-100 text-red-800 border-red-400"
                        : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    UNFIT
                  </button>
                </div>
                
                {/* Custom input in case they want a custom label like "RE-EXAMINE" */}
                <input
                  type="text"
                  placeholder="Or enter custom label (e.g., RE-EXAMINE)"
                  value={currentReport.fitStatus}
                  onChange={(e) => onUpdateReport({ ...currentReport, fitStatus: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-bold mt-2 bg-white"
                />
              </div>
            </div>

            {/* Stamp / Signs Toggles */}
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 space-y-2">
              <span className="font-bold text-gray-950 block text-[11px] uppercase tracking-wide">
                Seal & Signatures Options
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold py-1">
                  <input
                    type="checkbox"
                    checked={currentReport.signatures.showCheckedSignature}
                    onChange={(e) => updateSignatures({ showCheckedSignature: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Show Technologist Signature</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold py-1">
                  <input
                    type="checkbox"
                    checked={currentReport.signatures.showCenterStamp}
                    onChange={(e) => updateSignatures({ showCenterStamp: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Show Circular Hospital Stamp</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold py-1">
                  <input
                    type="checkbox"
                    checked={currentReport.signatures.showDoctorSignature}
                    onChange={(e) => updateSignatures({ showDoctorSignature: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Show Doctor Signature</span>
                </label>
              </div>
            </div>

            {/* Staff detailed override inputs */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-900 block text-[10.5px] uppercase">
                Staff Names customization
              </span>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600">Technician Signee</label>
                <input
                  type="text"
                  value={currentReport.signatures.checkedByName}
                  onChange={(e) => updateSignatures({ checkedByName: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none text-[11px] font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600">Authorized Doctor</label>
                <input
                  type="text"
                  value={currentReport.signatures.doctorName}
                  onChange={(e) => updateSignatures({ doctorName: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none text-[11px] font-medium"
                />
              </div>
            </div>

            {/* Global Custom Signs & Seals Manager */}
            <div className="border-t border-gray-200 pt-3 space-y-2.5">
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">
                ✍️ Custom Signature & Seal (সিগনেচার ও সিল)
              </span>
              <p className="text-[10px] text-gray-400 leading-normal">
                এখানে আপলোডকৃত সিল এবং সিগনেচারসমূহ ডাটাবেজে সংরক্ষিত থাকবে এবং সকল রোগীর ফর্মে লোড হবে।
              </p>

              <div className="space-y-2 bg-slate-50 border border-gray-200 rounded-xl p-3">
                {/* 1. Checked By Sign */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-[10.5px]">Technographer Sign</span>
                    <span className="text-[9px] text-gray-400">Checked By section</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label className="py-1 px-2.5 bg-white hover:bg-slate-100 text-gray-700 font-bold text-[10px] border border-gray-300 rounded cursor-pointer transition-colors inline-block relative">
                      {globalCheckedSignature ? "Change" : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const r = new FileReader();
                            r.onloadend = () => onUpdateGlobalCheckedSignature(r.result as string);
                            r.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {globalCheckedSignature && (
                      <button
                        onClick={onResetGlobalCheckedSignature}
                        className="py-1 px-2 bg-red-50 hover:bg-red-100 text-red-500 font-bold text-[10px] border border-red-200 rounded cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Circular Seal Stamp */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-[10.5px]">Circular STAMP / Seal</span>
                    <span className="text-[9px] text-gray-400">Center seal stamp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label className="py-1 px-2.5 bg-white hover:bg-slate-100 text-gray-700 font-bold text-[10px] border border-gray-300 rounded cursor-pointer transition-colors inline-block relative">
                      {globalHospitalSeal ? "Change" : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const r = new FileReader();
                            r.onloadend = () => onUpdateGlobalSeal(r.result as string);
                            r.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {globalHospitalSeal && (
                      <button
                        onClick={onResetGlobalSeal}
                        className="py-1 px-2 bg-red-50 hover:bg-red-100 text-red-500 font-bold text-[10px] border border-red-200 rounded cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Doctor sign */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-[10.5px]">Doctor Signature</span>
                    <span className="text-[9px] text-gray-400">Authorized Officer</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label className="py-1 px-2.5 bg-white hover:bg-slate-100 text-gray-700 font-bold text-[10px] border border-gray-300 rounded cursor-pointer transition-colors inline-block relative">
                      {globalDoctorSignature ? "Change" : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const r = new FileReader();
                            r.onloadend = () => onUpdateGlobalDoctorSignature(r.result as string);
                            r.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {globalDoctorSignature && (
                      <button
                        onClick={onResetGlobalDoctorSignature}
                        className="py-1 px-2 bg-red-50 hover:bg-red-100 text-red-500 font-bold text-[10px] border border-red-200 rounded cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. Firebase Cloud Integration */}
                <div className="border-t border-gray-200 pt-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-800">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>🔥 Firebase Cloud Database Status</span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-normal">
                    গুগল স্প্রেডশিটের পরিবর্তে এখন সম্পূর্ণ ডাটাবেজ রিয়েল-টাইম ফায়ারবেস ক্লাউড স্টোরেজের সাথে যুক্ত। এটি চ্যাট, লাইভ এডিট বা ডাটা ইন্টিগ্রেশন সরাসরি পরিচালনা করে।
                  </p>
                  
                  <div className="bg-emerald-950/40 border border-emerald-900/30 p-2.5 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-emerald-300 font-bold border-b border-emerald-900/20 pb-1.5">
                      <span>⚡ ফায়ারবেস ইন্টিগ্রেশন ইনফো:</span>
                      <span className="px-1.5 py-0.5 bg-emerald-900/40 text-emerald-300 rounded text-[8px] font-mono">CONNECTED</span>
                    </div>
                    <ul className="text-[9.5px] text-slate-300 space-y-1.5 font-sans">
                      <li className="flex justify-between">
                        <span className="text-slate-400">Project ID:</span>
                        <span className="font-mono text-[9px] text-slate-200">chithi-app-2025</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-slate-400">Database Service:</span>
                        <span className="font-mono text-[9px] text-slate-200">Cloud Firestore (Default)</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-slate-400">Total Synchronized:</span>
                        <span className="font-mono text-[9px] text-emerald-400 font-semibold">{reportsList.length} Records</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-slate-400">Active Admin Session:</span>
                        <span className="font-mono text-[9px] text-slate-200">{currentUser?.email || "Guest"}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-indigo-950/20 border border-indigo-900/30 p-2.5 rounded-xl space-y-1">
                    <span className="text-[10px] text-indigo-300 font-bold block">💡 নতুন জিমেইল এডমিন যুক্ত করার নিয়ম:</span>
                    <p className="text-[9px] text-slate-305 leading-relaxed">
                      সহকর্মী বা অন্য কোনো ডক্টরকে এডমিন বানাতে পাশে থাকা <strong>"Admins"</strong> ট্যাবে যান এবং তার সঠিক জিমেইল অ্যাড্রেসটি লিখে <strong>"যুক্ত করুন"</strong> বাটনে ক্লিক করুন। এরপর সেই জিমেইলে সাইন-ইন করলে তিনিও ড্যাশবোর্ডে পূর্ণ এক্সেস পাবেন!
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB: ADMINS (Admin User Management) ==================== */}
        {activeTab === "admins" && isUserAdmin && (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="font-bold text-indigo-900 text-xs block mb-1">🛡️ Admin Access Management</span>
              <p className="text-indigo-800 text-[10.5px] leading-normal font-medium">
                অন্যান্য ডক্টর বা এডমিনদের জিমেইল অ্যাড্রেস এখানে যুক্ত করুন। যুক্ত করার পর তারা গুগল লগইন সম্পন্ন করে AMC ড্যাশবোর্ডের পূর্ণ এডিট এবং এপ্রুভাল পারমিশন পেয়ে যাবেন।
              </p>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <span className="font-bold text-gray-800 text-[11px] block uppercase tracking-tight">নতুন এডমিন যুক্ত করুন:</span>
              <div className="flex gap-2">
                <input
                  id="new-admin-email-input"
                  type="email"
                  placeholder="যেমন: doctor@gmail.com"
                  className="flex-1 text-[11px] py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-slate-950 font-mono tracking-tight focus:outline-none focus:border-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const input = document.getElementById("new-admin-email-input") as HTMLInputElement;
                      if (input && onAddAdmin) {
                        onAddAdmin(input.value);
                        input.value = "";
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById("new-admin-email-input") as HTMLInputElement;
                    if (input && onAddAdmin) {
                      onAddAdmin(input.value);
                      input.value = "";
                    }
                  }}
                  className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer"
                >
                  যোগ করুন
                </button>
              </div>
              <p className="text-[9.5px] text-gray-400">অবশ্যই বৈধ গুগল জিমেইল অ্যাড্রেস প্রদান করতে হবে।</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-gray-950 text-xs block uppercase tracking-wide">সক্রিয় এডমিনদের তালিকা ({adminsList?.length || 0}):</span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-white">
                {(!adminsList || adminsList.length === 0) ? (
                  <div className="text-center py-4 text-gray-400 font-medium">No admins loading...</div>
                ) : (
                  adminsList.map((email) => {
                    const isSelf = email === currentUser?.email?.toLowerCase();
                    const isSystemRoot = email === "apurbohasan948@gmail.com";
                    return (
                      <div key={email} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-200/60 font-mono text-[10.5px]">
                        <span className="font-semibold text-slate-800 truncate select-all">{email}</span>
                        <div className="flex items-center gap-1.5">
                          {isSystemRoot && (
                            <span className="text-[9px] bg-indigo-100 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded-md">ROOT</span>
                          )}
                          {isSelf && (
                            <span className="text-[9px] bg-slate-200 text-slate-700 font-extrabold px-1.5 py-0.5 rounded-md">YOU</span>
                          )}
                          {!isSystemRoot && !isSelf && onRemoveAdmin && (
                            <button
                              onClick={() => {
                                onRemoveAdmin(email);
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. FOOTER CREDENTIALS NOTATION */}
      <div className="p-3 bg-slate-50 border-t border-gray-200 text-center text-[10px] font-medium text-gray-400 flex flex-col items-center justify-center gap-1.5">
        <span>Al-Jabbar Medical Center Report Manager</span>
        <span className="text-[9px] text-gray-300">A4 Dimensions: 210mm × 297mm formatted</span>
      </div>

    </div>
  );
}
