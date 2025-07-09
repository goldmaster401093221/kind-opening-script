
import { MessageSquare, FileText, Video, FolderKanban } from "lucide-react";

const tools = [
  {
    icon: MessageSquare,
    title: "Real-time Communication",
    description: "Instant messaging, discussion boards, and collaborative workspaces for seamless team interaction."
  },
  {
    icon: FileText,
    title: "Document Collaboration",
    description: "Co-author papers, share research notes, and manage version control with integrated editing tools."
  },
  {
    icon: Video,
    title: "Virtual Meetings",
    description: "Host research seminars, lab meetings, and peer reviews with built-in video conferencing."
  },
  {
    icon: FolderKanban,
    title: "Project Management",
    description: "Track research milestones, manage deadlines, and coordinate multi-institutional projects."
  }
];

const CollaborationTools = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful <span className="text-gray-900">Collaboration Tools</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to collaborate effectively with collaborators worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                <tool.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{tool.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollaborationTools;
