import { useEffect } from "react";
import MarketingLayout from "@/components/layout/MarketingLayout";

export default function Privacy() {
  useEffect(() => { document.title = "Privacy policy — GuyGuy"; }, []);
  return (
    <MarketingLayout title="Privacy policy" subtitle="Last updated: May 2026">
      <p>We collect only what we need to make GuyGuy work for you. Plain-language summary below.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Account info: name, phone, email (optional), avatar</li>
        <li>Booking info: job details, address, MoMo number for payouts</li>
        <li>Usage info: pages visited, search queries, device type</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To match clients with artisans</li>
        <li>To process payments and payouts</li>
        <li>To improve the product and prevent fraud</li>
      </ul>
      <h2>Who we share it with</h2>
      <p>We never sell your data. We share only with payment partners (MoMo providers), with the counter-party in a booking (limited to what's needed to complete the job), and with authorities if legally required.</p>
      <h2>Your rights</h2>
      <p>You can export or delete your account data at any time. Email <a href="mailto:privacy@guyguy.com.gh">privacy@guyguy.com.gh</a>.</p>
    </MarketingLayout>
  );
}
