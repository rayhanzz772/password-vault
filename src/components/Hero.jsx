import { Link } from "react-router-dom";
import { ArrowRight, Github, Shield, Lock, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-14 sm:pt-16 overflow-hidden">
      {/* Gradient Background with Animation */}
      <div className="absolute inset-0 bg-white dark:bg-slate-950">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              Zero-Knowledge Encryption
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8">
            <span className="block text-slate-900 dark:text-white mb-2">
              Build and secure
            </span>
            <span className="block animated-text dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              your digital vault.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-3xl mx-auto px-4">
            Crypta provides military-grade encryption and developer-friendly
            tools to build, scale, and secure your passwords and sensitive data
            with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
            <Link
              to="/login"
              className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:bg-blue-700 dark:bg-white text-white dark:text-white font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <span>Start Securing</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://github.com/rayhanzz772/password-vault-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all gap-2 w-full sm:w-auto"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
