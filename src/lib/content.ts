import rightsData from "@/data/rights.json";
import citiesData from "@/data/cities.json";
import billsData from "@/data/bills.json";
import demoData from "@/data/demo-explanations.json";
import {
  billSchema,
  citySchema,
  demoSchema,
  lessonSchema,
  type Bill,
  type Demo,
} from "./schemas";

// The interface consumes normalized records. Future server-only adapters can
// implement this contract without exposing upstream API shapes to components.
export interface BillProvider {
  listBills(): Promise<Bill[]>;
  getExplanation(billId: string): Promise<Demo | null>;
}
export const lessons = lessonSchema.array().parse(rightsData);
export const cities = citySchema.array().parse(citiesData);
const bills = billSchema.array().parse(billsData);
const demos = demoSchema.array().parse(demoData);
export const localBillProvider: BillProvider = {
  async listBills() {
    return bills;
  },
  async getExplanation(billId) {
    return demos.find((demo) => demo.billId === billId) ?? null;
  },
};
