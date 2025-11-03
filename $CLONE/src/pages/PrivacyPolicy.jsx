import React from "react";
const baseFont = "'Barlow Condensed', Arial, sans-serif";

const sections = [
  {
    title: "1. Information We Collect",
    content: `
a) Personal Information Provided by You:
- Name, gender, date of birth, nationality, and other identification data
- Contact details: address, telephone/mobile number, email address
- Passport information and government-issued ID numbers
- Visa application details, travel itinerary, travel history, travel dates
- Payment and transaction information (processed securely via third-party payment gateways)
- Supporting documents: scanned IDs, photos, letters, proof of funds, etc.
- Details of your queries or communications with us (email, chat, calls)
- Any information voluntarily provided by you through forms, chatbots, or support channels

b) Information Collected Automatically:
- Device and browser information, operating system, IP address, language, and access times
- Log data and analytics (pages visited, time spent, clicks, referring websites)
- Cookies, pixel tags, and similar technologies to personalize your experience and analyze usage

c) Information from Third Parties:
- Payment processors, travel or insurance partners, verification services
- Social media platforms, if you choose to link or sign in via third-party accounts
    `
  },
  {
    title: "2. Purpose of Collecting Your Information",
    content: `
We collect, use, and process your information for the following lawful purposes:
- To process visa and travel applications on your behalf, including submitting your details to embassies, consulates, and government authorities
- To verify your identity and eligibility for travel/visa services
- To communicate with you, including responding to queries, application status updates, and customer support
- To process payments, refunds, and maintain financial records
- To improve, analyze, and enhance our services, website/app performance, and customer experience
- For marketing and promotional communications (with your consent; you may opt-out at any time)
- For legal compliance, regulatory obligations, dispute resolution, and enforcing our Terms of Service
    `
  },
  {
    title: "3. Lawful Basis for Processing",
    content: `
We process your information on the following legal bases, as applicable:
- Performance of a contract (e.g., processing your visa/travel request)
- Compliance with legal or regulatory obligations
- Legitimate interests (e.g., fraud prevention, improving services)
- With your consent (e.g., marketing)
    `
  },
  {
    title: "4. Cookies and Tracking Technologies",
    content: `
Helloviza.com uses cookies, web beacons, and similar technologies to:
- Recognize you and personalize your experience
- Remember your preferences and settings
- Analyze usage, traffic, and user engagement
- Deliver relevant advertisements (where applicable)

You can control cookies through your browser settings, but disabling cookies may impact certain features of the site.
    `
  },
  {
    title: "5. Sharing and Disclosure of Your Information",
    content: `
Helloviza.com may share your data only as necessary and in accordance with this Policy:
- With government and embassy authorities: For visa/travel processing
- With service providers and partners: For payment processing, customer support, hosting, analytics, delivery/courier, insurance, or verification
- With affiliates and group companies: To offer you additional value-added services (with proper safeguards)
- For legal reasons: To comply with laws, respond to government requests, or protect our rights and the rights of others
- In business transfers: If Helloviza.com is involved in a merger, acquisition, restructuring, or asset sale, your information may be transferred

We never sell your personal information to third parties.
    `
  },
  {
    title: "6. Data Security and Retention",
    content: `
- We implement appropriate administrative, technical, and physical security measures to safeguard your data, including encryption, access controls, and secure servers.
- Your personal information is retained only as long as necessary for the purpose for which it was collected, or as required by law or contractual obligation.
- In the event of a data breach affecting your information, we will notify you and relevant authorities as required by law.
    `
  },
  {
    title: "7. Your Rights and Choices",
    content: `
Depending on applicable law and your jurisdiction, you may have the right to:
- Access, correct, update, or delete your personal information
- Withdraw consent to processing, where processing is based on consent
- Object to or restrict certain types of processing
- Request data portability
- Opt out of marketing communications at any time

To exercise your rights, email us at: privacy@helloviza.com. We may need to verify your identity before fulfilling your request.
    `
  },
  {
    title: "8. Children's Privacy",
    content: `
Helloviza.com does not knowingly collect or process personal data from children under the age of 18. If you believe a child has provided us with personal information, please contact us so that we can remove the data.
    `
  },
  {
    title: "9. International Data Transfers",
    content: `
Your information may be processed and stored in countries other than your own, where data protection laws may differ. We will ensure that adequate safeguards are in place, consistent with this Privacy Policy and applicable law.
    `
  },
  {
    title: "10. Grievances and Complaints (as per Indian IT Rules 2021)",
    content: `
If you have any complaints or concerns about how your personal information is handled by Helloviza.com, please contact our Grievance Officer:

Grievance Officer  
Helloviza Private Limited  
[Your Registered Address Here]  
Email: grievance@helloviza.com

As per Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the Grievance Officer will acknowledge your complaint within 24 hours and resolve it within 15 days of receipt, or sooner if required by law.

To help us process your complaint, please provide:
- Identification of the information provided by you
- Clear statement as to whether the information is personal or sensitive personal information
- Your address, telephone number, or email address
- A statement that you have a good-faith belief that the information has been processed incorrectly or disclosed without authorization, as the case may be
- A statement, under penalty of perjury, that the information in the notice is accurate and that the information belongs to you

If you are aggrieved by a decision of the Grievance Officer, you may appeal to the Grievance Appellate Committee within 30 days of receiving our response.
    `
  },
  {
    title: "11. External Links",
    content: `
Our website may contain links to third-party sites or services not operated or controlled by Helloviza.com. This Privacy Policy does not apply to those third-party sites. Please review their policies before submitting any personal information.
    `
  },
  {
    title: "12. Updates to this Policy",
    content: `
We may revise this Privacy Policy from time to time. Updated policies will be posted on Helloviza.com with a new “last updated” date. Continued use of our services after such updates constitutes your acceptance.
    `
  },
  {
    title: "13. Contact Us",
    content: `
For any privacy-related questions, concerns, or requests, please contact:

Helloviza Private Limited  
[Your Registered Address Here]  
Email: privacy@helloviza.com
    `
  }
];


