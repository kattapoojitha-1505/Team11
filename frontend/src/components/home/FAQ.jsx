import React, { useState } from 'react';

const FAQ_ITEMS = [
  {
    question: "What is Nimbus Sandbox hosting?",
    answer: "Nimbus provides isolated, ephemeral containers that host developer tools, scripts, and microservice APIs. It allows developers to showcase functioning, live instances of their software rather than static code repositories."
  },
  {
    question: "How do I configure my live demo sandbox links?",
    answer: "When publishing a project, you can specify an optional Live Demo URL. This links your project details card directly to your hosted microservice or client interface, allowing visitors to inspect it instantly."
  },
  {
    question: "Is there a size or resource limit for project uploads?",
    answer: "To ensure cluster availability, individual sandbox images are capped at 500MB and file uploads for banners are limited to 5MB. Container nodes are allotted 256MB of RAM under standard quotas."
  },
  {
    question: "Can I modify my deployment settings after publishing?",
    answer: "Yes, you can edit any published module's parameters (title, description, tags, and category) from your developer Console. Changes propagate to the catalog instantly."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-left">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-white tracking-tight">Frequently Answered Queries</h2>
        <p className="text-gray-400 text-sm mt-1.5">Common configurations and specifications regarding our container environments.</p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div
              key={idx}
              className="bg-[#111827]/30 border border-gray-900 rounded-2xl overflow-hidden hover:border-gray-800 transition-colors duration-250"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between px-6 py-5 focus:outline-none text-left"
              >
                <span className="text-sm sm:text-base font-bold text-gray-200 hover:text-white transition-colors duration-200">
                  {item.question}
                </span>
                <span className="text-xl text-indigo-400 ml-4 font-mono font-bold">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-sm text-gray-450 leading-relaxed border-t border-gray-900/60 pt-4 text-gray-400">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
