
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
      <FeaturedCollaborators />
      <CollaborationTools />
      <Footer />
    </div>
  );
};

export default Index;
