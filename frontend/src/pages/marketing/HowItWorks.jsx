import { useEffect } from "react";
import MarketingLayout from "@/components/layout/MarketingLayout";

export default function HowItWorks() {
  useEffect(() => { document.title = "How it works — GuyGuy"; }, []);
  return (
    <MarketingLayout title="How GuyGuy works" subtitle="Three simple steps from search to done.">
      <h2>1. Search & request</h2>
      <p>Browse vetted artisans by trade, area, rating and price. Send a booking request with the job details and your address.</p>
      <h2>2. Pay into escrow</h2>
      <p>Once the artisan accepts, you pay through MoMo. Funds sit safely in escrow — the artisan starts the job knowing they'll be paid.</p>
      <h2>3. Approve & release</h2>
      <p>When the work is done to your satisfaction, tap release. Payment lands in the artisan's MoMo instantly. Disputes are mediated within 24 hours.</p>
      <h2>What we charge</h2>
      <p>10% commission on labour only — never on materials. Artisans keep 90% of every job.</p>
    </MarketingLayout>
  );
}
