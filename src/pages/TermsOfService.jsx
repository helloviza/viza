import React from "react";
const baseFont = "'Barlow Condensed', Arial, sans-serif";

/** ------------------------------------------------------------------
 *  Terms of Service – Helloviza.com
 *  Drop-in replacement using EXACT user copy (05.11.2025)
 *  with compact rendering for blank lines.
 *  ------------------------------------------------------------------ */

// Intro must appear FIRST as body lines under the H1
const introBlock = `Last updated: 05.11.2025`;

const sections = [
  {
    title: "1. Introduction",
    content: `Welcome to Helloviza.com, a digital platform owned and operated by Helloviza Private Limited ("Helloviza," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of the website, mobile site, applications, and services (collectively, the "Services") offered by Helloviza.com.
By using our Services, you agree to these Terms, our Privacy Policy, and Refund Policy. If you do not agree, you must discontinue use of our Services immediately.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years of age, or the age of majority in your jurisdiction, to use Helloviza.com. By accessing our Services, you warrant that you meet these eligibility requirements and are legally able to enter into binding contracts.`,
  },
  {
    title: "3. Account Registration and Security",
    content: `Some features require you to register for an account. You agree to:
Provide accurate, current, and complete information during registration and update such information to keep it accurate.


Maintain the confidentiality of your account credentials, including your password.


Notify Helloviza.com immediately of any unauthorized use of your account.


Be responsible for all activities under your account.


We reserve the right to suspend or terminate your account at our discretion.`,
  },
  {
    title: "4. Services Provided",
    content: `Helloviza.com offers a suite of online visa and travel facilitation services, including:
Visa eligibility checks and guidance.


Assistance with application forms and supporting documentation.


Appointment scheduling with embassies/consulates.


Updates on visa application status.


Customer support for travel and visa questions.


Travel insurance, forex, and other value-added services (if applicable).


Note: Helloviza.com acts as an intermediary and facilitator; it does not guarantee visa issuance or travel approval, as these are subject to the discretion of embassies, consulates, or other authorities.`,
  },
  {
    title: "5. User Responsibilities",
    content: `You agree to:
Use Helloviza.com lawfully and ethically.


Provide truthful and complete information for all applications and interactions.


Review and comply with the latest requirements of relevant embassies/authorities.


Upload only documents that belong to you or you are authorized to submit.


Keep your contact and payment information up-to-date.


You are solely responsible for the consequences of providing incorrect, misleading, or fraudulent information.`,
  },
  {
    title: "6. Accuracy of Information",
    content: `You are responsible for providing accurate, current, and complete information. Helloviza.com is not liable for any issues arising from incorrect or incomplete information provided by you.`,
  },
  {
    title: "7. Payments, Fees & Taxes",
    content: `Certain Services require payment. Fees are displayed transparently before purchase.


You authorize Helloviza.com to charge the provided payment method for all Services selected.


Fees paid are non-refundable except as specified in our Refund Policy.


You are responsible for any applicable taxes, duties, or levies associated with your transaction.`,
  },
  {
    title: "8. Refund & Cancellation Policy",
    content: `Refund eligibility is described in our Refund Policy. Generally:
Fees paid for completed applications, processing, or bookings are non-refundable.


Refunds are only possible in limited cases (e.g., duplicate payments or cancellations before submission to authorities).


Requests must be submitted within the timeframe mentioned in our Refund Policy.`,
  },
  {
    title: "9. No Guarantee of Visa Issuance",
    content: `Helloviza.com does not represent any government or embassy. All final decisions regarding visa issuance, rejection, or processing times are made by the respective authorities.
Helloviza.com is not responsible for losses or costs (including missed flights, penalties, or other expenses) arising from visa rejection, delay, or government actions.`,
  },
  {
    title: "10. Third-Party Services and Content",
    content: `Our platform may offer links or access to third-party services, including payment processors, insurance providers, or travel partners. Helloviza.com does not control or endorse these services and is not responsible for their actions, terms, or privacy practices. Use third-party services at your own risk.`,
  },
  {
    title: "11. Intellectual Property Rights",
    content: `All content, branding, trademarks, graphics, and technology on Helloviza.com are owned by or licensed to Helloviza Private Limited. No user may reproduce, republish, sell, or exploit any part of our platform without prior written consent.`,
  },
  {
    title: "12. Prohibited Uses",
    content: `You agree not to:
Use the Services for unlawful, fraudulent, or malicious purposes.


Interfere with or disrupt the operation or security of Helloviza.com.


Attempt to reverse engineer, decompile, or extract source code.


Circumvent security or authentication measures.


Use bots, scripts, or scraping technology without explicit permission.`,
  },
  {
    title: "13. User Content & Uploaded Data",
    content: `Any information, documents, or data you provide ("User Content") remains your responsibility. By submitting User Content, you grant Helloviza.com a non-exclusive license to process and use this information for providing Services.
You must not upload:
Infringing, illegal, or offensive material.


Viruses or malicious code.`,
  },
  {
    title: "14. Data Privacy",
    content: `Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, store, and protect your data.
We comply with the Digital Personal Data Protection Act, 2023 (DPDP Act), the IT Rules 2021, and other applicable data protection laws.`,
  },
  {
    title: "15. Communications & Notifications",
    content: `By creating an account, you agree to receive transactional emails, SMS, WhatsApp, or push notifications related to your account, visa process, or support.
You may unsubscribe from marketing emails at any time.


By using our Services, you consent to receive electronic communications, which satisfy legal requirements for written notices.`,
  },
  {
    title: "16. Changes to Services",
    content: `Helloviza.com reserves the right to change, suspend, or discontinue any part of the Services at any time, with or without notice.`,
  },
  {
    title: "17. Limitation of Liability",
    content: `To the fullest extent permitted by law:
Helloviza.com is not liable for indirect, incidental, special, or consequential damages, including lost profits, business interruption, or loss of data.


Our total liability for any claim shall not exceed the amount paid by you to Helloviza.com in the six (6) months prior to the claim.`,
  },
  {
    title: "18. Indemnification",
    content: `You agree to indemnify and hold harmless Helloviza.com, its directors, employees, and agents from any claims, losses, damages, or expenses resulting from:
Your violation of these Terms.


Your misuse of the Services.


Any User Content you submit.`,
  },
  {
    title: "19. Suspension or Termination",
    content: `Helloviza.com may suspend or terminate your account or access to Services, at its sole discretion, for violations of these Terms, illegal activity, fraud, abuse, or for security reasons.
We may retain and use your data as necessary to comply with the law.`,
  },
  {
    title: "20. Governing Law and Dispute Resolution",
    content: `These Terms are governed by the laws of India.
Parties agree to first attempt to resolve disputes amicably through written communication.


If unresolved, disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.`,
  },
  {
    title: "21. Severability",
    content: `If any provision of these Terms is found invalid or unenforceable, the remainder will continue in effect.`,
  },
  {
    title: "22. Assignment",
    content: `You may not transfer or assign your rights or obligations under these Terms without our written consent. Helloviza.com may assign these Terms at its discretion.`,
  },
  {
    title: "23. Waiver",
    content: `Any failure to enforce a right or provision of these Terms does not constitute a waiver.`,
  },
  {
    title: "24. Entire Agreement",
    content: `These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and Helloviza.com regarding use of the Services.`,
  },
  {
    title: "25. Updates to Terms",
    content: `We may update these Terms from time to time. Updated versions will be posted on Helloviza.com with a new effective date. Continued use of our Services after updates constitutes acceptance.`,
  },
  {
    title: "26. Force Majeure",
    content: `Helloviza.com is not liable for any failure or delay in performance caused by circumstances beyond our reasonable control, including but not limited to natural disasters, government acts, network failures, or force majeure events.`,
  },
  {
    title: "27. Feedback and Suggestions",
    content: `Any feedback or suggestions you submit may be used by Helloviza.com without any obligation to you. We may use such input to improve our Services.`,
  },
  {
    title: "28. Language",
    content: `These Terms are drafted in English. Translations may be provided for convenience, but the English version controls in the event of any conflict.`,
  },
  {
    title: "29. Grievances & Complaints (IT Rules 2021)",
    content: `If you have complaints about our services, please contact:
Grievance Officer
 Helloviza Private Limited
 [Registered Address]
 Email: grievance@helloviza.com
As per Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the Grievance Officer will acknowledge your complaint within 24 hours and resolve it within 15 days of receipt, or sooner if required by law.

To help us process your complaint, please provide:

Identification of the information provided by you
Clear statement as to whether the information is personal or sensitive personal information
Your address, telephone number, or email address
A statement that you have a good-faith belief that the information has been processed incorrectly or disclosed without authorization, as the case may be
A statement, under penalty of perjury, that the information in the notice is accurate and that the information belongs to you

Appeals may be made to the Grievance Appellate Committee within 30 days of our response`,
  },
];

