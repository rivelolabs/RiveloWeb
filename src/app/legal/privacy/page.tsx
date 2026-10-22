import type { Metadata } from "next";
import Link from "next/link";
import RiveloLegal, { LEGAL_CONTACT, type LegalSection } from "@/components/RiveloLegal";

export const metadata: Metadata = {
  title: "Privacy Policy | Rivelo Labs",
  description: "How Rivelo Labs collects, uses, shares and protects information, including account, listing and location data.",
  alternates: { canonical: "https://rivelolabs.com/legal/privacy" },
};

const mail = <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a>;

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <>
        <p>Rivelo Labs (&ldquo;Rivelo&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a directory, business map and community for independent apps, websites and the people who build them, available at rivelolabs.com. Rivelo Labs is based in India and is responsible for the personal data described in this policy.</p>
        <p>This policy covers the Rivelo Labs website and its features: browsing, accounts, product listings, the business map, owner claims, the community and growth services. It does not cover the apps and websites listed on Rivelo Labs, which have their own privacy policies, or third-party sites you reach through a listing.</p>
      </>
    ),
  },
  {
    id: "collect",
    title: "Information we collect",
    body: (
      <>
        <p><strong>Account information.</strong> When you sign in with Google or X, we receive the basic profile the provider shares with your permission: your name, email address, profile picture, username or handle, and a provider account ID. We never receive your Google or X password and we never post to your social accounts.</p>
        <p><strong>Listing information.</strong> When you register or claim a product we collect the product name, website or store link, description, category, platform, city, the public location you choose for the map, and a contact email. You also confirm that you are authorized to submit the product.</p>
        <p><strong>Location information.</strong> See <a href="#location">Location</a> below for exactly what we collect and how it is used.</p>
        <p><strong>Payments and plans.</strong> If you buy a paid plan, we store your plan, subscription status, billing dates, amounts and the product you promote. Razorpay processes the payment itself.</p>
        <p><strong>Upvotes.</strong> Which products you upvote, used to rank Trending.</p>
        <p><strong>Community content.</strong> Posts, replies, titles, topics and the display name you post under.</p>
        <p><strong>Messages and enquiries.</strong> Information you send us through growth-services, support, claim or contact forms, such as your email, website and message.</p>
        <p><strong>Technical information.</strong> Like most websites, our servers and hosting providers receive your IP address, browser type, device information, pages requested and timestamps. We use these for security, abuse prevention and keeping the service running.</p>
        <p><strong>Cookies and browser storage.</strong> We use essential cookies to keep you signed in and protect sign-in requests. Your browser may also store your saved products and submission receipts locally on your device. We do not use advertising cookies.</p>
        <p><strong>Publicly available information.</strong> To build the directory we may collect public details about apps and websites (such as names, descriptions, icons and public contact addresses) from the websites themselves and public app store listings.</p>
      </>
    ),
  },
  {
    id: "location",
    title: "Location",
    body: (
      <>
        <p>Location is used so that you can place your business or product on the Rivelo Labs map and so that visitors can find businesses near them. It is always optional.</p>
        <ul>
          <li><strong>Business location you choose.</strong> When you list a product, you choose a point on the map, enter coordinates, or type a city or address. This location is shown publicly on the map and listing after review. Choose a business address or an approximate area, not a private home address, unless you are comfortable with it being public.</li>
          <li><strong>Device location (only with your permission).</strong> If you use a &ldquo;use my location&rdquo; or &ldquo;near me&rdquo; feature, your browser or device will ask for permission first. If you allow it, we use your device&rsquo;s location to centre the map, suggest a pin for your business, or show nearby listings. You can decline and still use every feature by searching or placing the pin manually.</li>
          <li><strong>Approximate location.</strong> We may infer a rough region (such as country or city) from your IP address for security and to show relevant results. We do not use it to identify your precise location.</li>
        </ul>
        <p>We do not track your location in the background, we do not build location history, and we do not sell or share location data for advertising. Device location used only to centre the map or find nearby listings is not stored against your account. A business location you submit is stored with that listing until you change it or remove the listing.</p>
        <p>You can turn location permission off at any time in your browser or device settings, and you can edit or remove a listing&rsquo;s location by contacting us at {mail}.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use information",
    body: (
      <ul>
        <li>To create and secure your account and keep you signed in.</li>
        <li>To review, publish and display listings, including their public map location.</li>
        <li>To verify product ownership claims and prevent fake or unauthorized listings.</li>
        <li>To run the community, including moderating content and enforcing our <Link href="/legal/terms">Terms of Service</Link>.</li>
        <li>To respond to enquiries and provide growth services you request.</li>
        <li>To send service messages, such as listing status updates. Where we contact the publicly listed address of a product to invite its owner to claim or update a listing, every message includes a link to stop future invitations, and we honor that choice.</li>
        <li>To detect, prevent and investigate spam, fraud, abuse and security incidents.</li>
        <li>To understand how features are used and improve the service.</li>
        <li>To comply with legal obligations.</li>
      </ul>
    ),
  },
  {
    id: "public",
    title: "What is public",
    body: (
      <p>Approved listings (name, description, links, category, images, city and chosen map location), community posts and the display name you post under are visible to anyone. Contact emails submitted with listings and claims are kept private and are not published or returned by any public API.</p>
    ),
  },
  {
    id: "sharing",
    title: "How we share information",
    body: (
      <>
        <p>We do not sell your personal information. We share it only as follows:</p>
        <ul>
          <li><strong>Service providers</strong> who process data on our behalf, including Supabase (authentication and database), our hosting and infrastructure providers, an email delivery provider (such as Resend), our payment processor Razorpay (which handles card and payment details for paid plans; we never see or store your full card number), Product Hunt (whose public launch data we display), a search data provider used to read public app store listings, and map tile providers such as OpenStreetMap. When the map loads, your browser requests map images directly from the tile provider, which receives your IP address and the map area being viewed.</li>
          <li><strong>Sign-in providers</strong> (Google and X) when you choose to sign in with them, under their own privacy policies.</li>
          <li><strong>Legal and safety</strong> reasons: when required by law, court order or government request, or when needed to protect the rights, safety or property of our users, the public or Rivelo Labs.</li>
          <li><strong>Business transfers</strong>, such as a merger or acquisition, in which case this policy will continue to apply to your information.</li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data retention",
    body: (
      <p>We keep account information while your account is active. Listings and their locations are kept while the listing is published or under review and removed when you ask us to delete them. Community posts remain until you or we remove them. Opt-out records for invitation emails are kept as a one-way hash so we can continue honoring your choice. Server logs are kept for a limited period for security. When information is no longer needed we delete or anonymize it, unless we must keep it to meet legal obligations, resolve disputes or enforce our agreements.</p>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: <p>We use encrypted connections (HTTPS), access controls and reputable infrastructure providers to protect information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. If you believe your account has been compromised, contact us right away at {mail}.</p>,
  },
  {
    id: "rights",
    title: "Your choices and rights",
    body: (
      <>
        <p>Depending on where you live, including under India&rsquo;s Digital Personal Data Protection Act, 2023, and laws such as the GDPR, you may have the right to access, correct, update or erase your personal data, withdraw consent, object to or restrict certain processing, and nominate another person to exercise your rights. You can also:</p>
        <ul>
          <li>Edit or delete listings, posts and location by contacting us.</li>
          <li>Disconnect Rivelo Labs from your Google or X account settings.</li>
          <li>Turn off location permission in your browser or device.</li>
          <li>Ask us to delete your account and associated data.</li>
        </ul>
        <p>Email {mail} from the address on your account and we will respond within a reasonable time and as required by law. We may need to verify your identity first. If you are not satisfied, you may complain to the relevant data protection authority.</p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: <p>Rivelo Labs is intended for people aged 18 and over, or the age of majority where they live. We do not knowingly collect personal data from children. If you believe a child has given us personal data, contact us and we will delete it.</p>,
  },
  {
    id: "international",
    title: "International transfers",
    body: <p>Rivelo Labs is based in India and our service providers may process data in India and other countries, which may have different data protection laws. Where we transfer data, we take reasonable steps to make sure it remains protected as described in this policy.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: <p>We may update this policy as Rivelo Labs evolves. We will change the &ldquo;Last updated&rdquo; date and, for significant changes, give notice on the site or by email. Continuing to use Rivelo Labs after an update means you accept the revised policy.</p>,
  },
  {
    id: "contact",
    title: "Contact and grievances",
    body: (
      <p>For privacy questions, requests or grievances, contact the Rivelo Labs Grievance Officer at {mail}. We aim to acknowledge complaints within 24 hours and resolve them within the time required by applicable law.</p>
    ),
  },
];

export default function Page() {
  return (
    <RiveloLegal
      badge="Privacy Policy"
      title="Rivelo Labs Privacy Policy"
      updated="October 22, 2026"
      intro={<p>This policy explains what information Rivelo Labs collects, including optional location data used to place businesses on our map, how we use it, and the choices you have.</p>}
      sections={sections}
      other={{ href: "/legal/terms", label: "Terms of Service" }}
    />
  );
}
