"use client";

import { useState } from "react";
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
  /* --- Assets state --- */
  const [incomeSeparate, setIncomeSeparate] = useState(false);
  const [incomes, setIncomes] = useState<
    { type: string; source: string; amount: string }[]
  >([]);

  const [propertySeparate, setPropertySeparate] = useState(false);
  const [properties, setProperties] = useState<
    {
      address1: string;
      address2: string;
      city: string;
      postcode: string;
      estimatedValue: string;
      outstandingMortgage: string;
      earlyRepaymentCharge: string;
      ownershipStatus: "sole" | "joint" | "";
      coOwnerDetails: string;
    }[]
  >([]);

  const [savingsSeparate, setSavingsSeparate] = useState(false);
  const [savings, setSavings] = useState<
    { institution: string; amount: string }[]
  >([]);

  const [pensionsSeparate, setPensionsSeparate] = useState(false);
  const [pensions, setPensions] = useState<
    { provider: string; scheme: string; estimatedValue: string }[]
  >([]);

  const [liabilitiesSeparate, setLiabilitiesSeparate] = useState(false);
  const [liabilities, setLiabilities] = useState<
    { lender: string; type: string; balance: string }[]
  >([]);

  const [businessSeparate, setBusinessSeparate] = useState(false);
  const [businesses, setBusinesses] = useState<
    {
      name: string;
      nature: string;
      estimatedValue: string;
      ownershipPercent: string;
      ownershipValue: string;
      turnover: string;
      profit: string;
      employees: string;
      valuationBasis: string;
    }[]
  >([]);

  const [itemsSeparate, setItemsSeparate] = useState(false);
  const [items, setItems] = useState<{ description: string; value: string }[]>(
    [],
  );

  const [otherSeparate, setOtherSeparate] = useState(false);
  const [others, setOthers] = useState<
    { description: string; value: string }[]
  >([]);

  /* --- generic add/remove helpers --- */
  const addIncome = () =>
    setIncomes((s) => [...s, { type: "", source: "", amount: "" }]);
  const removeIncome = (i: number) =>
    setIncomes((s) => s.filter((_, idx) => idx !== i));

  const addProperty = () =>
    setProperties((s) => [
      ...s,
      {
        address1: "",
        address2: "",
        city: "",
        postcode: "",
        estimatedValue: "",
        outstandingMortgage: "",
        earlyRepaymentCharge: "",
        ownershipStatus: "",
        coOwnerDetails: "",
      },
    ]);
  const removeProperty = (i: number) =>
    setProperties((s) => s.filter((_, idx) => idx !== i));

  const addSaving = () =>
    setSavings((s) => [...s, { institution: "", amount: "" }]);
  const removeSaving = (i: number) =>
    setSavings((s) => s.filter((_, idx) => idx !== i));

  const addPension = () =>
    setPensions((s) => [
      ...s,
      { provider: "", scheme: "", estimatedValue: "" },
    ]);
  const removePension = (i: number) =>
    setPensions((s) => s.filter((_, idx) => idx !== i));

  const addLiability = () =>
    setLiabilities((s) => [...s, { lender: "", type: "", balance: "" }]);
  const removeLiability = (i: number) =>
    setLiabilities((s) => s.filter((_, idx) => idx !== i));

  const addBusiness = () =>
    setBusinesses((s) => [
      ...s,
      {
        name: "",
        nature: "",
        estimatedValue: "",
        ownershipPercent: "",
        ownershipValue: "",
        turnover: "",
        profit: "",
        employees: "",
        valuationBasis: "",
      },
    ]);
  const removeBusiness = (i: number) =>
    setBusinesses((s) => s.filter((_, idx) => idx !== i));

  const addItem = () => setItems((s) => [...s, { description: "", value: "" }]);
  const removeItem = (i: number) =>
    setItems((s) => s.filter((_, idx) => idx !== i));

  const addOther = () =>
    setOthers((s) => [...s, { description: "", value: "" }]);
  const removeOther = (i: number) =>
    setOthers((s) => s.filter((_, idx) => idx !== i));

  return (
    <div className="max-w-4xl pl-10 py-10 space-y-6">
      <div className="w-full pb-5">
        <h1 className="text-3xl font-semibold text-text-color">
          Step 2 — Your Assets (Seprate Property)
        </h1>
      </div>

      {/* keep first child open by default by setting defaultValue and not using collapsible */}
      <Accordion
        type="single"
        defaultValue="income"
        collapsible
        className="space-y-4"
      >
        <AccordionItem value="income">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsCashCoin size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">
                Income & Earnings
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Separate income intended to remain the individual’s own (e.g.
                  salary, bonuses, dividends, freelance income).
                </p>

                <div className="flex items-center gap-4">
                  <Label>Separate income?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Type of income" />
                  <Input placeholder="Source / Description" />
                  <Input placeholder="Amount (GBP)" />
                </div>

                <Button variant="outline">+ Add income</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="property">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <FaMap size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">
                Property Interests
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Property owned individually?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Property address line 1" />
                  <Input placeholder="Property address line 2" />
                  <Input placeholder="Town / City" />
                  <Input placeholder="Postcode" />
                </div>

                <Input placeholder="Estimated current value (GBP)" />
                <Input placeholder="Outstanding mortgage / secured lending" />
                <Input placeholder="Early repayment charge (if applicable)" />

                <Input placeholder="Ownership status (Sole / Joint)" />
                <Input placeholder="Co-owner details (if joint)" />

                <Button variant="outline">+ Add property</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="savings">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <LuLanguages size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">
                Savings & Cash Holdings
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Separate savings?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Input placeholder="Financial institution" />
                <Input placeholder="Amount (GBP)" />

                <Button variant="outline">+ Add savings</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pension">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <FaHandsHoldingChild size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">
                Pension Arrangements
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Separate pensions?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Input placeholder="Pension provider" />
                <Input placeholder="Scheme or plan name" />
                <Input placeholder="Estimated pension value (GBP)" />

                <Button variant="outline">+ Add pension</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="liabilities">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsHouseFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">
                Liabilities & Debts
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Personal debts?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Input placeholder="Lender" />
                <Input placeholder="Type of debt" />
                <Input placeholder="Outstanding balance (GBP)" />

                <Button variant="outline">+ Add liability</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="business">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsCashCoin size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">
                Business Interests
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Input placeholder="Business name" />
                <Input placeholder="Nature of business" />
                <Input placeholder="Estimated business value (GBP)" />
                <Input placeholder="Ownership interest (%)" />
                <Input placeholder="Estimated value of ownership interest (GBP)" />
                <Input placeholder="Annual turnover (GBP)" />
                <Input placeholder="Annual profit (GBP)" />
                <Input placeholder="Number of employees" />
                <Input placeholder="Valuation basis" />

                <Button variant="outline">+ Add business</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="items">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <PiFilesFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">
                Personal Items & Valuables
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Any personal valuables?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Input placeholder="Item description" />
                <Input placeholder="Estimated value (GBP)" />

                <Button variant="outline">+ Add item</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="other-assets">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <MdLiving size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">Other Assets</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Other separate assets?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Input placeholder="Description" />
                <Input placeholder="Estimated value (GBP)" />

                <Button variant="outline">+ Add asset</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end">
        <div className="flex items-center justify-center gap-5">
          <Button className="p-7 text-base font-medium hover:bg-gray-200 bg-gray-200 cursor-pointer text-text-color">
            Back
          </Button>
          <Button className="p-7 text-base font-medium hover:bg-primary-foreground cursor-pointer bg-primary-foreground text-text-color">
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
