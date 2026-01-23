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

import { PiFilesFill } from "react-icons/pi";
import { TbCirclesRelation } from "react-icons/tb";
import { FaHandsHoldingChild } from "react-icons/fa6";
import { MdHomeWork } from "react-icons/md";

export default function StepSevenAreasOfComplexity() {
  return (
    <div className="max-w-4xl pl-10 py-10 space-y-6">
      <div className="w-full pb-5">
        <h1 className="text-3xl font-semibold text-text-color">
          STEP 7 — AREAS OF COMPLEXITY
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          This section highlights circumstances that may require additional consideration when preparing your agreement.
          Please answer each question carefully and provide brief details where applicable.
        </p>
      </div>

      {/* first child open by default */}
      <Accordion type="single" defaultValue="pregnancy" className="space-y-4">
        {/* 1. Pregnancy */}
        <AccordionItem value="pregnancy">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <FaHandsHoldingChild size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">1. Pregnancy</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Is either party currently pregnant?
                </p>

                <div className="flex items-center gap-4">
                  <Label>Currently pregnant?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Label>If yes — brief details (optional)</Label>
                <Textarea placeholder="E.g. expected due date or relevant circumstances" />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Shared Business Involvement */}
        <AccordionItem value="shared-business">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <MdHomeWork size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">2. Shared Business Involvement</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Do one or both parties own a business in which you both work or are actively involved?
                </p>

                <div className="flex items-center gap-4">
                  <Label>Shared business involvement?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Label>If yes — provide an overview</Label>
                <Textarea placeholder="E.g. nature of the business, roles of each party" />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Employment Status & Financial Dependence */}
        <AccordionItem value="employment-dependence">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <TbCirclesRelation size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">3. Employment Status & Financial Dependence</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Is either party currently not working, on extended leave, or financially dependent on the other party?
                </p>

                <div className="flex items-center gap-4">
                  <Label>Employment / dependence?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Label>If yes — brief details</Label>
                <Textarea placeholder="E.g. reason, duration, nature of financial support" />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 4. Third-Party Ownership of Home */}
        <AccordionItem value="third-party-home">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <PiFilesFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">4. Third-Party Ownership of Home</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Is the family home owned wholly or partly by a third party outside this relationship?
                </p>

                <div className="flex items-center gap-4">
                  <Label>Third-party ownership?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Label>If yes — brief details</Label>
                <Textarea placeholder="E.g. who the third party is and how ownership is structured" />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 5. High-Value Combined Assets */}
        <AccordionItem value="high-value-assets">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <PiFilesFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">5. High-Value Combined Assets</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are the parties’ combined assets currently valued at more than £3 million?
                </p>

                <div className="flex items-center gap-4">
                  <Label>Combined value &gt; £3M?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Label>If yes — overview</Label>
                <Textarea placeholder="E.g. general nature of assets — property, investments, businesses" />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 6. Children from Current or Previous Relationships */}
        <AccordionItem value="children-previous">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <FaHandsHoldingChild size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">6. Children from Current or Previous Relationships</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Does either party have a child from a current or previous relationship who lives with you?
                </p>

                <div className="flex items-center gap-4">
                  <Label>Children from other relationships?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Label>If yes — brief details</Label>
                <Textarea placeholder="E.g. number of children, living arrangements" />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end">
        <div className="flex items-center justify-center gap-5">
          <Button className="p-7 text-base font-medium hover:bg-gray-200 bg-gray-200 cursor-pointer text-text-color">Back</Button>
          <Button className="p-7 text-base font-medium hover:bg-primary-foreground cursor-pointer bg-primary-foreground text-text-color">Save & Continue</Button>
        </div>
      </div>
    </div>
  );
}
