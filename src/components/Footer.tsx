
import { Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-lg">AIRCollab</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting researchers worldwide to accelerate scientific discovery and innovation.
            </p>
            <div className="flex space-x-4">
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Research Links */}
          <div>
            <h4 className="font-semibold mb-4">Research</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="#" className="hover:text-white transition-colors underline">Browse Papers</a></li>
              <li><a href="#" className="hover:text-white transition-colors underline">Find Experts</a></li>
              <li><a href="#" className="hover:text-white transition-colors underline">Trending Topics</a></li>
              <li><a href="#" className="hover:text-white transition-colors underline">Research Tools</a></li>
            </ul>
          </div>

          {/* Collaborate Links */}
          <div>
            <h4 className="font-semibold mb-4">Collaborate</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="#" className="hover:text-white transition-colors underline">Find Partners</a></li>
              <li><a href="#" className="hover:text-white transition-colors underline">Join Projects</a></li>
              <li><a href="#" className="hover:text-white transition-colors underline">Host Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors underline">Funding Opportunities</a></li>
            </ul>
          </div>

          {/* Duplicate Collaborate section to match the original */}
          <div>
            <h4 className="font-semibold mb-4">Collaborate</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="#" className="hover:text-white transition-colors underline">Find Partners</a></li>
              <li><a href="#" className="hover:text-white transition-colors underline">Join Projects</a></li>
              <li><a href="#" className="hover:text-white transition-colors underline">Host Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors underline">Funding Opportunities</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-200 text-sm">
            © 2024 AIRCollab. All rights reserved. Empowering global research collaboration.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
