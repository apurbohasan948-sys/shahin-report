import React, { useRef } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { PatientDetails } from "../types";

interface PatientMetaProps {
  patient: PatientDetails;
  isEditable: boolean;
  onUpdate: (updatedDetails: Partial<PatientDetails>) => void;
  destinationCountry: string;
  onUpdateCountry: (country: string) => void;
  isAgentRole?: boolean;
}

export default function PatientMeta({
  patient,
  isEditable,
  onUpdate,
  destinationCountry,
  onUpdateCountry,
  isAgentRole = false,
}: PatientMetaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-3">
      {/* Title block with Country box */}
      <div className="flex flex-col items-center w-full">
        <h3 className="font-sans text-[15px] font-[800] tracking-wide text-gray-950 text-center select-none uppercase">
          MEDICAL EXAMINATION REPORT
        </h3>

        {/* Destination Country Rect */}
        <div className="mt-1.5 px-10 py-0.5 border-2 border-slate-900 bg-white min-w-[200px] flex items-center justify-center">
          {isEditable ? (
            <input
              type="text"
              value={destinationCountry}
              onChange={(e) => onUpdateCountry(e.target.value.toUpperCase())}
              className="text-center font-bold font-sans text-base text-gray-900 border-none bg-transparent w-full focus:outline-none uppercase"
              placeholder="ENTER COUNTRY"
            />
          ) : (
            <span className="font-sans text-[16px] font-[900] text-gray-950 tracking-widest select-all">
              {destinationCountry || "U.A.E"}
            </span>
          )}
        </div>
      </div>

      {/* Profile & Grid details row */}
      <div className="w-full mt-4 flex flex-row gap-5 items-start">
        {/* Left Side: Photo Frame */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            onClick={isEditable ? triggerFileInput : undefined}
            className={`w-[115px] h-[142px] border-2 border-slate-900 bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative group select-none ${
              isEditable ? "cursor-pointer hover:border-blue-500 active:bg-slate-100" : ""
            }`}
          >
            {patient.photoUrl ? (
              <img
                src={patient.photoUrl}
                alt="Patient headshot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 p-2 text-center">
                <Camera className="w-8 h-8 stroke-1.5" />
                <span className="text-[9px] mt-1 font-medium font-sans">Click to Upload</span>
              </div>
            )}

            {/* Hover overlay for Edit Mode */}
            {isEditable && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                <RefreshCw className="w-5 h-5 animate-spin-slow" />
                <span className="text-[10px] font-medium font-sans">Replace Photo</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Right Side: Meta Info Grid */}
        <div className="flex-1 flex flex-col text-[11px] leading-[15px] font-sans text-gray-950">
          {/* Top Info Row: Reg No. & Date of Exam */}
          <div className="flex flex-row justify-between w-full border-b border-gray-100 pb-1 mb-1.5">
            <div className="flex flex-row items-center gap-1.5">
              <span className="font-semibold text-gray-700">Reg No. :</span>
              {isEditable ? (
                <input
                  type="text"
                  value={patient.regNo}
                  onChange={(e) => onUpdate({ regNo: e.target.value })}
                  className="font-bold border border-dashed border-gray-400 px-1 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <span className="font-bold select-all">{patient.regNo}</span>
              )}
            </div>
            <div className="flex flex-row items-center gap-1.5">
              <span className="font-semibold text-gray-700">Date of Exam :</span>
              {isEditable ? (
                <input
                  type="text"
                  value={patient.examDate}
                  onChange={(e) => onUpdate({ examDate: e.target.value })}
                  className="font-bold border border-dashed border-gray-400 px-1 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-right w-[90px]"
                />
              ) : (
                <span className="font-bold select-all">{patient.examDate}</span>
              )}
            </div>
          </div>

          {/* Details Column List */}
          <div className="grid grid-cols-1 gap-1.5 mt-1">
            {/* FULL NAME */}
            <div className="flex flex-row items-baseline grid grid-cols-[110px_20px_1fr]">
              <span className="font-semibold text-gray-700">Full Name</span>
              <span className="text-gray-500 text-center">:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={patient.fullName}
                  onChange={(e) => onUpdate({ fullName: e.target.value.toUpperCase() })}
                  className="font-extrabold border border-dashed border-gray-400 px-1 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase h-[18px]"
                />
              ) : (
                <span className="font-extrabold uppercase select-all truncate">{patient.fullName}</span>
              )}
            </div>

            {/* FATHER'S NAME */}
            <div className="flex flex-row items-baseline grid grid-cols-[110px_20px_1fr]">
              <span className="font-semibold text-gray-700">Father's Name</span>
              <span className="text-gray-500 text-center">:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={patient.fatherName}
                  onChange={(e) => onUpdate({ fatherName: e.target.value.toUpperCase() })}
                  className="font-extrabold border border-dashed border-gray-400 px-1 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase h-[18px]"
                />
              ) : (
                <span className="font-extrabold uppercase select-all truncate">{patient.fatherName}</span>
              )}
            </div>

            {/* MOTHER'S NAME */}
            <div className="flex flex-row items-baseline grid grid-cols-[110px_20px_1fr]">
              <span className="font-semibold text-gray-700">Mother's Name</span>
              <span className="text-gray-500 text-center">:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={patient.motherName}
                  onChange={(e) => onUpdate({ motherName: e.target.value.toUpperCase() })}
                  className="font-extrabold border border-dashed border-gray-400 px-1 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase h-[18px]"
                />
              ) : (
                <span className="font-extrabold uppercase select-all truncate">{patient.motherName}</span>
              )}
            </div>

            {/* PASSPORT NO */}
            <div className="flex flex-row items-baseline grid grid-cols-[110px_20px_1fr]">
              <span className="font-semibold text-gray-700">Passport No</span>
              <span className="text-gray-500 text-center">:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={patient.passportNo}
                  onChange={(e) => onUpdate({ passportNo: e.target.value.toUpperCase() })}
                  className="font-extrabold border border-dashed border-gray-400 px-1 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase h-[18px] w-1/2"
                />
              ) : (
                <span className="font-extrabold uppercase select-all tracking-wider">{patient.passportNo}</span>
              )}
            </div>

            {/* DOB & SEX */}
            <div className="flex flex-row items-baseline grid grid-cols-[110px_20px_1fr]">
              <span className="font-semibold text-gray-700">Date of Birth</span>
              <span className="text-gray-500 text-center">:</span>
              <div className="flex flex-row items-center justify-between w-full">
                {isEditable ? (
                  <input
                    type="text"
                    value={patient.dob}
                    onChange={(e) => onUpdate({ dob: e.target.value })}
                    className="font-extrabold border border-dashed border-gray-400 px-1 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 h-[18px] w-[90px]"
                  />
                ) : (
                  <span className="font-extrabold select-all">{patient.dob}</span>
                )}

                <div className="flex flex-row items-baseline gap-2 pl-4 mr-6">
                  <span className="font-semibold text-gray-700 text-[10px] uppercase">Sex :</span>
                  {isEditable ? (
                    <select
                      value={patient.sex}
                      onChange={(e) => onUpdate({ sex: e.target.value })}
                      className="font-extrabold border border-dashed border-gray-400 px-1 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 h-[20px]"
                    >
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  ) : (
                    <span className="font-extrabold uppercase select-all">{patient.sex}</span>
                  )}
                </div>
              </div>
            </div>

            {/* AGENCY */}
            <div className="flex flex-row items-baseline grid grid-cols-[110px_20px_1fr]">
              <span className="font-semibold text-gray-700">Agency</span>
              <span className="text-gray-500 text-center">:</span>
              {isEditable && !isAgentRole ? (
                <input
                  type="text"
                  value={patient.agency}
                  onChange={(e) => onUpdate({ agency: e.target.value.toUpperCase() })}
                  className="font-extrabold border border-dashed border-gray-400 px-1 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase h-[18px] w-2/3"
                />
              ) : (
                <span className="font-extrabold uppercase select-all">
                  {isAgentRole ? "SHAHIN/AF-1" : (patient.agency || "SHAHIN/AF-1")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
