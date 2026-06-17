import React from 'react';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import FAQ from '../components/home/FAQ';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070A13]">
      <Hero />
      <Stats />
      <div className="border-t border-gray-900/60 bg-[#070A13]">
        <FAQ />
      </div>
    </div>
  );
}
