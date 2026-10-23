import type { Metadata } from "next";
import Link from "next/link";
import RiveloLegal, { LEGAL_CONTACT, type LegalSection } from "@/components/RiveloLegal";

export const metadata: Metadata = {
  title: "Terms of Service | Rivelo Labs",
  description: "The terms that apply when you use Rivelo Labs, list a product, place a business on the map or join the community.",
  alternates: { canonical: "https://www.rivelolabs.com/legal/terms" },
};

const mail = <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a>;

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement",
    body: (
      <>
        <p>These Terms of Service (&ldquo;Terms&rdquo;) are an agreement between you and <strong>Rivelo Labs</strong> (&ldquo;Rivelo&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), which operates rivelolabs.com (the &ldquo;Service&rdquo;). By using the Service you agree to these Terms and our <Link href="/legal/privacy">Privacy Policy</Link>. If you do not agree, do not use the Service.</p>
        <p>If you use the Service on behalf of a company or other organization, you confirm that you have authority to accept these Terms for it. These Terms do not cover the apps and websites listed on the Service, which have their own terms and policies.</p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility and accounts",
    body: (
      <ul>
        <li>You must be at least 18 years old, or the age of majority where you live, to use the Service.</li>
        <li>You can sign in with Google or X. You are responsible for activity on your account and for keeping access to your sign-in provider secure.</li>
        <li>Give accurate information and do not impersonate any person, business or brand.</li>
        <li>Tell us right away at {mail} if you believe your account has been used without your permission.</li>
      </ul>
    ),
  },
  {
    id: "listings",
    title: "Listings and claims",
    body: (
      <>
        <p>You may submit or claim an app, website or business only if you own it or are authorized to represent it. All listings are reviewed and we may approve, edit for formatting, decline or remove any listing at our discretion. A listing does not mean we endorse, verify or guarantee the product.</p>
        <p>You are responsible for making sure your listing is accurate, lawful and kept up to date. Some listings are created from publicly available information; if you own one, you can claim it to update it, or ask us to remove it.</p>
      </>
    ),
  },
  {
    id: "location",
    title: "Business locations and maps",
    body: (
      <>
        <p>When you add a location to a listing, you confirm that you are allowed to publish it and you understand it will be shown publicly on the map. Use a business address or an approximate area. Do not publish a private residence or someone else&rsquo;s address without their permission.</p>
        <p>Using your device location is optional and requires your permission; see the <Link href="/legal/privacy#location">Location section of our Privacy Policy</Link>. Map positions, distances and &ldquo;near me&rdquo; results are approximate, may be inaccurate and should not be relied on for navigation or safety. Map data is provided by third parties, such as OpenStreetMap contributors, under their own terms.</p>
      </>
    ),
  },
  {
    id: "content",
    title: "Your content",
    body: (
      <>
        <p>You keep ownership of the content you submit, including listings, images, descriptions and community posts (&ldquo;Your Content&rdquo;). You grant Rivelo Labs a worldwide, non-exclusive, royalty-free license to host, store, reproduce, adapt for display, publish and distribute Your Content in connection with operating and promoting the Service. This license ends when Your Content is removed, except for copies kept in backups for a limited time or as required by law.</p>
        <p>You confirm that you have the rights needed to submit Your Content and that it does not infringe anyone&rsquo;s intellectual property, privacy or other rights.</p>
      </>
    ),
  },
  {
    id: "conduct",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Post content that is unlawful, misleading, defamatory, hateful, harassing, sexually explicit, violent, or that harms minors.</li>
          <li>List products that are illegal, deceptive, malicious, or that you do not have the right to promote.</li>
          <li>Spam, run manipulative promotion, post fake reviews or upvotes, or create fake accounts or listings.</li>
          <li>Share other people&rsquo;s personal information, including addresses or precise locations, without their consent.</li>
          <li>Scrape, crawl or harvest data from the Service at scale, or use it to build a competing database, without our written permission.</li>
          <li>Interfere with, probe or disrupt the Service, its security, or other users.</li>
          <li>Upload malware or try to gain unauthorized access to any account or system.</li>
        </ul>
        <p>We may remove content and suspend or terminate accounts that violate these Terms.</p>
      </>
    ),
  },
  {
    id: "paid",
    title: "Paid plans",
    body: (
      <>
        <p>Spotlight, Map yacht and Growth are optional paid plans shown on our <Link href="/premium">plans page</Link>. Payments are processed by Dodo Payments, our Merchant of Record, which also handles taxes and invoices. Plans renew automatically each week or month until you cancel, and you can cancel any time; your placement stays live until the end of the paid period.</p>
        <p>Refunds follow our <Link href="/legal/refunds">Refund &amp; Cancellation Policy</Link>. We do not guarantee any particular ranking, traffic, downloads or results.</p>
      </>
    ),
  },
  {
    id: "ip",
    title: "Our intellectual property",
    body: <p>The Service, including its design, software, text, graphics and the Rivelo Labs name and logo, is owned by Rivelo Labs or its licensors and protected by law. Except for Your Content, you may not copy, modify, distribute or create derivative works from the Service without our permission. Product names and logos shown in listings belong to their respective owners.</p>,
  },
  {
    id: "third",
    title: "Third-party services and links",
    body: <p>The Service links to third-party apps, websites and stores, and relies on third-party services such as Google, X, Supabase and map providers. We are not responsible for their content, products, availability or practices, and your use of them is governed by their own terms.</p>,
  },
  {
    id: "takedown",
    title: "Reporting and takedowns",
    body: <p>To report content that infringes your rights, shares your personal information or location, or otherwise breaks these Terms, email {mail} with the link to the content and an explanation. We will review reports and act on them within a reasonable time and as required by applicable law, including the Information Technology Act, 2000 and its rules.</p>,
  },
  {
    id: "termination",
    title: "Suspension and termination",
    body: <p>You can stop using the Service at any time and ask us to delete your account. We may suspend or end your access, or remove listings or content, if you breach these Terms, if required by law, or to protect users or the Service. Sections that by their nature should survive (including content licenses for existing backups, disclaimers, liability limits and governing law) will survive termination.</p>,
  },
  {
    id: "disclaimer",
    title: "Disclaimers",
    body: <p>The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the fullest extent permitted by law, we make no warranties of any kind, express or implied, including about accuracy of listings or locations, fitness for a particular purpose, availability or non-infringement. You use listed products and contact other users at your own risk.</p>,
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: <p>To the fullest extent permitted by law, Rivelo Labs and its team and partners will not be liable for any indirect, incidental, special, consequential or punitive damages, or for loss of profits, data, goodwill or business, arising from your use of the Service. Our total liability for any claim relating to the Service is limited to the greater of the amount you paid us for the Service in the 12 months before the claim or INR 5,000. Nothing in these Terms limits liability that cannot be limited by law.</p>,
  },
  {
    id: "indemnity",
    title: "Indemnity",
    body: <p>You agree to indemnify and hold Rivelo Labs harmless from claims, losses and expenses (including reasonable legal fees) arising from Your Content, your listings or locations you publish, your breach of these Terms, or your violation of any law or third-party right.</p>,
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: <p>These Terms are governed by the laws of India. Subject to any mandatory consumer protection rights where you live, the courts of Uttar Pradesh, India will have exclusive jurisdiction over any dispute arising from these Terms or the Service. Before starting a formal dispute, please contact us so we can try to resolve it informally.</p>,
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    body: <p>We may update these Terms from time to time. We will change the &ldquo;Last updated&rdquo; date and, for material changes, give notice on the site or by email. Continuing to use the Service after changes take effect means you accept the updated Terms.</p>,
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
      badge="Terms of Service"
      title="Rivelo Labs Terms of Service"
      updated="October 23, 2026"
      intro={<p>Please read these Terms carefully. They cover your account, the listings and business locations you publish, community conduct and the limits of our responsibility.</p>}
      sections={sections}
      other={{ href: "/legal/privacy", label: "Privacy Policy" }}
    />
  );
}
