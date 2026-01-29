import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Logo from "../shared/Logo";

const footerLinks = {
  Product: [
    { name: "Buy", href: "/ecommerce" },
    { name: "Book", href: "/booking" },
    { name: "Swap", href: "/swapping" },
    { name: "Pricing", href: "#" },
  ],
  Company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press Kit", href: "#" },
  ],
  Support: [
    { name: "Help Center", href: "#" },
    { name: "Safety", href: "#" },
    { name: "Community", href: "#" },
    { name: "Contact Us", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Guidelines", href: "#" },
  ],
};

const socialLinks = [
  { Icon: Facebook, href: "#", color: "hover:text-blue-600" },
  { Icon: Twitter, href: "#", color: "hover:text-sky-500" },
  { Icon: Instagram, href: "#", color: "hover:text-pink-600" },
  { Icon: Linkedin, href: "#", color: "hover:text-blue-700" },
];

const contactInfo = [
  { Icon: Mail, text: "support@tskhra.com" },
  { Icon: Phone, text: "+1 (555) 123-4567" },
  { Icon: MapPin, text: "123 Commerce Street, NY 10001" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-14 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-slate-400 leading-relaxed mb-6 mt-4">
              Your all-in-one platform for buying premium products, booking
              amazing experiences, and swapping with a trusted community.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, color }, index) => (
                <a
                  key={index}
                  href={href}
                  className={`w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-slate-700 hover:scale-110 ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map(({ Icon, text }, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-slate-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-8 mb-8 border border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-white font-bold text-xl mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-slate-400">
                Get the latest updates, deals, and news delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2026 Tskhra. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