// Closing lines (exact)
const closingBlock = `By using Helloviza.com, you acknowledge that you have read, understood, and agree to be bound by these Terms.
For questions, contact us at: 📧 hello@helloviza.com`;

// Helper: collapse multiple blank lines so <pre> doesn’t create big gaps
const compact = (s) => s.replace(/\n{2,}/g, "\n");

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Responsive mobile style */}
      <style>{`
        @media (max-width: 600px) {
          .hv-terms-wrap {
            margin: 24px 0 0 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 18px 6vw 24px 6vw !important;
            max-width: 100vw !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .hv-terms-title { font-size: 2.1rem !important; padding-top: 0.7rem !important; }
          .hv-terms-section h2 { font-size: 1.07rem !important; margin-bottom: 9px !important; margin-top: 22px !important; }
          .hv-terms-section pre { font-size: 0.98rem !important; line-height: 1.45 !important; white-space: pre-wrap !important; }
        }
      `}</style>

      <div
        className="hv-terms-wrap max-w-3xl mx-auto bg-white rounded-2xl shadow-xl"
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
        <h1
          className="hv-terms-title"
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
          Terms of Service – Helloviza.com
        </h1>

        {/* Intro line directly under H1 */}
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

        <div>
          {sections.map((section, idx) => (
            <section
              key={idx}
              className="hv-terms-section"
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

        {/* Closing block */}
        <pre
          style={{
            fontFamily: baseFont,
            color: "#00477f",
            fontSize: "1.02rem",
            lineHeight: 1.45,
            marginTop: "12px",
            whiteSpace: "pre-wrap",
            textAlign: "center",
          }}
        >
          {compact(closingBlock)}
        </pre>
      </div>
    </div>
  );
}
