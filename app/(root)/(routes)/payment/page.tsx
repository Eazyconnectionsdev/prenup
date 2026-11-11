"use client";

// The payment screen for the service chosen in the service selector.
//
// The selector sends the client here with ?service=<agreementType> as soon as
// the selection is saved. Everything shown on the left — the service, its
// description and the price — comes from the server (GET /cases/:id/payment),
// so the amount on screen is the amount that gets charged and recorded; the
// query string only says which service to price.
//
// Paying is a dummy transaction: POST /cases/:id/pay validates the card
// fields, writes the service and the payment onto the case, and takes it out
// of NOT_PAID. No provider is involved, hence the "Test mode" badge.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { AppDispatch, RootState } from "@/store/store";
import {
  getCasePayment,
  getCasesDetails,
  payCase,
  type CasePaymentInfo,
} from "@/store/asyncThunk/casesThunk";
import { getFreshProfile } from "@/store/asyncThunk/authThunk";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { SERVICE_SELECTOR_HREF } from "@/components/ServiceStatus";

type PaymentFormData = {
  // null until the field is touched, so the account's own address can stand in
  // as the default without an effect writing it into state
  email: string | null;
  cardNumber: string;
  expiry: string;
  cvc: string;
  nameOnCard: string;
  country: string;
  postalCode: string;
};

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Ireland",
  "United Arab Emirates",
  "Pakistan",
];

const BACK_HREF = "/dashboard";

const formatCard = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const single =
  "w-full rounded-md bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm ring-1 ring-slate-300 transition placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#635bff] disabled:bg-slate-50 disabled:text-slate-400";
const grouped =
  "w-full bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none disabled:text-slate-400";
const group =
  "overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-300 transition focus-within:ring-2 focus-within:ring-[#635bff]";

function BackArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5l-5 5 5 5" />
    </svg>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-200/60">
        {children}
      </div>
    </main>
  );
}

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const cases = useSelector((state: RootState) => state.cases);
  const caseId: string | undefined = cases.caseId || user?.inviteCaseId;

  // Which service to price. Read off the address bar rather than with
  // useSearchParams, which would need a Suspense boundary around the page.
  const [service, setService] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setService(q.get("service"));
  }, []);

  const [info, setInfo] = useState<CasePaymentInfo | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  const [data, setData] = useState<PaymentFormData>({
    email: null,
    cardNumber: "",
    expiry: "",
    cvc: "",
    nameOnCard: "",
    country: "United Kingdom",
    postalCode: "",
  });

  // The account's own email is the sensible default for the receipt, until the
  // field is typed in.
  const email = data.email ?? user?.email ?? "";

  const load = useCallback(async () => {
    // `undefined` means the address bar has not been read yet, so the service
    // is still unknown; `null` means there was no ?service= on the URL.
    if (service === undefined) return;
    if (!caseId) {
      setLoadError(
        "We could not find your case. Choose your service to get started.",
      );
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await dispatch(
        getCasePayment({ caseId, service }),
      ).unwrap();
      setInfo(result);
      setLoadError(null);
    } catch (error) {
      setLoadError(
        getErrorMessage(error, "We could not load your payment details."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, caseId, service]);

  useEffect(() => {
    load();
  }, [load]);

  const price = info?.display ?? "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!caseId || !info?.payable || isPaying) return;

    setIsPaying(true);
    try {
      const result = await dispatch(
        payCase({
          caseId,
          // The service the screen priced, so what is charged and what is
          // saved cannot drift apart.
          agreementType: info.agreementType,
          ...data,
          email,
        }),
      ).unwrap();

      // Keep the dashboard honest about the payment straight away.
      await Promise.allSettled([
        dispatch(getCasesDetails(caseId)),
        dispatch(getFreshProfile()),
      ]);

      toast.success(
        `Payment of ${result.display} received for ${result.serviceName}.`,
      );
      router.replace(BACK_HREF);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "The payment could not be completed. Please try again."),
      );
      setIsPaying(false);
    }
  }

  // ------------------------------------------------------------- loading
  if (isLoading || service === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading your payment details...
      </main>
    );
  }

  // --------------------------------------------------------- could not load
  if (loadError || !info) {
    return (
      <Centered>
        <h1 className="text-lg font-semibold text-slate-900">
          We could not load this payment
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {loadError ?? "Please try again."}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={load}
            className="h-11 rounded-md bg-[#635bff] text-sm font-semibold text-white transition hover:brightness-110"
          >
            Try again
          </button>
          <Link
            href={SERVICE_SELECTOR_HREF}
            className="h-11 rounded-md border border-slate-200 text-sm font-semibold leading-[2.75rem] text-slate-700 transition hover:bg-slate-50"
          >
            Choose your service
          </Link>
        </div>
      </Centered>
    );
  }

  // ------------------------------------------------------------ already paid
  if (info.paid) {
    return (
      <Centered>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-6 w-6"
          >
            <path
              d="m5 10.5 3.2 3L15 6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h1 className="mt-4 text-lg font-semibold text-slate-900">
          This case has already been paid for
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {info.serviceName ?? "Your service"}
          {info.payment?.display ? ` — ${info.payment.display}` : ""}
        </p>
        {info.payment?.reference && (
          <p className="mt-1 text-xs text-slate-400">
            Receipt {info.payment.reference}
            {info.payment.cardLast4
              ? ` · ${info.payment.cardBrand ?? "Card"} ending ${info.payment.cardLast4}`
              : ""}
          </p>
        )}
        <Link
          href={BACK_HREF}
          className="mt-6 block h-11 rounded-md bg-[#635bff] text-sm font-semibold leading-[2.75rem] text-white transition hover:brightness-110"
        >
          Go to your dashboard
        </Link>
      </Centered>
    );
  }

  // ------------------------------------------------------- no service chosen
  if (!info.payable) {
    return (
      <Centered>
        <h1 className="text-lg font-semibold text-slate-900">
          Choose your service first
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          We price your agreement from the service you pick, so there is nothing
          to pay for yet.
        </p>
        <Link
          href={SERVICE_SELECTOR_HREF}
          className="mt-6 block h-11 rounded-md bg-[#635bff] text-sm font-semibold leading-[2.75rem] text-white transition hover:brightness-110"
        >
          Choose your service
        </Link>
      </Centered>
    );
  }

  // ------------------------------------------------------------- pay for it
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* ------------------------------------------------------------ left: order */}
      <section className="bg-gradient-to-br from-[#0a2540] via-[#1b2160] to-[#635bff] px-6 py-8 text-white sm:px-10 lg:px-16 lg:py-14">
        <div className="mx-auto max-w-md lg:ml-auto lg:mr-10">
          <div className="flex items-center justify-between">
            <Link
              href={BACK_HREF}
              className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
            >
              <BackArrow />
              LetsPrenup
            </Link>
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-950">
              Test mode
            </span>
          </div>

          <p className="mt-10 text-sm text-white/70">Pay LetsPrenup</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight">{price}</p>

          <div className="mt-8 rounded-xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{info.serviceName}</p>
                <p className="mt-1 text-sm text-white/70">
                  {info.serviceDescription}
                </p>
              </div>
              <p className="shrink-0 font-medium">{price}</p>
            </div>
          </div>

          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between text-white/75">
              <dt>Subtotal</dt>
              <dd>{price}</dd>
            </div>
            <div className="flex justify-between border-t border-white/15 pt-3 text-base font-semibold">
              <dt>Total due today</dt>
              <dd>{price}</dd>
            </div>
          </dl>

          {info.caseNumber && (
            <p className="mt-6 text-xs text-white/50">
              Case {info.caseNumber}
            </p>
          )}

          <Link
            href={SERVICE_SELECTOR_HREF}
            className="mt-2 inline-block text-xs text-white/60 underline decoration-white/30 underline-offset-2 transition hover:text-white"
          >
            Change service
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- right: form */}
      <section className="px-6 py-8 sm:px-10 lg:px-16 lg:py-14">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md space-y-6 lg:ml-10 lg:mr-auto"
        >
          <h1 className="text-xl font-semibold text-slate-900">Pay with card</h1>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </span>
            <input
              type="email"
              required
              disabled={isPaying}
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setData((d) => ({ ...d, email: e.target.value }))
              }
              className={single}
            />
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Card information
            </span>
            <div className={group}>
              <input
                required
                disabled={isPaying}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 1234 1234 1234"
                aria-label="Card number"
                value={data.cardNumber}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    cardNumber: formatCard(e.target.value),
                  }))
                }
                className={grouped}
              />
              <div className="grid grid-cols-2 border-t border-slate-200">
                <input
                  required
                  disabled={isPaying}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  aria-label="Expiry date"
                  value={data.expiry}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      expiry: formatExpiry(e.target.value),
                    }))
                  }
                  className={`${grouped} border-r border-slate-200`}
                />
                <input
                  required
                  disabled={isPaying}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="CVC"
                  aria-label="CVC"
                  value={data.cvc}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                    }))
                  }
                  className={grouped}
                />
              </div>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              No card is charged. Use any test card number, such as 4242 4242
              4242 4242.
            </p>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Name on card
            </span>
            <input
              required
              disabled={isPaying}
              autoComplete="cc-name"
              placeholder="Full name on card"
              value={data.nameOnCard}
              onChange={(e) =>
                setData((d) => ({ ...d, nameOnCard: e.target.value }))
              }
              className={single}
            />
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Billing address
            </span>
            <div className={group}>
              <select
                aria-label="Country"
                disabled={isPaying}
                autoComplete="country-name"
                value={data.country}
                onChange={(e) =>
                  setData((d) => ({ ...d, country: e.target.value }))
                }
                className={grouped}
              >
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                required
                disabled={isPaying}
                autoComplete="postal-code"
                placeholder="Postal code"
                aria-label="Postal code"
                value={data.postalCode}
                onChange={(e) =>
                  setData((d) => ({ ...d, postalCode: e.target.value }))
                }
                className={`${grouped} border-t border-slate-200`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPaying}
            className="h-11 w-full rounded-md bg-[#635bff] text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isPaying ? "Processing..." : `Pay ${price}`}
          </button>
        </form>
      </section>
    </main>
  );
}
