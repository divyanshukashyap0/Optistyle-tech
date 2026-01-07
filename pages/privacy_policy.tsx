import React from "react";
const API_URL = import.meta.env.VITE_API_URL;

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">
        Privacy Policy – OptiStyle
      </h1>

      <p className="mb-4 text-sm text-gray-600">
        Effective Date: <strong>[Add Date]</strong>
      </p>

      <p className="mb-6">
        OptiStyle – Premium Optical & Eye-Care Platform respects your privacy.
        This Privacy Policy explains how we collect, use, store, and protect
        your personal information when you use our website and services.
      </p>

      {/* 1 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          1. Information We Collect
        </h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Full name, email address, phone number</li>
          <li>Billing and shipping address</li>
          <li>Login details via email, OTP, or third-party services</li>
          <li>Eye prescription and lens preferences (if provided)</li>
          <li>Order and transaction details</li>
          <li>Device, browser, IP address, and usage data</li>
        </ul>
      </section>

      {/* 2 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Process and deliver your order</li>
          <li>Verify prescriptions and customize lenses</li>
          <li>Send order updates and service notifications</li>
          <li>Improve website performance and user experience</li>
          <li>Provide customer support</li>
          <li>Prevent fraud and unauthorized access</li>
        </ul>
      </section>

      {/* 3 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Payments
        </h2>
        <p>
          OptiStyle does not store card, UPI, or banking details. All payments
          are securely processed through certified third-party payment gateways.
        </p>
      </section>

      {/* 4 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. Cookies & Tracking
        </h2>
        <p>
          We use cookies to maintain login sessions, store cart data, analyze
          traffic, and improve website functionality. You may disable cookies
          in your browser, but some features may not work correctly.
        </p>
      </section>

      {/* 5 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          5. Data Sharing
        </h2>
        <p>
          We do not sell or rent your personal information. Data may be shared
          only with trusted service providers such as payment processors,
          delivery partners, and cloud services, strictly for operational
          purposes or legal compliance.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          6. Data Security
        </h2>
        <p>
          We use industry-standard security measures including HTTPS
          encryption, secure authentication, restricted admin access, and
          regular monitoring to protect user data.
        </p>
      </section>

      {/* 7 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          7. Your Rights
        </h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Access and update your personal information</li>
          <li>Request account deletion</li>
          <li>Withdraw marketing consent</li>
        </ul>
      </section>

      {/* 8 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          8. Children’s Privacy
        </h2>
        <p>
          OptiStyle does not knowingly collect personal data from children under
          13 years of age. Any such data will be removed immediately.
        </p>
      </section>

      {/* 9 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          9. Policy Updates
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with a revised effective date.
        </p>
      </section>

      {/* 10 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          10. Contact Us
        </h2>
        <p>
          <strong>OptiStyle – Customer Support</strong><br />
          Email: support@optistyle.com <br />
          Phone: +91-XXXXXXXXXX <br />
          Address: [Your Business Address]
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
