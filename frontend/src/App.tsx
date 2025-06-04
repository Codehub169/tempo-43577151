import React from 'react';

function App() {
  // Basic structure, will be expanded with Router and Layout
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4 selection:bg-primary-500 selection:text-white">
      <header className="py-8 text-center">
        <h1 className="text-4xl font-bold text-primary-600 font-poppins sm:text-5xl md:text-6xl">
          Welcome to ProCRM
        </h1>
        <p className="text-lg text-neutral-600 mt-3 font-inter sm:text-xl">
          The modern CRM solution for Indian IT Companies.
        </p>
      </header>
      <main className="mt-6">
        <p className="text-neutral-700 font-inter text-center">
          Application content will be rendered here. Get ready for an amazing experience!
        </p>
      </main>
      <footer className="mt-12 text-center text-sm text-neutral-500 font-inter">
        <p>&copy; {new Date().getFullYear()} ProCRM. All rights reserved.</p>
        <p>Built with ❤️ for efficiency.</p>
      </footer>
    </div>
  );
}

export default App;
