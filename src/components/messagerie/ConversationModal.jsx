import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getMessages, formatTime, isToday, isYesterday, formatDate } from './utils';
import { Paperclip, X, Image, PaperPlaneRight } from 'phosphor-react';
import { format as formatDateFns, parseISO } from 'date-fns';

const ConversationModal = ({ conversation, onClose }) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messages = getMessages(conversation?.id);
  const [messageInput, setMessageInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTimeDisplay = (timestamp) => {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    
    if (isToday(date)) {
      return t('messagerie.today');
    } else if (isYesterday(date)) {
      return t('messagerie.yesterday');
    } else {
      return formatDate(timestamp, t);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() || selectedFile) {
      // In a real app, this would send the message with the file
      setMessageInput('');
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImageFile = selectedFile && selectedFile.type.startsWith('image/');

  return (
    <AnimatePresence>
      {conversation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-white to-gray-50 w-[95%] h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center bg-white border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {conversation.user.avatar ? (
                    <img
                      src={conversation.user.avatar}
                      alt={conversation.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    conversation.user.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{conversation.user.name}</h3>
                  <p className="text-sm text-gray-500">{conversation.user.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    // Handle block user action
                    const isBlocked = localStorage.getItem(`blocked_${conversation.user.id}`);
                    if (isBlocked) {
                      localStorage.removeItem(`blocked_${conversation.user.id}`);
                    } else {
                      localStorage.setItem(`blocked_${conversation.user.id}`, 'true');
                    }
                    onClose();
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  <span className="text-sm font-medium">{t('messagerie.blockUser')}</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Messages */}
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
                      <div
                        className={`max-w-[75%] p-3 ${
                          isCurrentUser
                            ? 'bg-gradient-to-br from-sky-100 to-sky-200 text-gray-800 shadow-sm'
                            : 'bg-white text-gray-800 shadow-sm'
                        } rounded-2xl`}
                      >
                        {message.file && (
                          <div className="mb-2">
                            {message.file.type.startsWith('image/') ? (
                              <img 
                                src={message.file.url} 
                                alt="Attachment" 
                                className="max-w-full rounded-lg"
                              />
                            ) : (
                              <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                                <Paperclip size={16} className="mr-2" />
                                <span className="text-xs truncate">{message.file.name}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-sm">{message.text}</p>
                        <span className={`text-xs mt-1 block ${isCurrentUser ? 'text-gray-500' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            {/* File Preview */}
            {selectedFile && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    {isImageFile ? (
                      <Image size={20} className="text-blue-500 mr-2" />
                    ) : (
                      <Paperclip size={20} className="text-blue-500 mr-2" />
                    )}
                    <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                  </div>
                  <button 
                    onClick={removeFile}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
            
            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('messagerie.typeMessage')}
                  className="flex-1 border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {!selectedFile && (
                  <label className="cursor-pointer text-gray-500 hover:text-blue-500">
                    <Paperclip size={24} />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    />
                  </label>
                )}
                <button 
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition-colors flex items-center"
                >
                  <span className="mr-1">{t('messagerie.send')}</span>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConversationModal; 