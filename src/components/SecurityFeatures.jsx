import { Shield, Key, AlertTriangle, Activity, Clock, Hash } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'End-to-End Encryption',
    description: 'AES-256-CBC with Argon2id key derivation ensures your passwords are protected with military-grade encryption.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Key,
    title: 'Zero Knowledge Design',
    description: 'Your master password never leaves your device. We can\'t access your data even if we wanted to.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: AlertTriangle,
    title: 'Password Breach Detection',
    description: 'Automatically checks HaveIBeenPwned before saving passwords to ensure they haven\'t been compromised.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Activity,
    title: 'Activity Logs',
    description: 'Track create, decrypt, and delete actions securely. Know exactly when and how your vault is accessed.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Clock,
    title: 'Rate Limiting & Auto Lock',
    description: 'Prevent brute force attacks with intelligent rate limiting and automatic session locking after inactivity.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Hash,
    title: 'Per-Item Salted KDF',
    description: 'Each vault entry has unique Argon2id parameters, making it impossible to crack multiple passwords at once.',
    color: 'from-violet-500 to-purple-500',
  },
];

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;
  
  return (
    <div className="group relative h-full">
      <div className="h-full p-8 rounded-2xl glass-effect hover:bg-white/20 dark:hover:bg-gray-800/40 transition-all duration-300 shadow-lg hover:shadow-2xl">
        {/* Icon with gradient background */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-full h-full text-white" strokeWidth={2} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {feature.description}
        </p>

        {/* Decorative gradient line */}
        <div className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.color} rounded-full transition-all duration-500`}></div>
      </div>
    </div>
  );
};

const SecurityFeatures = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">SECURITY FIRST</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Enterprise-Grade{' '}
            <span className="text-gradient">Security Features</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Built with the latest cryptographic standards and security best practices to keep your passwords safe.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Want to learn more about our security architecture?
          </p>
          <button className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200">
            Read Security Documentation
          </button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 dark:bg-primary-900/20 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
    </section>
  );
};

export default SecurityFeatures;
