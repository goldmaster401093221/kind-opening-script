
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
          <Button variant="ghost" size="sm" className="p-2">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <User className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">BM</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
