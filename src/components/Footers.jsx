import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const footerData = [
  {
    title: "Trade crypto",
    // links: ["Buy Tether", "Buy USDC", "Sell Tether", "Sell USDC"],
  },
  {
    title: "Sell Tether",
    // links: ["About us", "Careers", "Blog", "Reviews"],
  },
  {
    title: "Buy Tether",
    // links: [
    //   "TetherZone Wallet",
    //   "Support",
    //   "Calculator",
    //   "Peer-to-Peer Market Prices",
    // ],
  },
  {
    title: "Support",
    // links: ["Terms & Conditions", "Policy", "Privacy Notice", "Cookie Policy"],
  },
];

const Footers = () => {
  return (
    <footer className="bg-gray-900 text-white py-14 px-6 sm:px-12">
      <div className="max-w-screen-xl mx-auto">
        {/* Footer Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {footerData.map((section, index) => (
            <div key={index}>
              <h3 className="text-xl  border-r-2 font-semibold mb-5">{section.title}</h3>
              {/* <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-green-500 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul> */}
            </div>
          ))}

          {/* Social Media */}
          {/* <div className="mt-8 sm:mt-0 flex flex-col">
            <h3 className="text-xl font-semibold mb-5">Follow Us</h3>
            <div className="flex space-x-6 text-gray-300">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-green-500 transition-colors duration-300"
              >
                <FaFacebookF size={22} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-green-500 transition-colors duration-300"
              >
                <FaTwitter size={22} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-green-500 transition-colors duration-300"
              >
                <FaLinkedinIn size={22} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-green-500 transition-colors duration-300"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="hover:text-green-500 transition-colors duration-300"
              >
                <FaYoutube size={22} />
              </a>
            </div>
          </div> */}
        </div>

        {/* Footer Bottom */}
        <div className="mt-4 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-center sm:text-left text-sm max-w-lg">
            Effortlessly exchange with complete transparency, security, and
            convenience. Your journey to financial freedom starts here.
          </p>
          {/* <div className="flex space-x-4">
            <a
              href="#"
              className="bg-green-800 hover:bg-green-700 transition-colors duration-300 text-white py-3 px-6 rounded-md text-sm font-medium"
            >
              Download on <span className="hidden sm:inline">iOS</span>
            </a>
            <a
              href="#"
              className="bg-green-800 hover:bg-green-700 transition-colors duration-300 text-white py-3 px-6 rounded-md text-sm font-medium"
            >
              Download on <span className="hidden sm:inline">Android</span>
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footers;
