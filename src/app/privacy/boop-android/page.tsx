import type { Metadata } from "next";
import BoopPrivacy from "@/components/BoopPrivacy";

export const metadata: Metadata = {
  title: "Privacy Policy for BOOP (Android) | Rivelolabs",
  description: "Privacy Policy for BOOP (Android) — an offline wave-physics pet puzzle game that collects no personal data.",
};

export default function BoopAndroidPrivacyPage() {
  return <BoopPrivacy platform="android" />;
}
