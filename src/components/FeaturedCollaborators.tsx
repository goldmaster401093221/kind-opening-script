
import { Star, Users } from "lucide-react";
import { Button } from "./ui/button";

const collaborators = [
  {
    name: "Kevin Rashy",
    title: "Professor of Artificial Intelligence",
    rating: "4.9/5.0",
    collaborations: "89 Collaborations",
    institution: "MIT Computer Science",
    location: "Cambridge, MA",
    tags: ["Machine Learning", "Neural Networks", "Computer Vision", "Machine Learning"],
    avatar: "/lovable-uploads/7a900c46-30e3-4c36-8da2-71c8f19d76c9.png"
  },
  {
    name: "Anna Ryan",
    title: "Professor of Artificial Intelligence",
    rating: "4.9/5.0",
    collaborations: "89 Collaborations",
    institution: "MIT Computer Science",
    location: "Cambridge, MA",
    tags: ["Machine Learning", "Neural Networks", "Computer Vision"],
    avatar: "/lovable-uploads/7a900c46-30e3-4c36-8da2-71c8f19d76c9.png"
  },
  {
    name: "Kevin Rashy",
    title: "Professor of Artificial Intelligence",
    rating: "4.9/5.0",
    collaborations: "89 Collaborations",
    institution: "MIT Computer Science",
    location: "Cambridge, MA",
    tags: ["Machine Learning", "Neural Networks", "Computer Vision"],
    avatar: "/lovable-uploads/7a900c46-30e3-4c36-8da2-71c8f19d76c9.png"
  }
];

const FeaturedCollaborators = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
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
                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{collaborator.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{collaborator.title}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md">
            Search More Collaborators
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollaborators;
