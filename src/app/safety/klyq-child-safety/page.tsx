import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { childSafetyHtml } from "@/content/klyq-legal";

export const metadata: Metadata = {
  title: "Klyq Child Safety Standards | Rivelo Labs",
  description: "Klyq's public standards against child sexual abuse and exploitation and how to report concerns.",
};

export default function KlyqChildSafetyPage() {
  return <LegalPage html={childSafetyHtml} />;
}
