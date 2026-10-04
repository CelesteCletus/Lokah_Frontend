import LegalPageLayout from './LegalPageLayout';

export default function Privacy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="July 2026">
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">1. Information We Collect</h2>
        <p>
          When you submit a booking form, consultation request, brochure download, or job application, we collect
          the information you provide directly, such as your name, phone number, email address, and, where
          applicable, your resume.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">2. How We Use Your Information</h2>
        <p>
          We use this information to respond to enquiries, schedule site visits and consultations, process job
          applications, and share relevant property updates. We do not sell your personal information to third
          parties.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">3. Data Retention</h2>
        <p>
          We retain enquiry, booking, and application data only for as long as necessary to fulfil the purpose it
          was collected for, or as required by applicable law.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">4. Data Security</h2>
        <p>
          We take reasonable technical and organisational measures to protect your information against
          unauthorized access, alteration, or disclosure.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">5. Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal information at any time by
          contacting our team through the Contact page.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-ivory-50 mb-3">6. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be reflected on this page with an
          updated revision date.
        </p>
      </section>
    </LegalPageLayout>
  );
}
