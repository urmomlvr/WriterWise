import React from 'react';
import { motion } from 'framer-motion';

interface Message {
  role: string;
  content: string;
  language: string;
}

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  return (
    <div className="p-4 space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          className={`p-4 rounded-lg ${
            message.role === 'user' ? 'bg-blue-600 bg-opacity-20 ml-auto' : 'bg-purple-600 bg-opacity-20'
          } max-w-3/4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold mb-1 text-blue-300">
            {message.role === 'user' ? 'You' : 'Mr. Mohammed Jaafar'} ({message.language})
          </p>
          <p className="text-white">{message.content}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ChatHistory;