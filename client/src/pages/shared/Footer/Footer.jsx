import { NavLink } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#29AB8760] text-base-content pt-10">
      <div className="w-11/12 mx-auto">
        <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-6 border-b border-base-300">
          
          {/* Website Info */}
          <div>
            <h2 className="text-xl font-bold mb-2">Wander BD</h2>
            <p className="text-sm">
              Discover the hidden beauty of Bangladesh. Explore breathtaking destinations, rich culture, and local experiences — all in one place.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><NavLink to="/" className="hover:text-primary">Home</NavLink></li>
              <li><NavLink to="/community" className="hover:text-primary">Community</NavLink></li>
              <li><NavLink to="/about" className="hover:text-primary">About Us</NavLink></li>
              <li><NavLink to="/trips" className="hover:text-primary">Trips</NavLink></li>
              <li><NavLink to="/login" className="hover:text-primary">Login/Register</NavLink></li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-xl hover:text-primary"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter" className="text-xl hover:text-primary"><FaTwitter /></a>
              <a href="#" aria-label="Instagram" className="text-xl hover:text-primary"><FaInstagram /></a>
              <a href="#" aria-label="YouTube" className="text-xl hover:text-primary"><FaYoutube /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center py-4 text-sm">
          © {new Date().getFullYear()} Wander BD. All rights reserved.
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
