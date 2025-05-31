
import { Brain, Code2, Palette, Rocket } from "lucide-react";

const About = () => {
  const skills = [
    {
      icon: Code2,
      title: "Frontend Development",
      description: "React, TypeScript, Next.js, Tailwind CSS",
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: Brain,
      title: "Problem Solving",
      description: "Algorithmic thinking and creative solutions",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Modern, user-centered design principles",
      color: "from-green-400 to-cyan-500",
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "Cutting-edge technologies and methodologies",
      color: "from-orange-400 to-red-500",
    },
  ];

  return (
    <section id="about" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            About Me
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          I'm a passionate developer who loves creating digital experiences that matter. 
          With a keen eye for design and a deep understanding of modern technologies, 
          I transform ideas into reality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {skills.map((skill, index) => (
          <div
            key={skill.title}
            className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${skill.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <skill.icon className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                {skill.title}
              </h3>
              
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {skill.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { number: "50+", label: "Projects Completed" },
          { number: "3+", label: "Years Experience" },
          { number: "100%", label: "Client Satisfaction" },
          { number: "24/7", label: "Dedicated Support" },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-900/30 to-black/30 border border-gray-800 hover:border-cyan-500/30 transition-all duration-300"
          >
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              {stat.number}
            </div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
