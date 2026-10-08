"use client";

import Image from "next/image";
import Link from "next/link";
import Google from "@/images/icons/google.png";
import Tick from "@/images/icons/tick.svg";
import People from "@/images/people.svg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { registerUser } from "@/store/asyncThunk/authThunk";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { normalizePhone } from "@/lib/utils";
import AuthInput from "@/components/auth/AuthInput";
import AuthHeader from "@/components/auth/AuthHeader";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";
import { getErrorMessage } from "@/lib/getErrorMessage";

const Points = [
  "Get 50 free credits every month",
  "Real time email and phone verification",
  "Native integrations to popular CRMs",
];

export default function SignUpPageStatic() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      marketingConsent: false,
      acceptedTerms: false,
    },
  });

  const onInvalid = (errs: FieldErrors<RegisterFormValues>) => {
    const first = Object.values(errs)[0];
    toast.error(first?.message ?? "Please check the form and try again");
  };

  const onSubmit = async (values: RegisterFormValues) => {
    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: normalizePhone(values.phone) || undefined,
      password: values.password,
      acceptedTerms: values.acceptedTerms,
      marketingConsent: values.marketingConsent,
    };

    try {
      const result = await dispatch(registerUser(payload)).unwrap();
      if (result?.success) {
        toast.success(
          "Account created. Check your email for the verification code.",
        );
        router.push("/email-verification");
      }
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to create your account. Please try again.",
      );
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <AuthHeader />

        <main className="flex flex-1 items-center justify-center px-4 sm:px-8">
          <div className="w-full max-w-[480px]">
            <h3 className="text-[26px] sm:text-[32px] text-[#495060] font-medium text-center mb-5">
              Create your free account
            </h3>

            <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => toast.info("Google sign-in is coming soon")}
                  className="flex-1 py-3 flex items-center justify-center gap-2 font-medium border border-[#888f97] text-[#414c58] hover:bg-[#e7e9ea] text-[12px] rounded"
                >
                  <Image src={Google} height={20} width={20} alt="" />
                  Google
                </button>
              </div>

              <div className="flex items-center px-3 my-8">
                <span className="flex-1 border-b border-[#b8bcc0]"></span>
                <span className="mx-5 text-xs text-gray-500">
                  Or use your work email
                </span>
                <span className="flex-1 border-b border-[#b8bcc0]"></span>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <AuthInput
                    autoComplete="given-name"
                    placeholder="First Name"
                    error={errors.firstName}
                    {...register("firstName")}
                  />
                </div>
                <div className="w-full">
                  <AuthInput
                    autoComplete="family-name"
                    placeholder="Last Name"
                    error={errors.lastName}
                    {...register("lastName")}
                  />
                </div>
              </div>

              <div className="mt-4">
                <AuthInput
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your work email"
                  error={errors.email}
                  {...register("email")}
                />
              </div>

              <div className="mt-4">
                <AuthInput
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone (optional)"
                  error={errors.phone}
                  {...register("phone")}
                />
              </div>

              <div className="mt-4">
                <AuthInput
                  password
                  autoComplete="new-password"
                  placeholder="Password"
                  error={errors.password}
                  {...register("password")}
                />
              </div>

              <div className="mt-4">
                <AuthInput
                  password
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                  error={errors.confirmPassword}
                  {...register("confirmPassword")}
                />
              </div>

              <div className="flex flex-col my-4">
                <label className="flex items-center gap-2 text-[14px] text-[#495060]">
                  <input type="checkbox" {...register("marketingConsent")} />I
                  agree to receive occasional news and updates.
                </label>
                <label className="flex items-center text-[14px] text-[#495060] mt-3">
                  <input
                    type="checkbox"
                    className="mr-2"
                    aria-invalid={!!errors.acceptedTerms}
                    {...register("acceptedTerms")}
                  />
                  I accept the{" "}
                  <span className="text-[#6a69ff] mx-1">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-[#6a69ff] ml-1">Privacy Policy</span>.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-2 mt-4 disabled:bg-[#6a69ff]/50 bg-[#6a69ff] text-white text-[14px] rounded"
              >
                {isLoading ? <span>Please wait...</span> : "Create Account"}
              </button>

              <div className="mt-5 text-[14px] text-[#495060]">
                Already have an account?{" "}
                <Link className="text-[#6a69ff]" href="/login">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>

      <aside className="flex w-full flex-col justify-center overflow-hidden bg-[#f2f2ff] py-8 lg:sticky lg:top-0 lg:h-screen lg:w-[340px] xl:w-[500px]">
        <div className="px-6 sm:px-10 lg:px-8">
          <p className="text-[22px] xl:text-[26px] text-[#414c58] font-bold text-center leading-tight">
            Close More Deals <br /> Grow Faster
          </p>
          <p className="text-[#414766] text-[12px] my-4">
            SalesQL can enhance any LinkedIn profile with emails and phone
            numbers – even if you haven’t connected with them.
          </p>
          {Points.map((each, idx) => (
            <div className={`flex gap-3 ${idx === 1 ? "my-3" : ""}`} key={idx}>
              <Image src={Tick} width={24} height={24} alt="tick icon" />
              <span className="text-[#414766] text-[13px] font-bold">
                {each}
              </span>
            </div>
          ))}
        </div>
        <Image
          src={People}
          width={480}
          height={573}
          alt="people illustration"
          className="mx-auto mt-4 h-auto w-full max-w-[300px] lg:max-h-[38vh] lg:w-auto"
        />
      </aside>
    </div>
  );
}
