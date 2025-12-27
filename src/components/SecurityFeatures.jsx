import {
  Shield,
  Key,
  AlertTriangle,
  Activity,
  Clock,
  Hash,
  FileText,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description:
      "AES-256-GCM with Argon2id key derivation ensures your passwords and notes are protected with military-grade encryption.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Encrypted Secret Notes",
    description:
      "Store sensitive information like recovery codes, API keys, or private notes with the same encryption as your passwords.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Key,
    title: "Zero Knowledge Design",
    description:
      "Your master password never leaves your device. We can't access your data even if we wanted to.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Clock,
    title: "Rate Limiting & Auto Lock",
    description:
      "Prevent brute force attacks with intelligent rate limiting and automatic session locking after inactivity.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Hash,
    title: "Per-Item Salted KDF",
    description:
      "Each vault entry has unique Argon2id parameters, making it impossible to crack multiple passwords at once.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Lock,
    title: "Unified Vault Protection",
    description:
      "Both passwords and notes share the same secure vault with a single master password for easy management.",
    color: "from-pink-500 to-rose-500",
  },
];

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <div className="group relative h-full">
      <div className="h-full p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-xl">
        {/* Icon with gradient background */}
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 sm:p-3 mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-full h-full text-white" strokeWidth={2} />
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-white">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {feature.description}
        </p>

        {/* Decorative gradient line */}
        <div
          className={`mt-4 sm:mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.color} rounded-full transition-all duration-500`}
        ></div>
      </div>
    </div>
  );
};

const SecurityFeatures = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 mb-4 sm:mb-6">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-semibold">
              SECURITY FIRST
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-slate-900 dark:text-white">
            Enterprise-Grade{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Security
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4">
            Built with the latest cryptographic standards and security best
            practices to keep your passwords and sensitive notes safe.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6">
            Want to learn more about our security architecture?
          </p>
          <a
            href="https://github.com/rayhanzz772/password-vault-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Read Security Documentation
          </a>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-blue-100 dark:bg-blue-950/30 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-20 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-purple-100 dark:bg-purple-950/30 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
    </section>
  );
};

export default SecurityFeatures;
