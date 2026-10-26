import type { Metadata } from "next";
import { PageIntro } from "@/components/shared";
import { BillExplorer } from "@/components/bill-explorer";
import { localBillProvider } from "@/lib/content";
import type { Demo } from "@/lib/schemas";
export const metadata: Metadata = { title: "Bill simplifier" };
export default async function BillsPage() {
  const bills = await localBillProvider.listBills();
  const demos = (
    await Promise.all(
      bills.map((bill) => localBillProvider.getExplanation(bill.id)),
    )
  ).filter((demo): demo is Demo => demo !== null);
  return (
    <div className="container inner-page">
      <PageIntro
        eyebrow="03 / BILL SIMPLIFIER"
        title="Less legalese."
        accent="More understanding."
        description="Explore real federal legislation in plain language. Choose a bill and the level of detail that works for you."
      />
      <BillExplorer bills={bills} demos={demos} />
    </div>
  );
}
