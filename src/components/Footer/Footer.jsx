import React from "react";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Send,
  ChevronUp,
} from "lucide-react";

// متغير الألوان
const colors = {
  primary: "#1e70d0",
  secondary: "#475569",
  footerBg: "#1b2639",
  textSecondary: "#a0aec0",
  inputBg: "#2d3748",
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
              <Phone size={25} className="text-white" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Call Us 7/24</h4>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                +208-555-0112
              </p>
            </div>
          </div>

          {/* Make a Quote */}
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full border border-dotted border-gray-600">
              <Mail size={25} className="text-white" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Make a Quote</h4>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                example@gmail.com
              </p>
            </div>
          </div>

          {/* Opening Hour */}
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full border border-dotted border-gray-600">
              <Clock size={25} className="text-white" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Opening Hour</h4>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Sunday - Fry: 9 AM - 6 PM
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full border border-dotted border-gray-600">
              <MapPin size={25} className="text-white" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Location</h4>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                4517 Washington ave.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: colors.primary }}
            >
              Bazario
            </h3>
            <p className="text-sm mb-6" style={{ color: colors.textSecondary }}>
              Phasellus ultricies aliqum volutpt utpat ullamcorper laoreet
              neque, a lacinia curabitur lacinia mollis
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="px-2 py-3 border border-gray-600 hover:bg-gray-700 transition duration-200"
              >
                <Facebook size={25} className="text-white" />
              </a>
              <a
                href="#"
                className="px-2 py-3 border border-gray-600 hover:bg-gray-700 transition duration-200"
              >
                <Twitter size={25} className="text-white" />
              </a>
              <a
                href="#"
                className="px-2 py-3 border border-gray-600 hover:bg-gray-700 transition duration-200"
              >
                <Youtube size={25} className="text-white" />
              </a>
              <a
                href="#"
                className="px-2 py-3 border border-gray-600 hover:bg-gray-700 transition duration-200"
              >
                <Linkedin size={25} className="text-white" />
              </a>
            </div>
          </div>

          {/* Costumers Support */}
          <div>
            <h3 className="relative inline-block text-white font-bold text-2xl after:content-[''] after:absolute after:top-[36px] after:left-[45px] after:w-[60px] after:h-[2px] after:bg-white/80">
              Costumers Support
              <div className="w-[30px] h-[2px] bg-[#1A76D1] mb-5 mt-1"></div>
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
            <h3 className="relative inline-block text-white font-bold text-2xl after:content-[''] after:absolute after:top-[36px] after:left-[45px] after:w-[60px] after:h-[2px] after:bg-white/80">
              Quick Links
              <div className="w-[30px] h-[2px] bg-[#1A76D1] mb-5 mt-1"></div>
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
            <h3 className="relative inline-block text-white font-bold text-2xl after:content-[''] after:absolute after:top-[36px] after:left-[45px] after:w-[60px] after:h-[2px] after:bg-white/80">
              newsletter
              <div className="w-[30px] h-[2px] bg-[#1A76D1] mb-5 mt-1"></div>
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              Sign up to searing weekly newsletter to get the latest updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                className="w-full px-4 py-2 text-sm text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-200"
                style={{ backgroundColor: colors.inputBg }}
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
