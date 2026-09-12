import LegalPageLayout from './LegalPageLayout';

export default function Terms() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="July 2026">
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the LOKAH BUILDERS &amp; DEVELOPERS PVT LTD website ("the Site"), you agree to be
          bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue
          use of the Site.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">2. Property Listings &amp; Information</h2>
        <p>
          Property details, pricing, availability, and imagery displayed on the Site are indicative and subject to
          change without prior notice. Final terms are governed exclusively by the executed sale agreement between
          LOKAH BUILDERS &amp; DEVELOPERS PVT LTD and the purchaser.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">3. Bookings &amp; Consultations</h2>
        <p>
          Submitting a site visit or consultation request through the Site does not constitute a binding
          reservation or contractual obligation. All bookings are confirmed only upon direct communication with
          our sales team.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">4. Intellectual Property</h2>
        <p>
          All content on this Site, including text, graphics, logos, and images, is the property of LOKAH BUILDERS
          &amp; DEVELOPERS PVT LTD and may not be reproduced without written consent.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">5. Limitation of Liability</h2>
        <p>
          LOKAH BUILDERS &amp; DEVELOPERS PVT LTD shall not be liable for any indirect, incidental, or consequential
          damages arising from the use of, or inability to use, the Site.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">6. Governing Law</h2>
        <p>
          These Terms are governed by the laws of India, and any disputes shall be subject to the exclusive
          jurisdiction of the courts of Kochi, Kerala.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">7. Contact</h2>
        <p>
          Questions about these Terms can be directed to our team via the details listed on our Contact page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
