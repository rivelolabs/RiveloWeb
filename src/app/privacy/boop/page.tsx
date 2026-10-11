import type { Metadata } from "next";
import BoopPrivacy from "@/components/BoopPrivacy";

export const metadata: Metadata = {
  title: "Privacy Policy for BOOP (iOS) | Rivelolabs",
  description: "Privacy Policy for BOOP (iOS) — an offline wave-physics pet puzzle game that collects no personal data.",
};

export default function BoopPrivacyPage() {
  return <BoopPrivacy platform="ios" />;
}
