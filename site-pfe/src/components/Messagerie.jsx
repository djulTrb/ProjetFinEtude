import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ConversationList from './messagerie/ConversationList';
import ConversationModal from './messagerie/ConversationModal';

const Messagerie = () => {
  const { t } = useTranslation();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 800);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleCloseModal = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">{t('messagerie.title')}</h1>
      </div>
      
      <div className="h-[calc(100%-4rem)]">
        <ConversationList
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?.id}
        />
      </div>
      
      <ConversationModal 
        conversation={selectedConversation} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default Messagerie; 