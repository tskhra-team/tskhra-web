import { scrollToElement } from "@/utils";
import { Mail, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../shared/Logo";
import { useTranslation } from "react-i18next";

const contactInfo = [
  { Icon: Mail, text: "makingscience@tskhra.com" },
  { Icon: Phone, text: "+995 (599) 60-33-66" },
  { Icon: MapPin, text: "13 Mikheil Tamarashvili St, Tbilisi 0162" },
];

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation("home");

  const footerLinks = {
    [t("footer.links.product")]: [
      { name: t("footer.links.buy"), func: () => navigate("/ecommerce") },
      { name: t("footer.links.book"), func: () => navigate("/booking") },
      { name: t("footer.links.swap"), func: () => navigate("/swapping") },
    ],
    [t("footer.links.company")]: [{ name: t("footer.links.aboutUs"), func: () => scrollToElement("about-us") }],
    [t("footer.links.legal")]: [
      { name: t("footer.links.privacy"), func: () => console.log() },
      { name: t("footer.links.terms"), func: () => console.log() },
      { name: t("footer.links.cookies"), func: () => console.log() },
    ],
  };

  return (
    <footer className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Logo color="white" />
            <p className="text-slate-400 leading-relaxed mb-6 mt-4">
              {t("footer.brand.description")}
            </p>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      onClick={link.func}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {contactInfo.map(({ Icon, text }, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm sm:text-base wrap-break-word">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-linear-to-r from-blue-600/10 to-purple-600/10 rounded-xl lg:rounded-2xl p-6 sm:p-8 mb-8 border border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2">
                {t("footer.newsletter.title")}
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                {t("footer.newsletter.description")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="px-6 py-2.5 sm:py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap">
                {t("footer.newsletter.button")}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            {t("footer.copyright")}
          </p>
          <div className="flex gap-6 text-sm">
            <a className="text-slate-400 hover:text-white transition-colors">
              {t("footer.links.privacyShort")}
            </a>
            <a className="text-slate-400 hover:text-white transition-colors">
              {t("footer.links.termsShort")}
            </a>
            <a className="text-slate-400 hover:text-white transition-colors">
              {t("footer.links.cookiesShort")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
