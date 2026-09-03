import { Check } from "lucide-react";

export default function ComparisonTable() {
  return (
    <div className="rv mt-24 pt-16 border-t border-linen">
      <div className="max-w-2xl mb-10">
        <p className="label-sm text-rose font-semibold uppercase tracking-widest mb-3">
          Comparison
        </p>
        <h3 className="display text-[clamp(32px,4vw,48px)] text-midnight mb-4">
          How We Compare
        </h3>
        <p className="text-slate text-[17px] font-medium leading-relaxed">
          See how LetsPrenup stacks up against traditional law firms and budget providers.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-linen bg-ivory shadow-sm">
        <table className="w-full text-left text-[15px] border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-linen text-[12px] uppercase tracking-wider text-slate bg-pearl/60">
              <th className="py-5 px-6 font-semibold">Feature</th>
              <th className="py-5 px-6 font-semibold">Traditional Firms</th>
              <th className="py-5 px-6 font-semibold">Fixed Fee Providers</th>
              <th className="py-5 px-6 font-semibold bg-midnight text-white tracking-widest">
                LetsPrenup
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linen">
            <tr className="hover:bg-pearl/40 transition-colors">
              <td className="py-5 px-6 font-semibold text-midnight">Typical Cost</td>
              <td className="py-5 px-6 text-slate font-medium">£2,000 – £5,000+</td>
              <td className="py-5 px-6 text-slate font-medium">£700 – £1,500+</td>
              <td className="py-5 px-6 bg-rose-mist/60 text-rose-deep font-semibold border-l border-rose/10">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-rose stroke-[3]" />
                  £999 Fixed Fee
                </span>
              </td>
            </tr>
            <tr className="hover:bg-pearl/40 transition-colors">
              <td className="py-5 px-6 font-semibold text-midnight">Covers Both Partners</td>
              <td className="py-5 px-6 text-slate font-medium">Usually Separate Engagements</td>
              <td className="py-5 px-6 text-slate font-medium">Depends on Provider</td>
              <td className="py-5 px-6 bg-rose-mist/60 text-rose-deep font-semibold border-l border-rose/10">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-rose stroke-[3]" />
                  Included
                </span>
              </td>
            </tr>
            <tr className="hover:bg-pearl/40 transition-colors">
              <td className="py-5 px-6 font-semibold text-midnight">Independent Legal Advice</td>
              <td className="py-5 px-6 text-slate font-medium">Included</td>
              <td className="py-5 px-6 text-slate font-medium">Sometimes Included</td>
              <td className="py-5 px-6 bg-rose-mist/60 text-rose-deep font-semibold border-l border-rose/10">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-rose stroke-[3]" />
                  Included
                </span>
              </td>
            </tr>
            <tr className="hover:bg-pearl/40 transition-colors">
              <td className="py-5 px-6 font-semibold text-midnight">
                Separate Law Firms for Each Partner
              </td>
              <td className="py-5 px-6 text-slate font-medium">Not Always</td>
              <td className="py-5 px-6 text-slate font-medium">Not Always</td>
              <td className="py-5 px-6 bg-rose-mist/60 text-rose-deep font-semibold border-l border-rose/10">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-rose stroke-[3]" />
                  Always Included
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
