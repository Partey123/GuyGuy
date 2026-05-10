import { useEffect } from "react";
import MarketingLayout from "@/components/layout/MarketingLayout";

export default function Terms() {
  useEffect(() => { document.title = "Terms of service — GuyGuy"; }, []);
  return (
    <MarketingLayout title="Terms of service" subtitle="Last updated: May 2026">
      <p>By using GuyGuy you agree to the following terms. This is a plain-language summary — full legal terms will be published before public launch.</p>
      <h2>Using the platform</h2>
      <p>You must be 18+ and able to enter a contract under Ghanaian law. You agree to use GuyGuy lawfully and in good faith.</p>
      <h2>Bookings & escrow</h2>
      <p>Payments are held in escrow until you confirm work is complete or 48 hours pass after the artisan marks it done. Disputes are mediated by GuyGuy.</p>
      <h2>Commission</h2>
      <p>GuyGuy charges 10% commission on labour. Materials are passed through to artisans 1:1.</p>
      <h2>Account termination</h2>
      <p>We may suspend or terminate accounts that violate these terms or engage in fraud, harassment, or unsafe behaviour.</p>
      <h2>Liability</h2>
      <p>GuyGuy is a marketplace. We vet artisans but do not perform the work itself. Quality and outcomes are between client and artisan, with our dispute process as backstop.</p>
    </MarketingLayout>
  );
}
