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
import { FaMap } from "react-icons/fa";
import { PiFilesFill } from "react-icons/pi";
import { MdLiving } from "react-icons/md";
import { FaHandsHoldingChild } from "react-icons/fa6";
import { TbCirclesRelation } from "react-icons/tb";

export default function StepFiveJointAssets() {
  return (
    <div className="max-w-4xl pl-10 py-10 space-y-6">
      <div className="w-full pb-5">
        <h1 className="text-3xl font-semibold text-text-color">
          Step 5 — JOINT ASSETS
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Unless stated otherwise below, any assets recorded in this section are intended to be shared equally between the parties.
          These entries reflect the parties' current intentions and are subject to review and confirmation by independent legal advisers.
        </p>
      </div>

      {/* first child open by default (not collapsible to ensure it's open) */}
      <Accordion type="single" defaultValue="joint-income" className="space-y-4">
        {/* 1. Joint Income & Earnings */}
        <AccordionItem value="joint-income">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsCashCoin size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">1. Joint Income & Earnings</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Do the parties have any income or earnings they wish to treat as shared in the event of a divorce or separation?
                </p>

                <div className="flex items-center gap-4">
                  <Label>Shared income?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select className="border rounded px-3 py-2">
                    <option>Paid to</option>
                    <option>Party A</option>
                    <option>Party B</option>
                    <option>Both parties</option>
                  </select>

                  <Input placeholder="Type of income (e.g. salary / rental / business)" />
                  <Input placeholder="Source or description (e.g. employer or property)" />
                  <Input placeholder="Approx annual amount (GBP)" />
                </div>

                <Button variant="outline">+ Add income</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Joint Living Arrangements / Property */}
        <AccordionItem value="joint-property">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <FaMap size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">2. Joint Living Arrangements / Property</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Do the parties currently live in, or intend to live in, a property that is rented or owned jointly (or in one party’s name but used as a shared home)?
                </p>

                <div className="flex items-center gap-4">
                  <Label>Shared property?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <div className="flex items-center gap-6">
                  <Label>Nature of property</Label>
                  <Checkbox /> <span>Rented</span>
                  <Checkbox /> <span>Owned</span>
                </div>

                <Input placeholder="Cohabitation period (how long parties have/will live together)" />

                {/* Owned property details (kept visible for UI — wire conditionally later) */}
                <div className="border rounded p-4">
                  <p className="text-sm font-medium">Property details (if owned)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <Input placeholder="Address Line 1" />
                    <Input placeholder="Address Line 2" />
                    <Input placeholder="Town / City" />
                    <Input placeholder="Postcode" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                    <Input placeholder="Estimated current value (GBP)" />
                    <Input placeholder="Outstanding mortgage or secured lending (GBP)" />
                    <Input placeholder="Early repayment charge (if applicable)" />
                  </div>

                  <div className="mt-3">
                    <Label>Ownership structure</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Checkbox /> <span>One party</span>
                      <Checkbox /> <span>Both parties</span>
                    </div>

                    {/* One party details */}
                    <div className="mt-3">
                      <Label>If one party — identify owner</Label>
                      <select className="border rounded px-3 py-2 mt-2">
                        <option>Which party is the legal owner?</option>
                        <option>Party A</option>
                        <option>Party B</option>
                      </select>

                      <Label className="mt-3">Intended treatment on separation</Label>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-2"><Checkbox /> <span>Keep current ownership and share future increase equally</span></div>
                        <div className="flex items-center gap-2"><Checkbox /> <span>This property should not be shared on separation</span></div>
                        <div className="flex items-center gap-2"><Checkbox /> <span>A different arrangement</span></div>
                        <Textarea placeholder="If another arrangement — please describe" />
                      </div>
                    </div>

                    {/* Both parties details */}
                    <div className="mt-4">
                      <Label>If both parties — ownership proportions</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Checkbox /> <span>Equally</span>
                        <Checkbox /> <span>Unequally</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <Input placeholder="Party A share (%)" />
                        <Input placeholder="Party B share (%)" />
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center gap-2"><Checkbox /> <span>Maintain current ownership shares, with future increase shared equally</span></div>
                        <div className="flex items-center gap-2"><Checkbox /> <span>Maintain current ownership shares, with no further sharing</span></div>
                        <div className="flex items-center gap-2"><Checkbox /> <span>A different arrangement</span></div>
                        <Textarea placeholder="If another arrangement — describe here" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline">+ Add Additional Property</Button>
                    <Button variant="ghost">Remove This Property</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Joint Savings & Cash */}
        <AccordionItem value="joint-savings">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <PiFilesFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">3. Joint Savings & Cash</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Shared savings/accounts?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input placeholder="Financial institution" />
                  <Input placeholder="Amount (GBP)" />
                </div>

                <Button variant="outline">+ Add savings</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 4. Joint Liabilities & Debts */}
        <AccordionItem value="joint-liabilities">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <TbCirclesRelation size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">4. Joint Liabilities & Debts</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Shared liabilities?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Label>Intended treatment on separation</Label>
                <Textarea placeholder="Describe how responsibility for the debt should be allocated between the parties." />

                <p className="text-sm font-medium">Debt details</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select className="border rounded px-3 py-2">
                    <option>Debtor (Party A / Party B / Both)</option>
                    <option>Party A</option>
                    <option>Party B</option>
                    <option>Both</option>
                  </select>
                  <Input placeholder="Lender or creditor" />
                  <Input placeholder="Type of liability / description" />
                  <Input placeholder="Approximate outstanding balance (GBP)" />
                </div>

                <Button variant="outline">+ Add another liability</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 5. Joint Pension Arrangements */}
        <AccordionItem value="joint-pensions">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <FaHandsHoldingChild size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">5. Joint Pension Arrangements</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Shared pensions?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Label>Intended treatment on separation</Label>
                <Textarea placeholder="Describe intended approach (e.g. equal sharing, offsetting, other)." />

                <p className="text-sm font-medium">Pension details</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select className="border rounded px-3 py-2">
                    <option>Pension holder (Party A / Party B)</option>
                    <option>Party A</option>
                    <option>Party B</option>
                  </select>
                  <Input placeholder="Pension provider or scheme name" />
                  <Input placeholder="Approx current value (GBP)" />
                </div>

                <Button variant="outline">+ Add pension</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 6. Joint Business Interests */}
        <AccordionItem value="joint-business">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <BsCashCoin size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">6. Joint Business Interests</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Shared business interests?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Label>Intended arrangement on separation</Label>
                <Textarea placeholder="Describe intended arrangement for this business on separation" />

                <p className="text-sm font-medium">Business details</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Business name" />
                  <Input placeholder="Nature of business / description" />
                  <select className="border rounded px-3 py-2">
                    <option>Which party holds the interest?</option>
                    <option>Party A</option>
                    <option>Party B</option>
                    <option>Both parties</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                  <Input placeholder="Estimated total business value (GBP)" />
                  <Input placeholder="Ownership interest (%)" />
                  <Input placeholder="Estimated value of ownership interest (GBP)" />
                  <Input placeholder="Annual turnover (GBP)" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <Input placeholder="Annual profit (GBP)" />
                  <Input placeholder="Number of employees" />
                  <Input placeholder="How was the business value determined?" />
                </div>

                <Button variant="outline">+ Add New Entry</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 7. Shared Personal Items & Valuables */}
        <AccordionItem value="joint-items">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <PiFilesFill size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">7. Shared Personal Items & Valuables</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Shared personal valuables?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Label>Intended treatment on separation</Label>
                <Textarea placeholder="Describe how these items should be divided, sold, retained, or otherwise dealt with." />

                <p className="text-sm font-medium">Details of shared personal items</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Description of item (e.g. car, artwork)" />
                  <Input placeholder="Estimated value (GBP)" />
                  <div className="flex items-center">
                    <Button variant="outline">+ Add another item</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* 8. Other Joint Assets */}
        <AccordionItem value="joint-other">
          <AccordionTrigger>
            <div className="flex items-center gap-5">
              <span className="h-11 w-11 rounded-full bg-text-color flex items-center justify-center">
                <MdLiving size={18} className="text-white" />
              </span>
              <p className="text-xl font-[400] text-text-color">8. Other Joint Assets</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Other joint assets?</Label>
                  <Checkbox /> <span>Yes</span>
                  <Checkbox /> <span>No</span>
                </div>

                <Label>Intended treatment on separation</Label>
                <Textarea placeholder="Describe how this asset should be divided or treated." />

                <p className="text-sm font-medium">Asset details</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Asset holder / Provider" />
                  <Input placeholder="Description of asset (e.g. investment, crypto)" />
                  <Input placeholder="Approx current value (GBP)" />
                </div>

                <Button variant="outline">+ Add another item</Button>
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
