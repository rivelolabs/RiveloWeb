import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { androidPrivacyHtml } from "@/content/klyq-legal";

export const metadata: Metadata = {
  title: "Klyq Android Privacy Policy | Rivelo Labs",
  description: "Privacy policy for the Klyq Android app, including account data, nearby discovery, calls, subscriptions, and deletion.",
};

export default function KlyqAndroidPrivacyPage() {
  return <LegalPage html={androidPrivacyHtml} />;
}
