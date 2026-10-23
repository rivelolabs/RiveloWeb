import type { Metadata } from "next";
import Link from "next/link";
import RiveloLegal, { LEGAL_CONTACT, type LegalSection } from "@/components/RiveloLegal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Rivelo Labs",
  description: "How cancellations and refunds work for Rivelo Labs paid plans: Spotlight, Map yacht and Growth.",
  alternates: { canonical: "https://www.rivelolabs.com/legal/refunds" },
};

const mail = <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a>;

const sections: LegalSection[] = [
  {
    id: "plans",
    title: "What you are buying",
    body: (
      <>
        <p>Listing a product on Rivelo Labs, claiming a listing and joining the community are free. Paid plans are optional promotion:</p>
        <ul>
          <li><strong>Spotlight</strong> &mdash; USD 15 per week. Your product pinned at the top of Trending this week and first in Fresh launches on the homepage.</li>
          <li><strong>Map yacht</strong> &mdash; USD 20 per week. Your logo and link on one of five premium yachts on the world map.</li>
          <li><strong>Growth</strong> &mdash; USD 50 per month. Spotlight for 7 days each month, one map yacht for the month, AI analysis and SEO tracking with suggestions, and a monthly report.</li>
        </ul>
        <p>Prices are shown before checkout. Taxes may be added at checkout depending on where you are.</p>
      </>
    ),
  },
  {
    id: "billing",
    title: "Billing and our payment partner",
    body: <p>Payments are processed by our payment partner and Merchant of Record, <strong>Dodo Payments</strong>, which handles checkout, billing, sales tax and invoices. The charge on your statement may show Dodo Payments. Plans renew automatically at the end of each billing period (weekly or monthly) until you cancel.</p>,
  },
  {
    id: "cancel",
    title: "Cancelling",
    body: (
      <ul>
        <li>You can cancel any time from your <Link href="/premium">plan page</Link> or by emailing {mail}.</li>
        <li>Cancellation stops the next renewal. Your placement stays live until the end of the period you already paid for, and you will not be charged again.</li>
        <li>Cancelling a paid plan never removes your free listing.</li>
      </ul>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    body: (
      <>
        <p>Because placements start showing to visitors right after payment, time that has already run is generally not refundable. We will give a full or pro-rated refund when:</p>
        <ul>
          <li>your placement did not go live within 48 hours of payment because of a problem on our side;</li>
          <li>you were charged twice or charged after cancelling;</li>
          <li>we remove your placement for a reason that is not a breach of our <Link href="/legal/terms">Terms</Link>;</li>
          <li>you ask within 7 days of your <em>first</em> payment for a plan and the placement has not yet gone live.</li>
        </ul>
        <p>Search rankings, traffic, downloads and sales are not guaranteed, so a lack of results is not on its own a reason for a refund.</p>
      </>
    ),
  },
  {
    id: "how",
    title: "How to ask for a refund",
    body: <p>Email {mail} from the address you paid with, within 30 days of the charge, with the date and amount and what went wrong. We reply within 3 business days. Approved refunds go back to your original payment method through Dodo Payments, usually within 5&ndash;10 business days depending on your bank.</p>,
  },
  {
    id: "chargebacks",
    title: "Disputes",
    body: <p>Please contact us before opening a dispute with your bank so we can fix the problem quickly. Your rights under local consumer law are not affected by this policy.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    body: <p>Rivelo Labs, India. Email: {mail}.</p>,
  },
];

export default function Page() {
  return (
    <RiveloLegal
      badge="Refunds"
      title="Refund & Cancellation Policy"
      updated="October 23, 2026"
      intro={<p>Clear rules for cancelling a paid plan and getting your money back when something goes wrong.</p>}
      sections={sections}
      other={{ href: "/legal/terms", label: "Terms of Service" }}
    />
  );
}
