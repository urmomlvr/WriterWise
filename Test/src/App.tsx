import React, { useState } from 'react';
import { MessageSquare, Send, Home } from 'lucide-react';
import TextProcessor from './components/TextProcessor';
import ChatHistory from './components/ChatHistory';
import LandingPage from './components/LandingPage';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string; language: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [showLanding, setShowLanding] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const detectedLanguage = TextProcessor.detectLanguage(inputText);
    setChatHistory([...chatHistory, { role: 'user', content: inputText, language: detectedLanguage }]);
    setInputText('');
    setIsProcessing(true);

    try {
      const { text: response, language } = await TextProcessor.processText(inputText);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response, language }]);
    } catch (error) {
      console.error('Error processing text:', error);
      let errorMessage = 'I apologize, but I encountered an issue while processing your text. ';
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again later.';
      }
      setChatHistory(prev => [...prev, { role: 'assistant', content: errorMessage, language: 'en' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-400 mr-3" />
            <h1 className="text-2xl font-bold text-white">WriterWise</h1>
          </div>
          <button
            onClick={() => setShowLanding(!showLanding)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showLanding ? <MessageSquare className="h-6 w-6" /> : <Home className="h-6 w-6" />}
          </button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <AnimatePresence mode="wait">
          {showLanding ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onGetStarted={() => setShowLanding(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col h-full"
            >
              <div className="flex-grow overflow-y-auto mb-4 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
                <ChatHistory messages={chatHistory} />
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your text to be rewritten..."
                  className="w-full p-4 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800 text-white placeholder-gray-400 resize-none shadow-inner transition-all duration-300 ease-in-out min-h-[100px]"
                  disabled={isProcessing}
                />
                <motion.button
                  type="submit"
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out disabled:opacity-50 shadow-lg"
                  disabled={isProcessing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <MessageSquare className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2">Rewrite</span>
                      <Send className="h-5 w-5" />
                    </div>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;