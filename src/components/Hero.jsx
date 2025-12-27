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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
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

      {/* Feature Cards Section */}
      <div className="relative bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 - Password Manager */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Password Vault
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Store and manage your passwords securely with military-grade
                    encryption and breach monitoring.
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline"
                  >
                    Get started <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2 - Encrypted Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Secure Notes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Keep your sensitive information safe with encrypted notes
                    that only you can access.
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium text-sm hover:underline"
                  >
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3 - Zero Knowledge */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Zero-Knowledge Architecture
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Your master password never leaves your device. We can't see
                    your data, ever.
                  </p>
                  <a
                    href="#features"
                    className="inline-flex items-center text-green-600 dark:text-green-400 font-medium text-sm hover:underline"
                  >
                    How it works <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Card 4 - Open Source */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Lock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    100% Open Source
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Fully transparent codebase. Audit the security yourself or
                    self-host your instance.
                  </p>
                  <a
                    href="https://github.com/rayhanzz772/password-vault-backend"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-orange-600 dark:text-orange-400 font-medium text-sm hover:underline"
                  >
                    View source <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                256-bit
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                AES Encryption
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                100%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Open Source
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Zero
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Knowledge
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
