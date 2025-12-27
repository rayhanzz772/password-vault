import { Link } from "react-router-dom";
import { ArrowRight, Github, Shield, Lock, Key, FileText } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-14 sm:pt-16">
      {/* Orange/Blue Gradient Background Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-900 dark:via-blue-800 dark:to-indigo-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            {/* Main Title */}
            <h1 className="text-5xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Secure your secrets,{" "}
              <span className="text-blue-200">everywhere</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl">
              An advanced open-source secret manager for passwords and encrypted
              notes. Built with Argon2id encryption and zero-knowledge
              architecture.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Start for free
              </Link>

              <a
                href="https://github.com/rayhanzz772/password-vault-backend"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors gap-2"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
