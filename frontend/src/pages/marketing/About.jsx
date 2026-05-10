import { useEffect } from "react";
import MarketingLayout from "@/components/layout/MarketingLayout";

export default function About() {
  useEffect(() => { document.title = "About — GuyGuy"; }, []);
  return (
    <MarketingLayout
      title="About GuyGuy"
      subtitle="A trust layer for Ghana's skilled trades."
    >
      <p>
        GuyGuy was built in Kumasi to solve a problem every Ghanaian household knows:
        finding a skilled, reliable artisan you can actually trust. From a wobbly fan
        to bridal makeup, we connect you to vetted local pros — backed by reviews,
        fair pricing, and escrow-protected payments.
      </p>
      <h2>Our mission</h2>
      <p>
        Raise the floor for skilled trades across Ghana. We give artisans a real digital
        identity, real reviews, and a real income stream — and give clients the
        confidence to hire without guesswork.
      </p>
      <h2>Where we are</h2>
      <p>
        Launching in Kumasi first. Accra, Takoradi and Tamale follow.
      </p>
    </MarketingLayout>
  );
}
