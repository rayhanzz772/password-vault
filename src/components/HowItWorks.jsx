import { motion } from 'framer-motion';
import { UserPlus, Lock, Unlock } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Register & Create a Master Password',
    description: 'Sign up and create a strong master password. This is the only password you\'ll need to remember. We never store or transmit it.',
    color: 'from-blue-500 to-cyan-500',
    image: '👤',
  },
  {
    number: '02',
    icon: Lock,
    title: 'Encrypt & Save Passwords Securely',
    description: 'Add your passwords, and we\'ll encrypt each one with AES-256 using your master password. Each entry gets unique Argon2id salt.',
    color: 'from-purple-500 to-pink-500',
    image: '🔒',
  },
  {
    number: '03',
    icon: Unlock,
    title: 'Decrypt Instantly, Locally, When You Need Them',
    description: 'Unlock your vault with your master password. Decryption happens instantly on your device - your passwords never leave unencrypted.',
    color: 'from-green-500 to-emerald-500',
    image: '✨',
  },
];

const StepCard = ({ step, index }) => {
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Step Number & Icon */}
        <div className="flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            {/* Large number in background */}
            <div className="absolute -top-8 -left-4 text-8xl font-bold text-gray-200 dark:text-gray-800 opacity-50">
              {step.number}
            </div>
            
            {/* Icon container */}
            <div className={`relative z-10 w-32 h-32 rounded-2xl bg-gradient-to-br ${step.color} p-8 shadow-2xl`}>
              <Icon className="w-full h-full text-white" strokeWidth={2} />
            </div>

            {/* Emoji decoration */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute -top-4 -right-4 text-4xl"
            >
              {step.image}
            </motion.div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 + 0.2 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {step.title}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              {step.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Connecting line (not for last item) */}
      {index < steps.length - 1 && (
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
          className="hidden md:block absolute left-16 top-32 w-0.5 h-24 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-800 origin-top"
          style={{ 
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, currentColor 4px, currentColor 8px)',
          }}
        />
      )}
    </motion.div>
  );
};

const HowItWorks = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-700 dark:text-primary-300 mb-6"
          >
            <span className="text-sm font-semibold">HOW IT WORKS</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Get Started in{' '}
            <span className="text-gradient">Three Simple Steps</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Vault Password makes security simple. Here's how it works under the hood.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16 md:space-y-24">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 rounded-2xl glass-effect">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Ready to secure your passwords?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join thousands of users protecting their digital life.
              </p>
            </div>
            <button className="flex-shrink-0 px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              Create Account
            </button>
          </div>
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/10 dark:to-purple-900/10 rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/10 dark:to-orange-900/10 rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
    </section>
  );
};

export default HowItWorks;
