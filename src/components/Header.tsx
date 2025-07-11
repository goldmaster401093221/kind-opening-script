
import { Search, Grid3X3, User } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-lg text-gray-900">AIRCollab</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            discover collaborators
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            Collaborations
          </a>
        </nav>

        {/* Search and Profile */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search collaborations, interests, topics..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

<svg width="20" height="20" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.99963 0.150391H25.9996C26.6531 0.150391 27.1831 0.679625 27.1832 1.33301V20C27.1832 20.6536 26.6532 21.1836 25.9996 21.1836H6.55432L6.51331 21.2158L0.817017 25.6904V1.33301C0.817193 0.679735 1.34636 0.150567 1.99963 0.150391ZM3.18323 20.8223L3.42639 20.6318L5.73499 18.8164H24.817V2.5166H3.18323V20.8223ZM20.3873 8.39062L13.0573 15.7207L8.08362 10.7471L9.75647 9.07324L13.0573 12.374L13.1637 12.2676L18.7135 6.7168L20.3873 8.39062Z" fill="#161616" stroke="white" stroke-width="0.3"/>
</svg>

          {/* <Button variant="ghost" size="sm" className="p-2">
            <User className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <Grid3X3 className="w-4 h-4" />
          </Button>  */}

<svg width="18" height="18" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.6667 21.2667L11.8667 21.2667L11.8667 24L9.86671 24L9.86671 16.5333L11.8667 16.5333L11.8667 19.2667L21.6667 19.2667L21.6667 21.2667ZM7.86671 21.2667L0.333374 21.2667L0.333374 19.2667L7.86671 19.2667L7.86671 21.2667ZM6.50004 15.7333L4.50004 15.7333L4.50004 13L0.333374 13L0.333373 11L4.50004 11L4.50004 8.26667L6.50004 8.26667L6.50004 15.7333ZM21.6667 13L8.50004 13L8.50004 11L21.6667 11L21.6667 13ZM21.6667 4.73333L17.4334 4.73333L17.4334 7.46666L15.4334 7.46666L15.4334 -6.60042e-07L17.4334 -7.47465e-07L17.4334 2.73333L21.6667 2.73333L21.6667 4.73333ZM13.4334 4.73333L0.333373 4.73333L0.333373 2.73333L13.4334 2.73333L13.4334 4.73333Z" fill="#161616"/>
</svg>

                   
          {/* Changed from circular to rectangular */}
          <div className="w-10 h-8 bg-gray-800 rounded-md flex items-center justify-center">
            <span className="text-white text-sm font-medium">BM</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
