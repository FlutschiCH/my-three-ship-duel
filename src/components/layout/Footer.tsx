import React from 'react';

export const Footer = () => {
  return (
    // Applying GLASS, RADIUS, and TYPOGRAPHY tokens to the Footer container.
    <footer className="flex justify-center p-6 mt-12">
      <div className="bg-sky-950/20 border border-sky-400/10 backdrop-blur-xl w-full max-w-7xl px-6 py-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between text-center md:text-left text-white/70 tracking-tight font-medium text-sm">
        <p>&copy; {new Date().getFullYear()} SereneMind Connect. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