// Assume `sections` is already defined as an array of {title, content} objects

// Paste your existing sections array here!

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Responsive mobile-only style */}
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
          .hv-pp-title {
            font-size: 2.1rem !important;
            padding-top: 0.7rem !important;
          }
          .hv-pp-date {
            font-size: 1.18rem !important;
            margin-bottom: 20px !important;
          }
          .hv-pp-section h2 {
            font-size: 1.07rem !important;
            margin-bottom: 9px !important;
            margin-top: 22px !important;
          }
          .hv-pp-section pre {
            font-size: 0.98rem !important;
            line-height: 1.57 !important;
            white-space: pre-wrap !important;
          }
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
          padding: "56px 48px 56px 48px"
        }}
      >
        <h1
          className="hv-pp-title"
          style={{
            color: "#003366",
            fontFamily: baseFont,
            fontSize: "3.5rem",
            fontWeight: 800,
            marginBottom: "18px",
            lineHeight: 1.12,
            textAlign: "center"
          }}
        >
          Privacy Policy
        </h1>
        <p
          className="hv-pp-date"
          style={{
            fontFamily: baseFont,
            color: "#2634b7",
            fontSize: "2rem",
            marginBottom: "40px",
            textAlign: "center"
          }}
        >
          Last updated: 31 July 2025
        </p>
        <div>
          {sections.map((section, idx) => (
            <section
              key={idx}
              className="hv-pp-section"
              style={{
                borderBottom: idx !== sections.length - 1 ? "1px solid #e0e7ef" : "none",
                paddingBottom: idx !== sections.length - 1 ? "36px" : "0",
                marginBottom: "32px"
              }}
            >
              <h2
                style={{
                  color: "#d06549",
                  fontFamily: baseFont,
                  fontWeight: 700,
                  fontSize: "2rem",
                  marginBottom: "12px"
                }}
              >
                {section.title}
              </h2>
              <pre
                style={{
                  color: "#00477f",
                  fontSize: "1.2rem",
                  lineHeight: "1.7",
                  fontFamily: baseFont,
                  marginBottom: "8px",
                  background: "none",
                  border: "none",
                  padding: 0,
                  whiteSpace: "pre-wrap"
                }}
              >
                {section.content}
              </pre>
            </section>
          ))}
        </div>
        <div
          style={{
            fontFamily: baseFont,
            marginTop: "50px",
            fontSize: "1rem",
            color: "#888",
            textAlign: "center"
          }}
        >
          By using Helloviza.com, you acknowledge that you have read, understood, and agree to this Privacy Policy.<br /><br />
          For privacy questions or requests:{" "}
          <a href="mailto:privacy@helloviza.com" className="text-blue-700 underline">
            privacy@helloviza.com
          </a>
        </div>
      </div>
    </div>
  );
}
