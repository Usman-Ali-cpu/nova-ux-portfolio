
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });

    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@portfolio.dev",
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "San Francisco, CA",
      color: "from-green-400 to-cyan-500",
    },
  ];

  return (
    <section id="contact" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Let's Connect
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Ready to bring your ideas to life? Let's discuss how we can work together 
          to create something extraordinary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
          
          {contactInfo.map((info, index) => (
            <div
              key={info.title}
              className="flex items-center p-4 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800 hover:border-cyan-500/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${info.color} p-3 mr-4`}>
                <info.icon className="w-full h-full text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{info.title}</h4>
                <p className="text-gray-400">{info.value}</p>
              </div>
            </div>
          ))}

          {/* Social Links */}
          <div className="pt-8">
            <h4 className="text-lg font-semibold text-white mb-4">Follow Me</h4>
            <div className="flex space-x-4">
              {["GitHub", "LinkedIn", "Twitter"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-700 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300"
                >
                  {platform.charAt(0)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors duration-300"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors duration-300"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors duration-300 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              className="group relative w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <span className="relative z-10 flex items-center justify-center">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-20 pt-8 border-t border-gray-800">
        <p className="text-gray-400">
          © 2024 Portfolio. Crafted with ❤️ and cutting-edge technology.
        </p>
      </div>
    </section>
  );
};

export default Contact;
