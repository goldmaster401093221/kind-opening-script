
import { Star, Users } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

const collaborators = [
  {
    name: "Kevin Rashy",
    title: "Professor of Artificial Intelligence",
    rating: "4.9/5.0",
    collaborations: "89 Collaborations",
    institution: "MIT Computer Science",
    location: "Cambridge, MA",
    tags: ["Machine Learning", "Neural Networks", "Computer Vision", "Machine Learning"],
    avatar: "/lovable-uploads/avatar2.jpg"
  },
  {
    name: "Anna Ryan",
    title: "Professor of Artificial Intelligence",
    rating: "4.9/5.0",
    collaborations: "89 Collaborations",
    institution: "MIT Computer Science",
    location: "Cambridge, MA",
    tags: ["Machine Learning", "Neural Networks", "Computer Vision"],
    avatar: "/lovable-uploads/avatar1.jpg"
  },
  {
    name: "Kevin Rashy",
    title: "Professor of Artificial Intelligence",
    rating: "4.9/5.0",
    collaborations: "89 Collaborations",
    institution: "MIT Computer Science",
    location: "Cambridge, MA",
    tags: ["Machine Learning", "Neural Networks", "Computer Vision"],
    avatar: "/lovable-uploads/avatar2.jpg"
  }
];

const FeaturedCollaborators = () => {
  const navigate = useNavigate();
  const { user } = useProfile();

  const handleSearchCollaborators = () => {
    if (user) {
      navigate('/discover-collaborators');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            Featured <span className="text-blue-600">Collaborators</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with leading experts across diverse fields of research and innovation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {collaborators.map((collaborator, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12  rounded-2 flex-shrink-2 overflow-hidden">
                  <div className="w-full h-full">
                    <img src={collaborator.avatar}/>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{collaborator.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{collaborator.title}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm">
                <div className="flex items-center space-x-1">
                  {/* <Star className="w-4 h-4 text-blue-600 fill-current" /> */}
<svg width="18" height="18" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.9528 1.17082C15.0726 0.802294 15.5939 0.802296 15.7137 1.17082L18.8357 10.7793C18.8892 10.9441 19.0428 11.0557 19.2161 11.0557H29.3191C29.7066 11.0557 29.8677 11.5516 29.5542 11.7793L21.3807 17.7177C21.2405 17.8196 21.1818 18.0001 21.2354 18.1649L24.3574 27.7734C24.4771 28.142 24.0553 28.4484 23.7419 28.2207L15.5684 22.2823C15.4282 22.1804 15.2383 22.1804 15.0981 22.2823L6.92465 28.2207C6.61116 28.4484 6.18937 28.142 6.30911 27.7735L9.43111 18.1649C9.48466 18.0001 9.42599 17.8196 9.2858 17.7177L1.11231 11.7793C0.79882 11.5516 0.959931 11.0557 1.34742 11.0557H11.4504C11.6237 11.0557 11.7773 10.9441 11.8308 10.7793L14.9528 1.17082Z" fill="#2567CE"/>
</svg>

                  <span className="font-medium">{collaborator.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{collaborator.collaborations}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-medium text-gray-900">{collaborator.institution}</p>
                <p className="text-sm text-gray-600">{collaborator.location}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {collaborator.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleSearchCollaborators}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md"
          >
            Search for Collaborators
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollaborators;
