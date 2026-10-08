
"use client";

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  Loader2,
  Lock,
  MessageSquare,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";
import Axios from "@/lib/ApiConfig";
import type { CaseResponse, Confirmation, ConfirmationCardProps, ConfirmationResponse, ConfirmationUploadFormProps, ILACardProps, ILAPersona, ILAStatus, ILAUploadFormProps, Note, NotesResponse, Persona } from "@/types/case-detail/tabs/lawyer-action-tabs";

/* ========================================================================== */
/* TYPES                                                                      */
/* ========================================================================== */
/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function formatDate(date?: string | null) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function getErrorMessage(
  error: any,
  fallback: string,
) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

/* ========================================================================== */
/* CONFIRMATION UPLOAD FORM                                                   */
/* ========================================================================== */

function ConfirmationUploadForm({
  persona,
  uploading,
  onSubmit,
}: ConfirmationUploadFormProps) {
  const [file, setFile] = useState<File | null>(
    null,
  );

  const isP1 = persona === "L1";

  const lawyerName = isP1
    ? "Lawyer 1"
    : "Lawyer 2";

  const title = isP1
    ? "P1 Client Confirmation"
    : "P2 Client Confirmation";

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!file) {
      toast.error(
        "Please select the confirmation file.",
      );
      return;
    }

    await onSubmit(persona, file);

    setFile(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
          <Upload className="h-5 w-5 text-slate-600" />
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">
            {title}
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            {lawyerName} must upload the client
            confirmation document.
          </p>
        </div>
      </div>

      <label className="block cursor-pointer">
        <div className="rounded-lg border border-slate-300 bg-white p-4 transition hover:border-slate-400">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              {file ? (
                <>
                  <p className="truncate text-sm font-medium text-slate-900">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-900">
                    Choose confirmation document
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    PDF, JPG, JPEG or PNG
                  </p>
                </>
              )}
            </div>

            <span className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
              Browse
            </span>
          </div>
        </div>

        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(event) => {
            setFile(
              event.target.files?.[0] ??
                null,
            );
          }}
        />
      </label>

      <button
        type="submit"
        disabled={!file || uploading}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Completing{" "}
            {isP1 ? "P1" : "P2"} Confirmation...
          </>
        ) : (
          <>
            <FileCheck2 className="h-4 w-4" />
            Complete{" "}
            {isP1 ? "P1" : "P2"} Confirmation
          </>
        )}
      </button>
    </form>
  );
}

/* ========================================================================== */
/* CONFIRMATION CARD                                                          */
/* ========================================================================== */

