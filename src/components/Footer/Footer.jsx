import React from "react";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  Instagram,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";

import logo from "../../assets/Images/3x/navbar.png";

const colors = {
  primary: "#333e2c",
  secondary: "#475569",
  footerBg: "#e8e4dd",
  textSecondary: "black",
  inputBg: "transparent",
};

const Footer = () => {
  return (
    <footer
      className="w-full p-12"
      style={{ backgroundColor: colors.footerBg }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-700 pb-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Call Us */}
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full border border-dotted border-gray-600">
              <Phone size={25} className="text-[#353535]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#353535]">Call Us 7/24</h4>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                66511123
              </p>
            </div>
          </div>

          {/* Make a Quote */}
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full border border-dotted border-gray-600">
              <Mail size={25} className="text-[#353535]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#353535]">Make a Quote</h4>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                example@gmail.com
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full border border-dotted border-gray-600">
              <MapPin size={25} className="text-[#353535]" />
            </div>
            <a href="https://maps.app.goo.gl/DV95vcWCubMko3v68" target="_blank" rel="noopener noreferrer" className="flex flex-col">
              <h4 className="text-sm font-medium text-[#353535]">Location</h4>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Street 2, 70073, Kuwait.
              </p>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="logo" width={200} draggable={false} />
            {/* Opening Hour */}
          <div className="flex flex-col items-start my-6 gap-3">
            <div className="p-4 rounded-full border border-dotted border-gray-600">
              <Clock size={25} className="text-[#353535]" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-[#353535]">Opening Hour</h4>
              <p className="text-md" style={{ color: colors.textSecondary }}>
                Saturday to Thursday <br /> Morning time: 10 am - 1 pm <br /> Evening time: 5pm
                - 9:30pm <br /> Friday <br /> Evening time: 5pm - 9:30pm
              </p>
            </div>
          </div>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/lesoukkuwait/"
                target="_blank"
                className="px-2 py-3 border border-gray-600 hover:bg-gray-700 transition duration-200"
              >
                <Instagram size={25} className="text-[#353535]" />
              </a>
              <a
                href="https://www.tiktok.com/@lesoukkuwaitt?_t=ZS-8xIuzd6zmE5&_r=1"
                target="_blank"
                className="px-2 py-3 border border-gray-600 hover:bg-gray-700 transition duration-200"
              >
                <FaTiktok size={25} className="text-[#353535]" />
              </a>
            </div>
          </div>

          {/* Costumers Support */}
          <div>
            <h3 className="relative inline-block text-[#353535] font-bold text-2xl after:content-[''] after:absolute after:top-[36px] after:left-[45px] after:w-[60px] after:h-[2px] after:bg-white/80">
              Costumers Support
              <div className="w-[30px] h-[2px] bg-[#333e2c] mb-5 mt-1"></div>
            </h3>
            <ul className="space-y-2">
              {[
                "Store List",
                "Opening Hours",
                "Contact Us",
                "Return Policy",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm flex items-center hover:translate-x-1.5 transition-all duration-200"
                    style={{ color: colors.textSecondary }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = colors.primary)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = colors.textSecondary)
                    }
                  >
                    <span className="mr-2">&gt;</span> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="relative inline-block text-[#353535] font-bold text-2xl after:content-[''] after:absolute after:top-[36px] after:left-[45px] after:w-[60px] after:h-[2px] after:bg-white/80">
              Quick Links
              <div className="w-[30px] h-[2px] bg-[#333e2c] mb-5 mt-1"></div>
            </h3>
            <ul className="space-y-2">
              {["About Us", "Testimonial", "Faq", "Blog"].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm flex items-center hover:translate-x-1.5 transition-all duration-200"
                    style={{ color: colors.textSecondary }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = colors.primary)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = colors.textSecondary)
                    }
                  >
                    <span className="mr-2">&gt;</span> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="relative inline-block text-[#353535] font-bold text-2xl after:content-[''] after:absolute after:top-[36px] after:left-[45px] after:w-[60px] after:h-[2px] after:bg-white/80">
              newsletter
              <div className="w-[30px] h-[2px] bg-[#333e2c] mb-5 mt-1"></div>
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              Sign up to searing weekly newsletter to get the latest updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                className="w-full px-4 py-2 text-sm text-[#353535] rounded-l-md focus:outline-none focus:ring-1 focus:ring-offset-green-900 transition duration-200"
                style={{ backgroundColor: colors.inputBg ,borderBlockColor:"#353535" }}
              />
              <button
                className="px-4 py-2 rounded-r-md cursor-pointer"
                style={{ backgroundColor: colors.primary }}
              >
                <Send size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-gray-700 text-center">
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          © ALL Copyright 2024 by Le-Souk
        </p>
      </div>
    </footer>
  );
};

export default Footer;
