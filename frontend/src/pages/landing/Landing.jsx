import React from 'react';
import { Button } from '../components/common/Button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-offwhite">
      {/* Hero Section */}
      <section className="bg-navy text-offwhite py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            The right guy.<br />Every time.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-offwhite/90">
            Connect with verified skilled artisans in Ghana. Reliable, fair, and protected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-amber text-navy hover:bg-amber/90">
              Find an Artisan
            </Button>
            <Button variant="outline" className="border-offwhite text-offwhite hover:bg-offwhite hover:text-navy">
              Become an Artisan
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-navy mb-6">
            The Problem
          </h2>
          <p className="text-lg text-darkgrey mb-8">
            Finding a reliable skilled tradesperson in Ghana is entirely word of mouth.
            There is no vetting, no price transparency, no accountability, and no protection when things go wrong.
          </p>
          <p className="text-lg text-darkgrey">
            GuyGuy changes that.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4 bg-navy text-offwhite">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">
            The Solution
          </h2>
          <p className="text-lg mb-8">
            A two-sided marketplace connecting clients with verified artisans.
            Featuring escrow payments, reputation systems, and professional profiles.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Verified Artisans</h3>
              <p>Every artisan is vetted and verified before joining the platform.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Secure Payments</h3>
              <p>Escrow system protects both clients and artisans from payment issues.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Build Reputation</h3>
              <p>Artisans earn badges and ratings that become their professional identity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-amber text-navy">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg mb-8">
            Join GuyGuy today and experience reliable skilled services in Ghana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-navy text-offwhite hover:bg-navy/90">
              Sign Up as Client
            </Button>
            <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-offwhite">
              Register as Artisan
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;