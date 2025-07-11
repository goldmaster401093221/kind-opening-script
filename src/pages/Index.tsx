
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeaturedCollaborators from "../components/FeaturedCollaborators";
import CollaborationTools from "../components/CollaborationTools";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      
      {/* Replace the Research/Innovation section with the sidebar image */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Global Collaboration Network
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with researchers and innovators worldwide through our collaborative platform
            </p>
          </div>
          
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/8c509090-2c71-4a15-989a-6a3f83d8f813.png" 
              alt="Global Collaboration Network" 
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
      
      <FeaturedCollaborators />
      <CollaborationTools />
      <Footer />
    </div>
  );
};

export default Index;
