import React from 'react';
import { ArrowRight, Zap, Shield, Globe, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-white"
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold mb-6 text-blue-300"
        >
          Welcome to WriterWise
        </motion.h1>
        <motion.p
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl mb-8 text-gray-300"
        >
          Revolutionize your legal writing with AI-powered processing that's undetectable and multilingual.
        </motion.p>
        <motion.button
          onClick={onGetStarted}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out flex items-center mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </motion.button>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8"
      >
        <FeatureCard
          icon={<Zap className="h-10 w-10 text-yellow-400" />}
          title="Lightning Fast"
          description="Process your legal texts in seconds with our advanced AI technology."
        />
        <FeatureCard
          icon={<Shield className="h-10 w-10 text-green-400" />}
          title="Undetectable"
          description="Our AI ensures your processed text remains undetectable by AI detection systems."
        />
        <FeatureCard
          icon={<Globe className="h-10 w-10 text-blue-400" />}
          title="Multilingual Support"
          description="Support for 20+ languages, automatically detected and processed."
        />
        <FeatureCard
          icon={<BookOpen className="h-10 w-10 text-purple-400" />}
          title="Legal Expertise"
          description="Powered by comprehensive legal databases for accurate and relevant content."
        />
      </motion.div>
    </motion.div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center shadow-lg"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-blue-300">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

export default LandingPage;