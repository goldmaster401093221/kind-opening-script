
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartCollaborating = () => {
    navigate('/auth');
  };

  return (
    <section className="bg-blue-100 py-16 px-4">
      <div className="max-w-7xl mx-auto ">
        <div className="grid lg:grid-cols-2 gap-12 items-center ">
          {/* Left Content */}
          <div className="space-y-8 ">
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

          {/* Right Image */}
          <div className="relative flex justify-center">
            <img 
              src="/lovable-uploads/8c509090-2c71-4a15-989a-6a3f83d8f813.png" 
              alt="Sidebar" 
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
