'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Terms & Conditions
        </h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Last Updated: February 22, 2026 | Version 1.0
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Recap CA AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily access the Service for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
            </p>
            <p className="mt-4">Under this license you may not:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer the materials to another person</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Subscription Plans</h2>
            <p>
              Recap CA AI offers FREE and PAID subscription plans. By subscribing to a paid plan, you agree to pay the fees associated with that plan.
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>FREE Plan: 10 questions total, 6 months validity</li>
              <li>BASIC Plan: ₹399/month, 30 questions per day</li>
              <li>PRO Plan: ₹799/3 months, 30 questions per day</li>
              <li>PREMIUM Plan: ₹1699/9 months, 30 questions per day</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
            <p>
              All payments are processed securely through Razorpay. By making a payment, you agree to Razorpay's terms and conditions.
            </p>
            <p className="mt-4">
              Subscription fees are non-refundable except as required by law or as specified in our Refund Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Content Accuracy</h2>
            <p>
              While we strive to provide accurate information, Recap CA AI is an AI-powered study assistant and should not be considered a substitute for official CA study materials or professional advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>
              Recap CA AI shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice, for any breach of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              Email: recapca6@gmail.com
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