function ConfirmationCard({
  persona,
  complete,
  confirmedAt,
  uploading,
  onSubmit,
}: ConfirmationCardProps) {
  const isP1 = persona === "L1";

  const title = isP1
    ? "P1 Confirmation"
    : "P2 Confirmation";

  const lawyer = isP1
    ? "Lawyer 1"
    : "Lawyer 2";

  return (
    <div
      className={`rounded-2xl border bg-white p-6 shadow-sm ${
        complete
          ? "border-emerald-200"
          : "border-amber-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              complete
                ? "bg-emerald-100 text-emerald-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            {complete ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <Clock3 className="h-6 w-6" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {lawyer}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${
            complete
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {complete
            ? "Complete"
            : "Pending"}
        </span>
      </div>

      {complete ? (
        <div className="mt-5 rounded-xl bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-800">
            {isP1
              ? "P1 client confirmation has been completed."
              : "P2 client confirmation has been completed."}
          </p>

          {confirmedAt && (
            <p className="mt-2 text-sm text-emerald-700">
              <span className="font-medium">
                Confirmed:
              </span>{" "}
              {formatDate(confirmedAt)}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="mt-5 rounded-xl bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              {isP1
                ? "P1 confirmation is still pending."
                : "P2 confirmation is still pending."}
            </p>
          </div>

          <ConfirmationUploadForm
            persona={persona}
            uploading={uploading}
            onSubmit={onSubmit}
          />
        </>
      )}
    </div>
  );
}

/* ========================================================================== */
/* ILA UPLOAD FORM                                                            */
/* ========================================================================== */

function ILAUploadForm({
  type,
  uploading,
  onSubmit,
}: ILAUploadFormProps) {
  const [file, setFile] = useState<File | null>(
    null,
  );

  const title =
    type === "P1"
      ? "P1 ILA"
      : "P2 ILA";

  const description =
    type === "P1"
      ? "Upload the Independent Legal Advice document for Lawyer 1."
      : "Upload the Independent Legal Advice document for Lawyer 2.";

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!file) {
      toast.error(
        `Please select the ${title} document.`,
      );
      return;
    }

    await onSubmit(type, file);

    setFile(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
          <Upload className="h-5 w-5 text-slate-600" />
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">
            Upload {title}
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <label className="block cursor-pointer">
        <div className="rounded-lg border border-slate-300 bg-white p-4 transition hover:border-slate-400">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              {file ? (
                <>
                  <p className="truncate text-sm font-medium text-slate-900">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-900">
                    Choose ILA document
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    PDF, JPG, JPEG or PNG
                  </p>
                </>
              )}
            </div>

            <span className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
              Browse
            </span>
          </div>
        </div>

        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(event) => {
            setFile(
              event.target.files?.[0] ??
                null,
            );
          }}
        />
      </label>

      <button
        type="submit"
        disabled={!file || uploading}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Completing {title}...
          </>
        ) : (
          <>
            <FileCheck2 className="h-4 w-4" />
            Complete {title}
          </>
        )}
      </button>
    </form>
  );
}

/* ========================================================================== */
/* ILA CARD                                                                   */
/* ========================================================================== */

function ILACard({
  type,
  complete,
  completedAt,
  uploading,
  onSubmit,
}: ILACardProps) {
  const title =
    type === "P1"
      ? "P1 ILA"
      : "P2 ILA";

  const lawyer =
    type === "P1"
      ? "Lawyer 1"
      : "Lawyer 2";

  return (
    <div
      className={`rounded-2xl border bg-white p-6 shadow-sm ${
        complete
          ? "border-emerald-200"
          : "border-amber-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              complete
                ? "bg-emerald-100 text-emerald-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            {complete ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <Clock3 className="h-6 w-6" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {lawyer}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${
            complete
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {complete
            ? "Complete"
            : "Pending"}
        </span>
      </div>

      {complete ? (
        <div className="mt-5 rounded-xl bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-800">
            {title} has been completed.
          </p>

          {completedAt && (
            <p className="mt-2 text-sm text-emerald-700">
              <span className="font-medium">
                Completed:
              </span>{" "}
              {formatDate(completedAt)}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="mt-5 rounded-xl bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              {title} is still pending.
            </p>
          </div>

          <ILAUploadForm
            type={type}
            uploading={uploading}
            onSubmit={onSubmit}
          />
        </>
      )}
    </div>
  );
}

/* ========================================================================== */
/* MAIN PAGE                                                                  */
/* ========================================================================== */

export default function LawyerCaseWorkflowPage() {
  const params = useParams<{
    id: string;
  }>();

  const caseId =
    typeof params?.id === "string"
      ? params.id
      : "";

  const [initialLoading, setInitialLoading] =
    useState(true);

  const [caseData, setCaseData] =
    useState<CaseResponse | null>(null);

  const [confirmations, setConfirmations] =
    useState<ConfirmationResponse | null>(
      null,
    );

  const [ilaStatus, setIlaStatus] =
    useState<ILAStatus | null>(null);

  const [notes, setNotes] = useState<Note[]>(
    [],
  );

  /* ------------------------------------------------------------------------ */
  /* Uploading states                                                          */
  /* ------------------------------------------------------------------------ */

  const [
    confirmationUploadingPersona,
    setConfirmationUploadingPersona,
  ] = useState<Persona | null>(null);

  const [
    ilaUploadingType,
    setIlaUploadingType,
  ] = useState<ILAPersona | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Notes                                                                     */
  /* ------------------------------------------------------------------------ */

  const [newNote, setNewNote] =
    useState("");

  const [savingNote, setSavingNote] =
    useState(false);

  /* ======================================================================== */
  /* API: CASE                                                                 */
  /* ======================================================================== */

  const loadCase = useCallback(async () => {
    if (!caseId) return;

    try {
      const { data } = await Axios.get(
        `/lawyer/${caseId}`,
      );

      setCaseData(data);
    } catch (error) {
      console.error(
        "Failed to load case:",
        error,
      );
    }
  }, [caseId]);

  /* ======================================================================== */
  /* API: CONFIRMATIONS                                                        */
  /* ======================================================================== */

  const loadConfirmations =
    useCallback(async () => {
      if (!caseId) return;

      try {
        const { data } = await Axios.get(
          `/lawyer/${caseId}/confirmations`,
        );

        console.log(
          "Confirmation response:",
          data,
        );

        setConfirmations(data);
      } catch (error) {
        console.error(
          "Failed to load confirmations:",
          error,
        );

        toast.error(
          getErrorMessage(
            error,
            "Failed to load client confirmations.",
          ),
        );
      }
    }, [caseId]);

  /* ======================================================================== */
  /* API: ILA STATUS                                                           */
  /* ======================================================================== */

  const loadIlaStatus =
    useCallback(async () => {
      if (!caseId) return;

      try {
        const { data } = await Axios.get(
          `/lawyer/${caseId}/ila-status`,
        );

        console.log(
          "ILA status response:",
          data,
        );

        setIlaStatus(data);
      } catch (error) {
        console.error(
          "Failed to load ILA status:",
          error,
        );

        toast.error(
          getErrorMessage(
            error,
            "Failed to load ILA status.",
          ),
        );
      }
    }, [caseId]);

  /* ======================================================================== */
  /* API: NOTES                                                                */
  /* ======================================================================== */

  const loadNotes =
    useCallback(async () => {
      if (!caseId) return;

      try {
        const { data } = await Axios.get(
          `/lawyer/${caseId}/notes`,
        );

        if (Array.isArray(data)) {
          setNotes(data);
          return;
        }

        const response =
          data as NotesResponse;

        setNotes(response.notes ?? []);
      } catch (error) {
        console.error(
          "Failed to load notes:",
          error,
        );
      }
    }, [caseId]);

  /* ======================================================================== */
  /* LOAD PAGE                                                                 */
  /* ======================================================================== */

  const loadPageData =
    useCallback(async () => {
      if (!caseId) {
        setInitialLoading(false);
        return;
      }

      setInitialLoading(true);

      try {
        await Promise.all([
          loadCase(),
          loadConfirmations(),
          loadIlaStatus(),
          loadNotes(),
        ]);
      } finally {
        setInitialLoading(false);
      }
    }, [
      caseId,
      loadCase,
      loadConfirmations,
      loadIlaStatus,
      loadNotes,
    ]);

  useEffect(() => {
    if (!caseId) {
      setInitialLoading(false);
      return;
    }

    loadPageData();
  }, [
    caseId,
    loadPageData,
  ]);

  /* ======================================================================== */
  /* CONFIRMATION HELPERS                                                     */
  /* ======================================================================== */

  const getConfirmation =
    useCallback(
      (
        response:
          | ConfirmationResponse
          | null
          | undefined,
        persona: Persona,
      ): Confirmation | null => {
        if (!response) return null;

        if (persona === "L1") {
          return (
            response.p1Confirmation ??
            response.p1 ??
            null
          );
        }

        return (
          response.p2Confirmation ??
          response.p2 ??
          null
        );
      },
      [],
    );

  const isConfirmationComplete =
    useCallback(
      (
        response:
          | ConfirmationResponse
          | null
          | undefined,
        persona: Persona,
      ): boolean => {
        if (!response) return false;

        if (persona === "L1") {
          if (
            typeof response.finalP1Confirmed ===
            "boolean"
          ) {
            return response.finalP1Confirmed;
          }
        }

        if (persona === "L2") {
          if (
            typeof response.finalP2Confirmed ===
            "boolean"
          ) {
            return response.finalP2Confirmed;
          }
        }

        const confirmation =
          getConfirmation(
            response,
            persona,
          );

        return Boolean(
          confirmation?.uploaded ||
            confirmation?.fileName ||
            confirmation?.url,
        );
      },
      [getConfirmation],
    );

  const getConfirmationDate =
    useCallback(
      (
        response:
          | ConfirmationResponse
          | null
          | undefined,
        persona: Persona,
      ): string | null => {
        if (!response) return null;

        if (
          persona === "L1" &&
          response.finalP1ConfirmedAt
        ) {
          return response.finalP1ConfirmedAt;
        }

        if (
          persona === "L2" &&
          response.finalP2ConfirmedAt
        ) {
          return response.finalP2ConfirmedAt;
        }

        const confirmation =
          getConfirmation(
            response,
            persona,
          );

        return (
          confirmation?.uploadedAt ??
          null
        );
      },
      [getConfirmation],
    );

  /* ======================================================================== */
  /* CONFIRMATION STATUS                                                       */
  /* ======================================================================== */

  const p1Confirmed = useMemo(
    () =>
      isConfirmationComplete(
        confirmations,
        "L1",
      ),
    [
      confirmations,
      isConfirmationComplete,
    ],
  );

  const p2Confirmed = useMemo(
    () =>
      isConfirmationComplete(
        confirmations,
        "L2",
      ),
    [
      confirmations,
      isConfirmationComplete,
    ],
  );

  const p1ConfirmedAt = useMemo(
    () =>
      getConfirmationDate(
        confirmations,
        "L1",
      ),
    [
      confirmations,
      getConfirmationDate,
    ],
  );

  const p2ConfirmedAt = useMemo(
    () =>
      getConfirmationDate(
        confirmations,
        "L2",
      ),
    [
      confirmations,
      getConfirmationDate,
    ],
  );

  /*
   * Stage 2 requires BOTH confirmations.
   */
  const stage2Unlocked =
    p1Confirmed && p2Confirmed;

  /* ======================================================================== */
  /* UPLOAD CONFIRMATION                                                       */
  /* ======================================================================== */

  const uploadConfirmation = async (
    persona: Persona,
    file: File,
  ) => {
    if (!caseId) {
      toast.error("Case ID is missing.");
      return;
    }

    setConfirmationUploadingPersona(
      persona,
    );

    try {
      const formData = new FormData();

      formData.append("file", file);

      const endpoint =
        persona === "L1"
          ? `/lawyer/${caseId}/p1-confirmation`
          : `/lawyer/${caseId}/p2-confirmation`;

      await Axios.post(
        endpoint,
        formData,
      );

      toast.success(
        `${
          persona === "L1"
            ? "P1"
            : "P2"
        } client confirmation completed.`,
      );

      await loadConfirmations();
    } catch (error: any) {
      console.error(
        "Confirmation upload failed:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          `Failed to complete ${
            persona === "L1"
              ? "P1"
              : "P2"
          } confirmation.`,
        ),
      );
    } finally {
      setConfirmationUploadingPersona(
        null,
      );
    }
  };

  /* ======================================================================== */
  /* ILA STATUS                                                                */
  /* ======================================================================== */

  const p1ILACompleted = useMemo(() => {
    if (!ilaStatus) return false;

    /*
     * Current backend field.
     */
    if (
      typeof ilaStatus.p1ILACompleted ===
      "boolean"
    ) {
      return ilaStatus.p1ILACompleted;
    }

    /*
     * Legacy fallback.
     */
    return Boolean(
      ilaStatus.p1 ||
        ilaStatus.p1Completed ||
        ilaStatus.p1Signoff ||
        ilaStatus.p1Ila,
    );
  }, [ilaStatus]);

  const p2ILACompleted = useMemo(() => {
    if (!ilaStatus) return false;

    /*
     * Current backend field.
     */
    if (
      typeof ilaStatus.p2ILACompleted ===
      "boolean"
    ) {
      return ilaStatus.p2ILACompleted;
    }

    /*
     * Legacy fallback.
     */
    return Boolean(
      ilaStatus.p2 ||
        ilaStatus.p2Completed ||
        ilaStatus.p2Signoff ||
        ilaStatus.p2Ila,
    );
  }, [ilaStatus]);

  const p1ILACompletedAt =
    ilaStatus?.p1ILACompletedAt ??
    null;

  const p2ILACompletedAt =
    ilaStatus?.p2ILACompletedAt ??
    null;

  const allILACompleted =
    p1ILACompleted &&
    p2ILACompleted;

  /* ======================================================================== */
  /* UPLOAD ILA                                                                */
  /* ======================================================================== */

  const uploadILA = async (
    type: ILAPersona,
    file: File,
  ) => {
    if (!caseId) {
      toast.error("Case ID is missing.");
      return;
    }

    if (!stage2Unlocked) {
      toast.error(
        "Both P1 and P2 confirmations must be completed first.",
      );
      return;
    }

    setIlaUploadingType(type);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const endpoint =
        type === "P1"
          ? `/lawyer/${caseId}/p1-ila`
          : `/lawyer/${caseId}/p2-ila`;

      console.log(
        `Uploading ${type} ILA:`,
        endpoint,
      );

      /*
       * Upload the ILA document.
       */
      await Axios.post(
        endpoint,
        formData,
      );

      /*
       * Existing backend signoff flow.
       */
      if (type === "P1") {
        await Axios.post(
          `/lawyer/${caseId}/p1-signoff`,
        );
      }

      if (type === "P2") {
        await Axios.post(
          `/lawyer/${caseId}/p2-signoff`,
        );
      }

      toast.success(
        `${
          type === "P1"
            ? "P1 ILA"
            : "P2 ILA"
        } completed successfully.`,
      );

      /*
       * Refresh:
       *
       * Pending -> Complete
       */
      await loadIlaStatus();
    } catch (error: any) {
      console.error(
        `${type} ILA upload failed:`,
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          `Failed to complete ${
            type === "P1"
              ? "P1 ILA"
              : "P2 ILA"
          }.`,
        ),
      );
    } finally {
      setIlaUploadingType(null);
    }
  };

  /* ======================================================================== */
  /* NOTES                                                                     */
  /* ======================================================================== */

  const saveNote = async () => {
    if (!caseId) {
      toast.error("Case ID is missing.");
      return;
    }

    const trimmedNote =
      newNote.trim();

    if (!trimmedNote) {
      toast.error("Please enter a note.");
      return;
    }

    setSavingNote(true);

    try {
      await Axios.post(
        `/lawyer/${caseId}/notes`,
        {
          note: trimmedNote,
          text: trimmedNote,
        },
      );

      toast.success("Note added.");

      setNewNote("");

      await loadNotes();
    } catch (error: any) {
      console.error(
        "Failed to save note:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to save note.",
        ),
      );
    } finally {
      setSavingNote(false);
    }
  };

  /* ======================================================================== */
  /* LOADING                                                                   */
  /* ======================================================================== */

  if (initialLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading case workflow...
        </div>
      </div>
    );
  }

  if (!caseId) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Case ID is missing.
      </div>
    );
  }

  /* ======================================================================== */
  /* RENDER                                                                    */
  /* ======================================================================== */

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ================================================================== */}
        {/* HEADER                                                             */}
        {/* ================================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-slate-700" />

                <h1 className="text-2xl font-bold text-slate-900">
                  Lawyer Case Workflow
                </h1>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Case ID:{" "}
                <span className="font-medium text-slate-700">
                  {caseId}
                </span>
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                stage2Unlocked
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {stage2Unlocked ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}

              {stage2Unlocked
                ? "Stage 2 Unlocked"
                : "Stage 2 Locked"}
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* CLIENT CONFIRMATIONS                                               */}
        {/* ================================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Client Confirmations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Both client confirmations are required
              before Stage 2 can be unlocked.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ConfirmationCard
              persona="L1"
              complete={p1Confirmed}
              confirmedAt={p1ConfirmedAt}
              uploading={
                confirmationUploadingPersona ===
                "L1"
              }
              onSubmit={
                uploadConfirmation
              }
            />

            <ConfirmationCard
              persona="L2"
              complete={p2Confirmed}
              confirmedAt={p2ConfirmedAt}
              uploading={
                confirmationUploadingPersona ===
                "L2"
              }
              onSubmit={
                uploadConfirmation
              }
            />
          </div>
        </section>

        {/* ================================================================== */}
        {/* STAGE 2 — ILA                                                      */}
        {/* ================================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                stage2Unlocked
                  ? "bg-slate-100 text-slate-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {stage2Unlocked ? (
                <FileCheck2 className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Stage 2 — ILA
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Independent Legal Advice
              </p>
            </div>
          </div>

          {!stage2Unlocked ? (
            <div className="mt-5 rounded-xl bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-slate-400" />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Stage 2 is locked
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Complete both P1 and P2 client
                    confirmations to access ILA.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {/* ========================================================== */}
              {/* P1 ILA                                                       */}
              {/* ========================================================== */}

              <ILACard
                type="P1"
                complete={
                  p1ILACompleted
                }
                completedAt={
                  p1ILACompletedAt
                }
                uploading={
                  ilaUploadingType ===
                  "P1"
                }
                onSubmit={
                  uploadILA
                }
              />

              {/* ========================================================== */}
              {/* P2 ILA                                                       */}
              {/* ========================================================== */}

              <ILACard
                type="P2"
                complete={
                  p2ILACompleted
                }
                completedAt={
                  p2ILACompletedAt
                }
                uploading={
                  ilaUploadingType ===
                  "P2"
                }
                onSubmit={
                  uploadILA
                }
              />

              {/* ========================================================== */}
              {/* ILA SUMMARY                                                  */}
              {/* ========================================================== */}

              <div
                className={`rounded-xl p-4 ${
                  allILACompleted
                    ? "bg-emerald-50"
                    : "bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {allILACompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Clock3 className="h-5 w-5 text-slate-500" />
                  )}

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        allILACompleted
                          ? "text-emerald-800"
                          : "text-slate-800"
                      }`}
                    >
                      {allILACompleted
                        ? "All ILA requirements are complete"
                        : "ILA requirements are still pending"}
                    </p>

                    <p
                      className={`mt-1 text-sm ${
                        allILACompleted
                          ? "text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      Both P1 and P2 ILA must be
                      completed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ================================================================== */}
        {/* NOTES                                                               */}
        {/* ================================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-slate-700" />

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Notes
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add internal notes for this case.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <textarea
              value={newNote}
              onChange={(event) =>
                setNewNote(
                  event.target.value,
                )
              }
              rows={4}
              placeholder="Write a note..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={saveNote}
                disabled={
                  savingNote ||
                  !newNote.trim()
                }
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingNote && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {savingNote
                  ? "Saving..."
                  : "Add Note"}
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {notes.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-5 text-center">
                <p className="text-sm text-slate-500">
                  No notes have been added yet.
                </p>
              </div>
            ) : (
              notes.map(
                (item, index) => {
                  const noteText =
                    item.note ??
                    item.text ??
                    "";

                  return (
                    <div
                      key={
                        item._id ??
                        item.id ??
                        `note-${index}`
                      }
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <p className="whitespace-pre-wrap text-sm text-slate-700">
                        {noteText}
                      </p>

                      {item.createdAt && (
                        <p className="mt-2 text-xs text-slate-400">
                          {formatDate(
                            item.createdAt,
                          )}
                        </p>
                      )}
                    </div>
                  );
                },
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

