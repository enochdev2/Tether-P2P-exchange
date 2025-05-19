import React from 'react';

// Footer data
const footerData = [
  {
    title: 'Trade crypto',
    links: ['Buy Tether', 'Buy USDC', 'Sell Tether', 'Sell USDC'],
  },
  {
    title: 'About TetherZone',
    links: ['About us', 'Careers', 'Blog', 'Reviews'],
  },
  {
    title: 'Useful links',
    links: ['TetherZone Wallet', 'Support', 'Calculator', 'Peer-to-Peer Market Prices'],
  },
  {
    title: 'Legal',
    links: ['Terms & Conditions', 'Policy', 'Privacy Notice', 'Cookie Policy'],
  },
];

const Footers = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Footer Sections */}
          {footerData.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i} className="text-sm hover:text-green-500">
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media Icons */}
          <div className="flex justify-start space-x-4 mt-">
            <a href="#" className="text-white hover:text-green-500">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-white hover:text-green-500">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white hover:text-green-500">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="text-white hover:text-green-500">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-white hover:text-green-500">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 flex justify-between items-center">
          <p className="text-sm">
            Effortlessly exchange with complete transparency, security, and convenience. Your journey to financial freedom starts here.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="bg-green-700 text-white py-2 px-6 rounded-md">
              Download on <span className="hidden sm:inline">iOS</span>
            </a>
            <a href="#" className="bg-green-700 text-white py-2 px-6 rounded-md">
              Download on <span className="hidden sm:inline">Android</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footers;
