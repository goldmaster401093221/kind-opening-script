
import { MessageSquare, FileText, Video, FolderKanban } from "lucide-react";

const tools = [
  {
    icon: MessageSquare,
    title: "Real-time Communication",
    description: "Instant messaging, discussion boards, and collaborative workspaces for seamless team interaction."
  },
  {
    // icon: FileText,
    icon: MessageSquare,
    title: "Document Collaboration",
    description: "Co-author papers, share research notes, and manage version control with integrated editing tools."
  },
  {
    // icon: Video,
    icon: MessageSquare,
    title: "Virtual Meetings",
    description: "Host research seminars, lab meetings, and peer reviews with built-in video conferencing."
  },
  {
    // icon: FolderKanban,
    icon: MessageSquare,
    title: "Project Management",
    description: "Track research milestones, manage deadlines, and coordinate multi-institutional projects."
  }
];

const CollaborationTools = () => {
  return (
    <section className="py-16 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            Powerful <span className="text-gray-900">Collaboration Tools</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to collaborate effectively with researchers worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {tools.map((tool, index) => (
            <div key={index} className="text-center space-y-4 bg-white py-6 px-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                {/* <tool.icon className="w-8 h-8 text-blue-600" /> */}
<svg width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.75762 26.6667L0.333374 32.5V1.66667C0.333374 0.7462 1.07957 0 2.00004 0H32C32.9205 0 33.6667 0.7462 33.6667 1.66667V25C33.6667 25.9205 32.9205 26.6667 32 26.6667H7.75762ZM6.60474 23.3333H30.3334V3.33333H3.66671V25.6418L6.60474 23.3333ZM15.8215 15.2022L22.8925 8.13113L25.2495 10.4881L15.8215 19.9162L9.33972 13.4345L11.6967 11.0774L15.8215 15.2022Z" fill="#2567CE"/>
</svg>

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
