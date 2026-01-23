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

import { BsCashCoin } from "react-icons/bs";
import { PiFilesFill } from "react-icons/pi";
import { MdLiving } from "react-icons/md";
import { FaHandsHoldingChild } from "react-icons/fa6";
import { TbCirclesRelation } from "react-icons/tb";

export default function StepSixFutureAssets() {
  return (
    <div className="max-w-4xl pl-10 py-10 space-y-6">
      <div className="w-full pb-5">
        <h1 className="text-3xl font-semibold text-text-color">Step 6 — FUTURE ASSETS</h1>
        <p className="text-sm text-muted-foreground mt-2">
          This section records how the parties intend to treat certain assets or liabilities that may arise in the future.
        </p>
      </div>

      {/* keep first child open by default */}
      <Accordion type="single" defaultValue="future-inheritances" className="space-y-4">
        {/* 1. Future Inheritances */}
        <AccordionItem value="future-inheritances">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsCashCoin size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">1. Future Inheritances</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  If either party receives an inheritance in the future, how do the parties intend that inheritance to be treated?
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Checkbox /><span>Separate — as the separate property of the inheriting party</span></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Checkbox /><span>Joint — as a joint asset to be shared between the parties</span></div>
                </div>

                <Label className="mt-2">Notes / additional details (optional)</Label>
                <Textarea placeholder="If you want to record any particular approach to future inheritances, write it here." />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Future Gifts */}
        <AccordionItem value="future-gifts">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <PiFilesFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">2. Future Gifts</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  If either party receives a gift in the future, how do the parties intend that gift to be treated?
                </p>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><Checkbox /><span>Separate — as the separate property of the receiving party</span></div>
                  <div className="flex items-center gap-2"><Checkbox /><span>Joint — as a joint asset shared between the parties</span></div>
                </div>

                <Label className="mt-2">Notes / examples</Label>
                <Textarea placeholder="E.g. gifts from family, wedding presents, etc. — add guidance or exceptions here." />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Future Assets or Debts Acquired Individually */}
        <AccordionItem value="future-individual">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <MdLiving size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">3. Future Assets or Debts Acquired Individually</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Do the parties wish any future assets or liabilities acquired in either party’s sole name to be treated as:
                </p>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><Checkbox /><span>Separate — separate property of the acquiring party</span></div>
                  <div className="flex items-center gap-2"><Checkbox /><span>Joint — joint property or liability shared between the parties</span></div>
                </div>

                <Label className="mt-2">Notes / examples</Label>
                <Textarea placeholder="Clarify types of future assets or liabilities and any exceptions." />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 4. Expectations Regarding Wills & Estate Planning */}
        <AccordionItem value="wills-estate">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <TbCirclesRelation size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">4. Expectations Regarding Wills & Estate Planning</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  This agreement governs financial arrangements on separation or divorce, not death. Separate estate planning (wills) is recommended.
                </p>

                <div className="flex items-center gap-4">
                  <Label>Do the parties expect the arrangements on death to broadly reflect this agreement?</Label>
                  <div className="flex items-center gap-2"><Checkbox /><span>Yes</span></div>
                  <div className="flex items-center gap-2"><Checkbox /><span>No</span></div>
                </div>

                <Label className="mt-2">Notes</Label>
                <Textarea placeholder="Any expectations about wills, executors, or estate planning you want recorded." />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 5. Optional Will & Estate Planning Support */}
        <AccordionItem value="wills-support">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <FaHandsHoldingChild size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">5. Optional Will & Estate Planning Support (LetsPrenupWills)</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Would you like help preparing a will through LetsPrenupWills?
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Checkbox /><span>Yes</span></div>
                  <div className="flex items-center gap-2"><Checkbox /><span>No</span></div>
                </div>

                <Label className="mt-2">If yes — notes</Label>
                <Textarea placeholder="Any details to help with will preparation (preferred executors, special bequests, etc.)" />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 6. Anticipated Future Inheritance — Party A */}
        <AccordionItem value="anticipated-a">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsCashCoin size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">6. Anticipated Future Inheritance — Party A</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Label>Party A (name)</Label>
                <Input placeholder="Party A name (e.g. Party A / full name)" />

                <Label className="mt-2">Approximate value and composition of anticipated inheritance (GBP)</Label>
                <Textarea placeholder="All figures in pounds sterling. If converted from another currency, include conversion details." />

                <Label className="mt-2">Basis of estimate</Label>
                <Textarea placeholder="E.g. family expectation, previous estate planning discussions, informal indication." />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 6b. Anticipated Future Inheritance — Party B */}
        <AccordionItem value="anticipated-b">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsCashCoin size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">6. Anticipated Future Inheritance — Party B</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Label>Party B (name)</Label>
                <Input placeholder="Party B name (e.g. Party B / full name)" />

                <Label className="mt-2">Approximate value and composition of anticipated inheritance (GBP)</Label>
                <Textarea placeholder="All figures in pounds sterling. If converted from another currency, include conversion details." />

                <Label className="mt-2">Basis of estimate</Label>
                <Textarea placeholder="E.g. family expectation, previous estate planning discussions, informal indication." />
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
