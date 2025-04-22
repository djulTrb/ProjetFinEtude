import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getMessages, formatTime, isToday, isYesterday, formatDate } from './utils';
import { Paperclip, Image, PaperPlaneRight } from 'phosphor-react';

const DirectChat = () => {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [messageInput, setMessageInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // Get the doctor's conversation (first conversation in the list)
  const doctorConversation = {
    id: 1,
    user: {
      id: 101,
      name: "Dr. Martin",
      avatar: null,
      role: "Cardiologue",
      online: true,
    }
  };

  const messages = getMessages(doctorConversation.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTimeDisplay = (timestamp) => {
    if (isToday(timestamp)) {
      return t('messagerie.today');
    } else if (isYesterday(timestamp)) {
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              {doctorConversation.user.avatar ? (
                <img
                  src={doctorConversation.user.avatar}
                  alt={doctorConversation.user.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                doctorConversation.user.name.charAt(0)
              )}
            </div>
            {doctorConversation.user.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{doctorConversation.user.name}</h3>
            <p className="text-sm text-gray-500">{doctorConversation.user.role}</p>
          </div>
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
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
                </motion.div>
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
            <PaperPlaneRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectChat; 