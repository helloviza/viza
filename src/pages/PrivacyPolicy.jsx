import React from "react";
const baseFont = "'Barlow Condensed', Arial, sans-serif";

/** ------------------------------------------------------------------
 *  Privacy Policy – Helloviza.com
 *  Drop-in replacement with compact spacing (no text changes)
 *  ------------------------------------------------------------------ */

// 1) Your required intro block FIRST (exact text)
const introBlock = `Last Updated: 27.12.2025
Helloviza is a brand and online platform operated by Peachmint Trips and Planners Private Limited (“Peachmint”, “we”, “our”, or “us”). We are committed to protecting your privacy and handling your personal data responsibly, in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act), the Information Technology Act, 2000 and applicable rules (including the IT Rules, 2021), and other applicable data protection laws (including GDPR where relevant).`;

// 2) Your sections (exact text)
const sections = [
  {
    title: "1. Information We Collect",
    content: `
a) Personal Information Provided by You:
Name, gender, date of birth, nationality, and other identification data


Contact details: address, telephone/mobile number, email address


Passport details and government-issued ID numbers


Visa application details, travel itinerary, travel history, travel dates


Payment and transaction information (processed securely via third-party payment gateways)


Supporting documents: scanned IDs, photos, letters, proof of funds, etc.


Details of your queries or communications with us (email, chat, calls)


Any information voluntarily provided through forms, chatbots, or support channels


b) Information Collected Automatically:
Device and browser information, operating system, IP address, language, and access times


Log data and analytics (pages visited, time spent, clicks, referring websites)


Cookies, pixel tags, and similar technologies to personalize your experience and analyze usage


c) Information from Third Parties:
Payment processors, travel or insurance partners, verification services


Social media platforms, if you choose to link or sign in via third-party accounts
    `,
  },
  {
    title: "2. Purpose of Collecting Your Information",
    content: `
We collect and process your personal data for the following lawful purposes:
To process visa and travel applications, including submitting your details to embassies, consulates, and government authorities


To verify your identity and eligibility for travel/visa services


To communicate with you, including responding to queries, application status updates, and customer support


To process payments, refunds, and maintain financial records


To improve, analyze, and enhance our services, website/app performance, and customer experience


To send marketing or promotional communications (only with your prior consent; you may opt-out at any time)


To comply with legal/regulatory obligations, resolve disputes, and enforce our Terms of Service
    `,
  },
  {
    title: "3. Lawful Basis for Processing",
    content: `
We process your information based on:
Performance of a contract (e.g., processing your visa/travel request)


Compliance with law (e.g., IT Rules 2021, DPDP Act 2023, tax/regulatory filings)


Legitimate interests (e.g., fraud prevention, improving services)


Consent (e.g., marketing, processing sensitive personal data such as passport, visa history, financial proofs)
Sensitive Personal Data Notice: Passport, visa records, financial documents, and similar sensitive data will only be processed with your explicit consent or where required by applicable law.
    `,
  },
  {
    title: "4. Cookies and Tracking Technologies",
    content: `
Helloviza.com uses cookies, web beacons, and similar technologies to:
Recognize you and personalize your experience


Remember your preferences and settings


Analyze usage, traffic, and user engagement


Deliver relevant advertisements (where applicable)


You can control cookies via browser settings. Where required by law (e.g., EU/UK), we will obtain your consent before placing non-essential cookies, but disabling cookies may impact certain features of the site.
    `,
  },
  {
    title: "5. Sharing and Disclosure of Your Information",
    content: `
Helloviza.com may share your data only as necessary and in accordance with this Policy:
Government and embassy authorities: For visa/travel processing


Service providers and partners: For payment processing, customer support, hosting, analytics, delivery/courier, insurance, or verification


Affiliates/group companies: To offer you value-added services (with safeguards)


Legal obligations: To comply with laws, government requests, or protect rights


Business transfers: In mergers, acquisitions, restructuring, or asset sales


We do not sell your personal data to third parties.
    `,
  },
  {
    title: "6. Data Security and Retention",
    content: `
Security measures: encryption, secure servers, firewalls, and restricted access controls


Retention: We retain your personal data for as long as required to fulfill the purpose of collection, or up to 7 years, unless a longer period is required by law


Data breaches: In the event of a data breach, you and relevant authorities will be notified as per law
    `,
  },
  {
    title: "7. Your Rights & Choices",
    content: `
As per the DPDP Act 2023 and applicable laws, you may:
Access, correct, update, or delete your personal information


Withdraw consent (where processing is based on consent)


Object to or restrict processing in certain cases


Request data portability (where technically feasible)


Opt out of marketing communications at any time


Requests can be sent to: privacy@helloviza.com. We may verify your identity before fulfilling your request.
    `,
  },
  {
    title: "8. Children's Privacy",
    content: `
Our services are not intended for individuals under 18 years of age. If a minor has shared personal data, please contact us for removal.
    `,
  },
  {
    title: "9. International Data Transfers",
    content: `
Your information may be processed outside your country. We ensure safeguards consistent with this Privacy Policy and applicable laws. For EU/UK users, we rely on Standard Contractual Clauses or equivalent mechanisms.
    `,
  },
  {
    title: "10. Grievances & Complaints (IT Rules 2021)",
    content: `
If you have complaints about our handling of your data, please contact:
Grievance Officer
 Peachmint Trips and Planners Private Limited
 [Registered Address]
 Email: grievance@helloviza.com
As per Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the Grievance Officer will acknowledge your complaint within 24 hours and resolve it within 15 days of receipt, or sooner if required by law.

To help us process your complaint, please provide:

Identification of the information provided by you
Clear statement as to whether the information is personal or sensitive personal information
Your address, telephone number, or email address
A statement that you have a good-faith belief that the information has been processed incorrectly or disclosed without authorization, as the case may be
A statement, under penalty of perjury, that the information in the notice is accurate and that the information belongs to you

Appeals may be made to the Grievance Appellate Committee within 30 days of our response
    `,
  },
  {
    title: "11. External Links",
    content: `
Our site may contain links to third-party sites or services not operated by Helloviza.com, This Privacy Policy does not apply to those third-party sites. Please review their policies before submitting your data.
    `,
  },
  {
    title: "12. Updates to this Policy",
    content: `
We may update this policy periodically. The updated version will be posted with a revised “last updated” date. Continued use of our services constitutes acceptance.
    `,
  },
  {
    title: "13. Contact Us",
    content: `
For privacy-related queries:
Peachmint Trips and Planners Private Limited
 Vatika Business Park,
 Gurugram, Haryana
 📧 privacy@helloviza.com 
    `,
  },
];

