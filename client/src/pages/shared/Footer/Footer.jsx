/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-8">
      <div className="w-11/12 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-black mb-4">
              WANDER<span className="text-[#29AB87]">BD</span>
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your ultimate travel companion for discovering the beauty and culture of Bangladesh. Experience authentic adventures.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: FaFacebookF, link: "#", color: "hover:bg-blue-600" },
                { Icon: FaTwitter, link: "#", color: "hover:bg-sky-500" },
                { Icon: FaInstagram, link: "#", color: "hover:bg-pink-600" },
                { Icon: FaYoutube, link: "#", color: "hover:bg-red-600" }
              ].map(({ Icon, link, color }, idx) => (
                <motion.a
                  key={idx}
                  href={link}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center ${color} transition-all`}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "Community", "About", "Trips", "Dashboard"].map((link) => (
                <li key={link}>
                  <NavLink
                    to={`/${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-[#29AB87] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#29AB87] transition-all" />
                    {link}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              {["Tour Packages", "Tour Guides", "Travel Stories", "Trip Planning", "Custom Itineraries"].map((service) => (
                <li key={service}>
                  <a href="#" className="text-gray-400 hover:text-[#29AB87] transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#29AB87] transition-all" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <FiMapPin className="w-5 h-5 text-[#29AB87] mt-0.5 shrink-0" />
                <span className="text-sm">Dhaka, Bangladesh<br />Gulshan Avenue, 1212</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiPhone className="w-5 h-5 text-[#29AB87] shrink-0" />
                <span className="text-sm">+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiMail className="w-5 h-5 text-[#29AB87] shrink-0" />
                <span className="text-sm">info@wanderbd.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <FiClock className="w-5 h-5 text-[#29AB87] mt-0.5 shrink-0" />
                <span className="text-sm">Mon - Sat: 9AM - 8PM<br />Sunday: 10AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Wander BD. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-[#29AB87] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#29AB87] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#29AB87] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
