import React from "react";
import { Github, Instagram, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: "https://github.com/sudeenjain", label: "GitHub" },
    { icon: Instagram, href: "https://instagram.com/sudeenjain", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/in/sudeenjain", label: "LinkedIn" },
  ];

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-xl py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-black tracking-tighter text-white">
            CINE<span className="text-primary">AI</span>
          </h3>
          <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by @sudeenjain
          </p>
        </div>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
              aria-label={link.label}
            >
              <link.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </div>

        <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
          © {new Date().getFullYear()} All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;