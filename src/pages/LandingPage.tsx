import React from 'react';
import { Navbar, Footer } from '../components/Layout';
import { HeroSection } from '../components/HeroSection';
import { MainFeatures } from '../components/MainFeatures';
import { FeaturesGrid, InteractiveDemo } from '../components/DetailsSection';
import { ComparisonTable, Testimonials, FAQ } from '../components/ComparisonFAQ';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      <HeroSection />
      <MainFeatures />
      <FeaturesGrid />
      <InteractiveDemo />
      <ComparisonTable />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
