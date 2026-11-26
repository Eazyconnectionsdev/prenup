"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "@/lib/api/http-error";

type FormComponent = React.ComponentType<{
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}>;

/**
 * One questionnaire form on the staff "Update case" pages. It loads the
 * owner's saved answers for the case in the URL, shows them in the same form
 * component the case detail Forms tab uses, and saves them back through the
 * questionnaire endpoint.
 */
export function UpdateCaseSectionForm({
  step,
  field,
  Form,
}: {
  /** Questionnaire API step, e.g. "personal-information". */
  step: string;
  /** Field inside myInformation, e.g. "personalInformation". */
  field: string;
  Form: FormComponent;
}) {
  const params = useParams();
  const caseId = params?.id as string;

  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!caseId) return;
    let cancelled = false;
    Axios.get(`/cases/${caseId}/section/myInformation`)
      .then(({ data: res }) => {
        if (!cancelled) setData(res?.data?.[field] ?? {});
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage({ tone: "error", text: getErrorMessage(error, "Couldn't load the saved answers.") });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [caseId, field]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      await Axios.post(`/cases/${caseId}/questionnaire/${step}`, data);
      setMessage({ tone: "ok", text: "Saved successfully." });
    } catch (error) {
      setMessage({ tone: "error", text: getErrorMessage(error, "Couldn't save this form.") });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-slate-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">
      <Form
        data={data}
        isEditing
        onChange={(name, value) => {
          setMessage(null);
          setData((prev) => {
            const next = { ...prev, [name]: value };
            if (value === undefined) delete next[name];
            return next;
          });
        }}
      />

      <div className="mt-8 flex items-center justify-end gap-4">
        {message && (
          <p
            role={message.tone === "error" ? "alert" : "status"}
            className={`text-sm font-medium ${message.tone === "error" ? "text-rose-600" : "text-emerald-700"}`}
          >
            {message.text}
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-[10px] bg-indigo-600 px-8 py-3 font-semibold text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
