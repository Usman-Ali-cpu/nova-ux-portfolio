
import { ExternalLink, Github, Zap } from "lucide-react";
import { useState } from "react";

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: "AI-Powered Dashboard",
      description: "A futuristic analytics dashboard with real-time data visualization and machine learning insights.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
      technologies: ["React", "TypeScript", "D3.js", "TensorFlow.js"],
      github: "#",
      live: "#",
      featured: true,
    },
    {
      id: 2,
      title: "Cyberpunk E-commerce",
      description: "A neon-themed e-commerce platform with immersive 3D product previews and AR try-on features.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
      technologies: ["Next.js", "Three.js", "WebXR", "Stripe"],
      github: "#",
      live: "#",
      featured: true,
    },
    {
      id: 3,
      title: "Neural Network Visualizer",
      description: "Interactive tool for visualizing and understanding neural network architectures and training processes.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
      technologies: ["Vue.js", "Python", "WebGL", "TensorFlow"],
      github: "#",
      live: "#",
      featured: false,
    },
    {
      id: 4,
      title: "Quantum Code Editor",
      description: "Advanced code editor with quantum computing syntax highlighting and simulation capabilities.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
      technologies: ["React", "Monaco Editor", "WASM", "Qiskit"],
      github: "#",
      live: "#",
      featured: false,
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 mb-6">
          <Zap className="w-4 h-4 text-purple-400 mr-2" />
          <span className="text-sm text-purple-300">Featured Work</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            My Projects
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Explore my latest work showcasing cutting-edge technologies and innovative solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`group relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800 hover:border-cyan-500/50 transition-all duration-500 ${
              project.featured ? "lg:col-span-2" : ""
            }`}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Project Image */}
            <div className="relative overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-purple-500/20 transition-opacity duration-300 ${
                hoveredProject === project.id ? "opacity-100" : "opacity-0"
              }`}></div>

              {/* Action Buttons */}
              <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${
                hoveredProject === project.id ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2"
              }`}>
                <a
                  href={project.github}
                  className="p-2 bg-black/80 backdrop-blur-sm rounded-full text-white hover:bg-cyan-500/80 transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={project.live}
                  className="p-2 bg-black/80 backdrop-blur-sm rounded-full text-white hover:bg-purple-500/80 transition-all duration-300"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Project Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {project.title}
              </h3>
              
              <p className="text-gray-300 mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Projects Button */}
      <div className="text-center mt-12">
        <button className="group relative px-8 py-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50 rounded-full font-semibold text-purple-300 hover:text-white overflow-hidden transition-all duration-300 hover:scale-105">
          <span className="relative z-10">View All Projects</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </section>
  );
};

export default Projects;
