import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getMessages, formatTime, isToday, isYesterday, formatDate } from './utils';

const Conversation = ({ conversation }) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);
  const messages = getMessages(conversation?.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTimeDisplay = (timestamp) => {
    if (isToday(timestamp)) {
      return formatTime(timestamp);
    } else if (isYesterday(timestamp)) {
      return t('messagerie.yesterday');
    } else {
      return formatDate(timestamp, t);
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">{t('messagerie.selectConversation')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {conversation.user.avatar ? (
                <img
                  src={conversation.user.avatar}
                  alt={conversation.user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-600">
                  {conversation.user.name.charAt(0)}
                </span>
              )}
            </div>
            {conversation.user.online && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{conversation.user.name}</h3>
            <p className="text-sm text-gray-500">{conversation.user.role}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === 0;
          const showDate = index === 0 || 
            new Date(message.timestamp).toDateString() !== 
            new Date(messages[index - 1].timestamp).toDateString();

          return (
            <div key={message.id}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {getTimeDisplay(message.timestamp)}
                  </span>
                </div>
              )}
              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isCurrentUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs mt-1 block opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </motion.div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={t('messagerie.typeMessage')}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation; 