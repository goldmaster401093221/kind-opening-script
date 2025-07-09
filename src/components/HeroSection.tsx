
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartCollaborating = () => {
    navigate('/auth');
  };

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Connect,{" "}
                <span className="text-blue-600">Collaborate,</span>{" "}
                Discover
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Join the world's largest network of researchers, share your work, find collaborators, and accelerate scientific discovery together.
              </p>
            </div>
            <Button 
              onClick={handleStartCollaborating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-md transition-colors"
            >
              Start Collaborating
            </Button>
          </div>

          {/* Right Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg h-32 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium">Research</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-400 opacity-90"></div>
                  <div className="relative z-10 text-white text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-3"></div>
                    <div className="text-lg font-semibold">Global Network</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg h-40 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full mx-auto mb-2"></div>
                    <div className="text-base font-medium">Innovation</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-lg h-36 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium">Discovery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
