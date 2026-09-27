import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { accountDeletionHtml } from "@/content/klyq-legal";

export const metadata: Metadata = {
  title: "Delete your Klyq account | Rivelo Labs",
  description: "How to delete your Klyq account and associated data on Android and iOS.",
};

export default function KlyqAccountDeletionPage() {
  return <LegalPage html={accountDeletionHtml} />;
}
