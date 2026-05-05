import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — HeatPumpClarity",
  description: "Terms governing your use of HeatPumpClarity.com.",
};

export default function TermsPage() {
  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <article className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: May 4, 2026</p>

          <p>These Terms of Service (&ldquo;Terms&rdquo;) govern your use of HeatPumpClarity.com (the &ldquo;Site&rdquo;), operated by <strong>Stable Ventures LLC</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;), a New York limited liability company. By using the Site, you agree to these Terms. If you do not agree, do not use the Site.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1. What the Site does</h2>
          <p className="text-gray-700">HeatPumpClarity provides estimates of New York State Clean Heat Program incentives based on information you provide through our eligibility wizard. We are an independent tool. <strong>We are not operated by, affiliated with, or endorsed by NYSERDA, the New York State Public Service Commission, or any participating utility.</strong></p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2. Estimates are not guarantees</h2>
          <p className="text-gray-700">Incentive amounts displayed by the Site are <strong>estimates</strong> based on program rules published in the NYS Clean Heat Heat Pump Program Manual and applicable utility incentive tables. Final eligibility, amounts, and approval depend on:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Your specific project details</li>
            <li>Review by your participating utility and its implementation contractor</li>
            <li>Program rules in effect at the time your application is submitted</li>
            <li>Your contractor&apos;s qualifications and the project&apos;s compliance with program technical requirements</li>
          </ul>
          <p className="text-gray-700 mt-3">The Site&apos;s estimates are <strong>not</strong> a contract, offer, guarantee, or representation of any specific incentive amount. <strong>You must confirm eligibility and final amounts with a participating contractor and your utility before making any purchasing decisions.</strong></p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3. Contractor referrals</h2>
          <p className="text-gray-700">The Site may connect you with participating contractors. We do not verify, guarantee, or warrant the licensing, insurance, qualifications, or quality of work of any contractor listed or referenced. Your relationship with any contractor is solely between you and that contractor. You are responsible for verifying contractor credentials and for any contracts you enter into.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">4. Acceptable use</h2>
          <p className="text-gray-700">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Use the Site for any unlawful purpose</li>
            <li>Submit false, misleading, or fraudulent information</li>
            <li>Attempt to access accounts, data, or systems you are not authorized to access</li>
            <li>Interfere with the Site&apos;s operation, security, or other users&apos; use of it</li>
            <li>Use automated tools (scrapers, bots) to extract data from the Site</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">5. Contractor accounts</h2>
          <p className="text-gray-700">If you create a contractor account, you are responsible for:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>The accuracy of all information you submit</li>
            <li>The security of your login credentials</li>
            <li>Your treatment of customer personal information you store on the Site, including compliance with the New York SHIELD Act and other applicable privacy laws</li>
          </ul>
          <p className="text-gray-700 mt-3">You agree to obtain appropriate consent from your customers before storing their information on the Site.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">6. Intellectual property</h2>
          <p className="text-gray-700">Site content (excluding NYSERDA program information and other public program materials) is owned by Stable Ventures LLC. You may not copy, redistribute, modify, or build derivative products or services based on the Site without our prior written permission.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">7. Disclaimer of warranties</h2>
          <p className="text-gray-700 uppercase font-medium">THE SITE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE.&rdquo; TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">8. Limitation of liability</h2>
          <p className="text-gray-700 uppercase font-medium">TO THE FULLEST EXTENT PERMITTED BY LAW, STABLE VENTURES LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM OR RELATING TO YOUR USE OF THE SITE. OUR TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED ONE HUNDRED DOLLARS ($100) OR THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM, WHICHEVER IS GREATER.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">9. Governing law and venue</h2>
          <p className="text-gray-700">These Terms are governed by the laws of the State of New York, without regard to conflict-of-law principles. Any dispute arising from or relating to these Terms or the Site shall be resolved exclusively in the state or federal courts located in <strong>Westchester County, New York</strong>, and you consent to personal jurisdiction in those courts.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">10. Changes to these Terms</h2>
          <p className="text-gray-700">We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent version. Continued use of the Site after changes constitutes acceptance of the updated Terms.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">11. Contact</h2>
          <address className="not-italic text-gray-700 mt-2">
            <strong>Stable Ventures LLC</strong><br />
            7014 13th Avenue, Suite 202<br />
            Brooklyn, NY 11228<br />
            <a href="mailto:support@heatpumpclarity.com" className="text-[#2563eb] hover:underline">support@heatpumpclarity.com</a>
          </address>
        </article>
      </div>
    </div>
  );
}
