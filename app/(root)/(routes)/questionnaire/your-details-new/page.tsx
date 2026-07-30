"use client";

import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { BsHouseFill } from "react-icons/bs";
import { FaMap } from "react-icons/fa";
import { TbCirclesRelation } from "react-icons/tb";
import { FaHandsHoldingChild } from "react-icons/fa6";
import { LuLanguages } from "react-icons/lu";
import { BsCashCoin } from "react-icons/bs";
import { PiFilesFill } from "react-icons/pi";
import { MdLiving } from "react-icons/md";

export default function StepOnePersonalProfile() {

  type Child = {
  firstName: string;
  familyName: string;
  dob: string;
};

type FormValues = {
  givenName: string;
  middleNames: string;
  familyName: string;
  dob: string;

  address1: string;
  address2: string;
  city: string;
  postcode: string;
  country: string;
  sameAsOtherParty: boolean | null;

  dateOfMarriage: string;

  hasChildren: boolean;
  children: Child[];
  childCareNote: string;

  comfortableEnglish: boolean | null;
  nationality: string;
  domicile: string;

  occupation: string;
  annualIncome: string;

  objectives: string;
  livingArrangements: string;

  platformAcknowledged: boolean;

  preferences: {
    personalBelongings: boolean;
    householdContents: boolean;
    childrensNeeds: boolean;
    costs: boolean;
  };
};

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      givenName: "",
      middleNames: "",
      familyName: "",
      dob: "",
      address1: "",
      address2: "",
      city: "",
      postcode: "",
      country: "",
      sameAsOtherParty: null,
      dateOfMarriage: "",
      hasChildren: false,
      children: [],
      childCareNote: "",
      comfortableEnglish: null,
      nationality: "",
      domicile: "",
      occupation: "",
      annualIncome: "",
      objectives: "",
      livingArrangements: "",
      platformAcknowledged: false,
      preferences: {
        personalBelongings: false,
        householdContents: false,
        childrensNeeds: false,
        costs: false,
      },
    },
  });

  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: "children",
  });

  const onSubmit = (data : any) => {
    // do something with the form data: call API or route to next step
    console.log("Form submitted:", data);
    alert("Form submitted (check console).");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl pl-10 py-10 space-y-6">
      <div className="w-full pb-5">
        <h1 className="text-3xl font-semibold text-text-color">
          Step 1 — Personal Profile
        </h1>
      </div>

      <Accordion type="single" defaultValue="identity" collapsible className="space-y-4">
        {/* 1. Identity Details */}
        <AccordionItem value="identity">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsHouseFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">Identity Details</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Given Name"
                    {...register("givenName", { required: "Given name is required" })}
                  />
                  {errors.givenName && <p className="text-red-500 text-sm mt-1">{errors.givenName.message}</p>}
                </div>

                <div>
                  <Input placeholder="Middle Names" {...register("middleNames")} />
                  {errors.middleNames && <p className="text-red-500 text-sm mt-1">{errors.middleNames.message}</p>}
                </div>

                <div>
                  <Input
                    placeholder="Family Name"
                    {...register("familyName", { required: "Family name is required" })}
                  />
                  {errors.familyName && <p className="text-red-500 text-sm mt-1">{errors.familyName.message}</p>}
                </div>

                <div>
                  <Input
                    type="date"
                    placeholder="Date of Birth"
                    {...register("dob", { required: "Date of birth is required" })}
                  />
                  {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Address Information */}
        <AccordionItem value="address">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <FaMap size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">Address Information</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Input
                    placeholder="Address Line 1"
                    {...register("address1", { required: "Address line 1 is required" })}
                  />
                  {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1.message}</p>}
                </div>

                <Input placeholder="Address Line 2 (optional)" {...register("address2")} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input placeholder="Town / City" {...register("city", { required: "City is required" })} />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <Input placeholder="Postcode" {...register("postcode", { required: "Postcode is required" })} />
                    {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode.message}</p>}
                  </div>
                  <div>
                    <Input placeholder="Country" {...register("country", { required: "Country is required" })} />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label>Same as other party’s address?</Label>
                  <Controller
                    control={control}
                    name="sameAsOtherParty"
                    render={({ field }) => (
                      // we use two checkboxes as in original UI; but keep single boolean by toggling
                      <>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value === true}
                            onCheckedChange={(v) => field.onChange(v === true)}
                          />
                          <span>Yes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value === false}
                            onCheckedChange={(v) => field.onChange(v === true ? false : null)}
                          />
                          <span>No</span>
                        </div>
                      </>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Relationship Information */}
        <AccordionItem value="relationship">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <TbCirclesRelation size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">Relationship Information</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6">
                <Input type="date" placeholder="Date of Marriage" {...register("dateOfMarriage")} />
                {errors.dateOfMarriage && <p className="text-red-500 text-sm mt-1">{errors.dateOfMarriage.message}</p>}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 4. Children & Dependants */}
        <AccordionItem value="children">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <FaHandsHoldingChild size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">Children & Dependants</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Any children?</Label>
                  <Controller
                    control={control}
                    name="hasChildren"
                    render={({ field }) => (
                      <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(!!v)} />
                    )}
                  />
                </div>

                {/* children list */}
                {fields.length > 0 && (
                  <div className="space-y-2">
                    {fields.map((child, idx) => (
                      <div key={child.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <Input
                            placeholder="Child First Name"
                            {...register(`children.${idx}.firstName`, { required: "First name required" })}
                          />
                          {errors.children?.[idx]?.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.children[idx].firstName.message}</p>
                          )}
                        </div>

                        <div>
                          <Input
                            placeholder="Child Family Name"
                            {...register(`children.${idx}.familyName`, { required: "Family name required" })}
                          />
                          {errors.children?.[idx]?.familyName && (
                            <p className="text-red-500 text-sm mt-1">{errors.children[idx].familyName.message}</p>
                          )}
                        </div>

                        <div>
                          <Input
                            type="date"
                            placeholder="Date of Birth"
                            {...register(`children.${idx}.dob`, { required: "DOB required" })}
                          />
                          {errors.children?.[idx]?.dob && (
                            <p className="text-red-500 text-sm mt-1">{errors.children[idx].dob.message}</p>
                          )}
                        </div>

                        <div className="col-span-full flex gap-2">
                          <Button type="button" onClick={() => remove(idx)}>
                            Remove child
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Textarea placeholder="Care, contact, and financial arrangements" {...register("childCareNote")} />

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ firstName: "", familyName: "", dob: "" })}
                  >
                    + Add another child
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 5. Language & Background */}
        <AccordionItem value="language">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <LuLanguages size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">Language & Background</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Comfortable with English legal documents?</Label>
                  <Controller
                    control={control}
                    name="comfortableEnglish"
                    render={({ field }) => (
                      <>
                        <div className="flex items-center gap-2">
                          <Checkbox checked={field.value === true} onCheckedChange={(v) => field.onChange(v === true)} />
                          <span>Yes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox checked={field.value === false} onCheckedChange={(v) => field.onChange(v === true ? false : null)} />
                          <span>No</span>
                        </div>
                      </>
                    )}
                  />
                </div>

                <Input placeholder="Nationality" {...register("nationality")} />
                <Input placeholder="Country of domicile and residence" {...register("domicile")} />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 6. Employment & Earnings */}
        <AccordionItem value="employment">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsCashCoin size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">Employment & Earnings</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Input placeholder="Current Occupation" {...register("occupation")} />
                <div>
                  <Input
                    placeholder="Approximate Annual Income (GBP)"
                    {...register("annualIncome", {
                      pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Enter a valid number" },
                    })}
                  />
                  {errors.annualIncome && <p className="text-red-500 text-sm mt-1">{errors.annualIncome.message}</p>}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 7. Purpose */}
        <AccordionItem value="purpose">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <PiFilesFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">Purpose of This Agreement</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6">
                <Textarea placeholder="Objectives written in third-person language" {...register("objectives")} />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 8. Living Arrangements */}
        <AccordionItem value="living">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <MdLiving size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">Living Arrangements & Forward Planning</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6">
                <Textarea placeholder="Current living arrangements and future plans" {...register("livingArrangements")} />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 9. Platform Acknowledgement */}
        <AccordionItem value="platform">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsHouseFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">Platform & Legal Acknowledgements</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 flex items-start gap-2">
                <Controller
                  control={control}
                  name="platformAcknowledged"
                  render={({ field }) => <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(!!v)} />}
                />
                <p className="text-sm">
                  The parties acknowledge LetsPrenup is a technology platform and not a provider of legal advice.
                </p>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 10. General Preferences */}
        <AccordionItem value="preferences">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsHouseFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">General Preferences</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Controller control={control} name="preferences.personalBelongings" render={({ field }) => <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(!!v)} />} />
                  <span>Personal belongings acknowledgement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Controller control={control} name="preferences.householdContents" render={({ field }) => <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(!!v)} />} />
                  <span>Household contents acknowledgement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Controller control={control} name="preferences.childrensNeeds" render={({ field }) => <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(!!v)} />} />
                  <span>Children’s needs acknowledgement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Controller control={control} name="preferences.costs" render={({ field }) => <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(!!v)} />} />
                  <span>Costs acknowledgement</span>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end">
        <div className="flex items-center justify-center gap-5">
          <Button type="button" className="p-7 text-base font-medium hover:bg-gray-200 bg-gray-200 cursor-pointer text-text-color">
            Back
          </Button>
          <Button
            type="submit"
            className="p-7 text-base font-medium hover:bg-primary-foreground cursor-pointer bg-primary-foreground text-text-color"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
}
