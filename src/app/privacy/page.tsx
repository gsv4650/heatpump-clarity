import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — HeatPumpClarity",
  description: "How HeatPumpClarity collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <article className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: May 4, 2026</p>

          <p>HeatPumpClarity (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) is operated by <strong>Stable Ventures LLC</strong>, a New York limited liability company. This Privacy Policy describes what information we collect through HeatPumpClarity.com (the &ldquo;Site&rdquo;), how we use it, and your rights regarding that information.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1. Information we collect</h2>

          <p><strong>When you use the eligibility wizard:</strong></p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Email address</li>
            <li>Optionally: name, phone number, ZIP code, electric utility, and the type of heat pump project you&apos;re interested in</li>
          </ul>

          <p className="mt-4"><strong>When you use the contractor dashboard:</strong></p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>The information you provide about projects, which may include your customers&apos; names, addresses, phone numbers, project details, and uploaded documents (signed agreements, permits, photos, invoices)</li>
          </ul>

          <p className="mt-4"><strong>Automatically collected when you visit the Site:</strong></p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Standard server log information including IP address, browser type, pages visited, and referral source. This is collected by our hosting provider (Vercel) for security and operational purposes.</li>
            <li>Product analytics events (page views, anonymized clicks) collected by PostHog. We have explicitly disabled session recording, do not capture input field contents, and honor the Do Not Track browser setting. PostHog does not collect personally identifiable information from form fields.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2. How we use information</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>To respond to eligibility inquiries and connect homeowners with participating contractors in their utility territory</li>
            <li>To operate the contractor dashboard and project tracking tools</li>
            <li>To send updates about the NYS Clean Heat program when relevant to your inquiry</li>
            <li>To improve the Site and our services</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3. How we share information</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li><strong>With contractors</strong> when a homeowner requests to be connected with one through the eligibility wizard</li>
            <li><strong>With our service providers</strong> (Supabase for data storage, Vercel for hosting, PostHog for product analytics) under contracts requiring them to protect the information</li>
            <li><strong>When required by law,</strong> subpoena, court order, or other legal process</li>
            <li><strong>We do not sell personal information to third parties.</strong></li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">4. Data security</h2>
          <p className="text-gray-700">We use commercially reasonable safeguards consistent with the New York SHIELD Act, including encrypted data transmission (HTTPS), access controls on our database, and ongoing review of our security practices. No system is perfectly secure, and we cannot guarantee absolute security against unauthorized access.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">5. Data retention</h2>
          <p className="text-gray-700">We retain inquiry information (eligibility wizard submissions) for as long as needed to serve your request and for a reasonable period afterward for record-keeping. Contractor dashboard data is retained while the contractor account is active and for a reasonable period after closure for legal, accounting, and operational purposes.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">6. Your rights</h2>
          <p className="text-gray-700">You can request access to, correction of, or deletion of your personal information by emailing <strong>support@heatpumpclarity.com</strong>. We will respond within 30 days. New York residents have additional rights under the New York SHIELD Act and other applicable state law.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">7. Children</h2>
          <p className="text-gray-700">The Site is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us with personal information, please contact us at the address below and we will delete it.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">8. Changes to this Policy</h2>
          <p className="text-gray-700">We may update this Policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent version. Material changes will be communicated through the Site.</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">9. Contact</h2>
          <p className="text-gray-700">Questions about this Policy or your information:</p>
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
