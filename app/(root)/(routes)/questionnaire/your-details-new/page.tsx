"use client";

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
  return (
    <div className="max-w-4xl pl-20 py-10 space-y-6">
      <h1 className="text-2xl font-semibold text-text-color">
        Step 1 — Personal Profile
      </h1>

      <Accordion type="single" collapsible className="space-y-4">
        {/* 1. Identity Details */}
        <AccordionItem value="identity">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsHouseFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">
                Identity Details
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Given Name" />
                <Input placeholder="Middle Names" />
                <Input placeholder="Family Name" />
                <Input type="date" placeholder="Date of Birth" />
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
              <p className="text-xl font-[400] text-text-color">
                Address Information
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Input placeholder="Address Line 1" />
                <Input placeholder="Address Line 2 (optional)" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Town / City" />
                  <Input placeholder="Postcode" />
                  <Input placeholder="Country" />
                </div>
                <div className="flex items-center gap-4">
                  <Label>Same as other party’s address?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
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
              <p className="text-xl font-[400] text-text-color">
                Relationship Information
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6">
                <Input type="date" placeholder="Date of Marriage" />
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
              <p className="text-xl font-[400] text-text-color">
                Children & Dependants
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Any children?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Child First Name" />
                  <Input placeholder="Child Family Name" />
                  <Input type="date" placeholder="Date of Birth" />
                </div>
                <Textarea placeholder="Care, contact, and financial arrangements" />
                <Button variant="outline">+ Add another child</Button>
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
              <p className="text-xl font-[400] text-text-color">
                Language & Background
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Comfortable with English legal documents?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>
                <Input placeholder="Nationality" />
                <Input placeholder="Country of domicile and residence" />
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
              <p className="text-xl font-[400] text-text-color">
                Employment & Earnings
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Input placeholder="Current Occupation" />
                <Input placeholder="Approximate Annual Income (GBP)" />
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
              <p className="text-xl font-[400] text-text-color">
                Purpose of This Agreement
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6">
                <Textarea placeholder="Objectives written in third-person language" />
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
              <p className="text-xl font-[400] text-text-color">
                Living Arrangements & Forward Planning
              </p>
            </div>
          </AccordionTrigger>
         
          <AccordionContent>
            <Card>
              <CardContent className="p-6">
                <Textarea placeholder="Current living arrangements and future plans" />
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
              <p className="text-xl font-[400] text-text-color">
                Platform & Legal Acknowledgements
              </p>
            </div>
          </AccordionTrigger>
          
          <AccordionContent>
            <Card>
              <CardContent className="p-6 flex items-start gap-2">
                <Checkbox />
                <p className="text-sm">
                  The parties acknowledge LetsPrenup is a technology platform
                  and not a provider of legal advice.
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
              <p className="text-xl font-[400] text-text-color">
                General Preferences
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-3">
                <Checkbox /> <span>Personal belongings acknowledgement</span>
                <Checkbox /> <span>Household contents acknowledgement</span>
                <Checkbox /> <span>Children’s needs acknowledgement</span>
                <Checkbox /> <span>Costs acknowledgement</span>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end">
        <Button>Save & Continue</Button>
      </div>
    </div>
  );
}
