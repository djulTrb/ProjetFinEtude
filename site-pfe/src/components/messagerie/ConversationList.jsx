import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { conversations, formatTime, isToday, isYesterday, formatDate } from './utils';

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
  const { t } = useTranslation();

  const getTimeDisplay = (timestamp) => {
    if (isToday(timestamp)) {
      return formatTime(timestamp);
    } else if (isYesterday(timestamp)) {
      return t('messagerie.yesterday');
    } else {
      return formatDate(timestamp, t);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {conversations.filter(conversation => !localStorage.getItem(`blocked_${conversation.user.id}`)).length > 0 ? (
          conversations
            .filter(conversation => !localStorage.getItem(`blocked_${conversation.user.id}`))
            .map((conversation) => (
              <motion.div
                key={conversation.id}
                className={`p-4 mb-3 cursor-pointer hover:bg-gray-50 rounded-lg ${
                  selectedConversationId === conversation.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {conversation.user.avatar ? (
                        <img
                          src={conversation.user.avatar}
                          alt={conversation.user.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <span className="text-xl font-semibold text-gray-600">
                          {conversation.user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    {conversation.user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{conversation.user.name}</h3>
                        <p className="text-sm text-gray-500">{conversation.user.role}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {getTimeDisplay(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm truncate ${
                      conversation.lastMessage.unread ? 'font-semibold text-gray-900' : 'text-gray-500'
                    }`}>
                      {conversation.lastMessage.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">{t('messagerie.noConversations')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList; 