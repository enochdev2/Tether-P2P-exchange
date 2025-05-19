import React from 'react';

const footerData = {
  forYou: [
    { to: "#", label: "Buy Tether" },
    { to: "#", label: "Sell Tether" },
  ],
  growth: [
    { to: "#", label: "Paxful Rewards Program" },
    { to: "#", label: "Paxful Trader Program" },
    { to: "#", label: "VIP Program T&C" },
    { to: "#", label: "Community" },
  ],
  usefulLinks: [
    { to: "#", label: "Bitcoin Calculator" },
    { to: "#", label: "Peer-to-Peer Market Prices" },
  ],
  aboutTetherZone: [
    { to: "#", label: "About Us" },
    { to: "#", label: "Business Contacts" },
    { to: "#", label: "Careers" },
    { to: "#", label: "Tether Zone Blog" },
  ],
  legal: [
    { to: "#", label: "Terms & Conditions" },
    { to: "#", label: "Privacy Notice" },
    { to: "#", label: "Cookie Policy" },
    // { to: "#", label: "Restricted Countries" },
  ],
};

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8=">
          {/* For You Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-500">For You</h3>
            <ul>
              {footerData.forYou.map((item, index) => (
                <li key={index}>
                  <a href={item.to} className="block py-1 hover:text-green-400">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Growth Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-500">Growth</h3>
            <ul>
              {footerData.growth.map((item, index) => (
                <li key={index}>
                  <a href={item.to} className="block py-1 hover:text-green-400">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Paxful Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-500">About Tether Zone</h3>
            <ul>
              {footerData.aboutTetherZone.map((item, index) => (
                <li key={index}>
                  <a href={item.to} className="block py-1 hover:text-green-400">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

           {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-500">Legal</h3>
            <ul>
              {footerData.legal.map((item, index) => (
                <li key={index}>
                  <a href={item.to} className="block py-1 hover:text-green-400">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {/* Useful Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-500">Useful Links</h3>
            <ul>
              {footerData.usefulLinks.map((item, index) => (
                <li key={index}>
                  <a href={item.to} className="block py-1 hover:text-green-400">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        
        </div>
      </div>
    </footer>
  );
}

export default Footer;