// 3) Helper: collapse multiple blank lines to a single newline for compact rendering
const compact = (s) => s.replace(/\n{2,}/g, "\n");

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Responsive mobile tweaks */}
      <style>{`
        @media (max-width: 600px) {
          .hv-pp-wrap {
            margin: 24px 0 0 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 18px 6vw 24px 6vw !important;
            max-width: 100vw !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .hv-pp-title { font-size: 2.1rem !important; padding-top: 0.7rem !important; }
          .hv-pp-section h2 { font-size: 1.07rem !important; margin-bottom: 9px !important; margin-top: 22px !important; }
          .hv-pp-section pre { font-size: 0.98rem !important; line-height: 1.45 !important; white-space: pre-wrap !important; }
        }
      `}</style>

      <div
        className="hv-pp-wrap max-w-3xl mx-auto bg-white rounded-2xl shadow-xl"
        style={{
          marginTop: "150px",
          marginBottom: "60px",
          marginLeft: "60px",
          marginRight: "60px",
          color: "#1a237e",
          fontFamily: baseFont,
          padding: "56px 48px 56px 48px",
        }}
      >
        {/* Title */}
        <h1
          className="hv-pp-title"
          style={{
            color: "#003366",
            fontFamily: baseFont,
            fontSize: "3.0rem",
            fontWeight: 800,
            marginBottom: "18px",
            lineHeight: 1.12,
            textAlign: "center",
          }}
        >
          Privacy Policy – Helloviza.com
        </h1>

        {/* EXACT intro block FIRST */}
        <pre
          style={{
            fontFamily: baseFont,
            color: "#00477f",
            fontSize: "1.02rem",
            lineHeight: 1.45,
            marginBottom: "18px",
            whiteSpace: "pre-wrap",
          }}
        >
          {compact(introBlock)}
        </pre>

        {/* Sections */}
        <div>
          {sections.map((section, idx) => (
            <section
              key={idx}
              className="hv-pp-section"
              style={{
                borderBottom: idx !== sections.length - 1 ? "1px solid #e0e7ef" : "none",
                paddingBottom: idx !== sections.length - 1 ? "28px" : "0",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  color: "#d06549",
                  fontFamily: baseFont,
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  marginBottom: "10px",
                }}
              >
                {section.title}
              </h2>

              <pre
                style={{
                  color: "#00477f",
                  fontSize: "1.02rem",
                  lineHeight: 1.45,
                  fontFamily: baseFont,
                  marginBottom: "6px",
                  background: "none",
                  border: "none",
                  padding: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {compact(section.content)}
              </pre>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div
          style={{
            fontFamily: baseFont,
            marginTop: "36px",
            fontSize: "1rem",
            color: "#888",
            textAlign: "center",
          }}
        >
          By using Helloviza.com, you acknowledge that you have read, understood, and agree to this Privacy Policy.
        </div>
      </div>
    </div>
  );
}
