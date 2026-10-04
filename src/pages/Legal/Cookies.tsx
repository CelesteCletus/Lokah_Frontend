import LegalPageLayout from './LegalPageLayout';

export default function Cookies() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="July 2026">
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">1. What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your device that help websites function properly and remember
          your preferences between visits.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">2. How We Use Cookies</h2>
        <p>
          This Site uses essential cookies and local browser storage to keep the admin session secure, remember
          your interaction with our AI Concierge, and ensure core site functionality works as intended.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">3. Managing Cookies</h2>
        <p>
          Most web browsers allow you to control cookies through their settings. Disabling essential cookies may
          affect the functionality of certain features, such as the admin dashboard.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">4. Third-Party Cookies</h2>
        <p>
          We do not knowingly use third-party advertising or tracking cookies on this Site.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">5. Contact</h2>
        <p>
          For questions about our use of cookies, please reach out via our Contact page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
