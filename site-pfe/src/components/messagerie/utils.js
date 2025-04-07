// Mock data for conversations
export const conversations = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Dr. Martin",
      avatar: null,
      role: "Cardiologue",
      online: true,
    },
    lastMessage: {
      text: "Bonjour, j'ai examiné vos résultats. Tout semble normal.",
      timestamp: "2024-03-15T10:30:00",
      unread: true,
    },
  },
  {
    id: 2,
    user: {
      id: 102,
      name: "Dr. Dubois",
      avatar: null,
      role: "Dermatologue",
      online: false,
    },
    lastMessage: {
      text: "Votre rendez-vous est confirmé pour le 20 mars à 14h.",
      timestamp: "2024-03-14T16:45:00",
      unread: false,
    },
  },
  {
    id: 3,
    user: {
      id: 103,
      name: "Dr. Bernard",
      avatar: null,
      role: "Ophtalmologue",
      online: true,
    },
    lastMessage: {
      text: "Les résultats de votre examen sont disponibles.",
      timestamp: "2024-03-13T09:15:00",
      unread: false,
    },
  },
  {
    id: 4,
    user: {
      id: 104,
      name: "Dr. Petit",
      avatar: null,
      role: "Gynécologue",
      online: false,
    },
    lastMessage: {
      text: "N'oubliez pas de prendre vos médicaments.",
      timestamp: "2024-03-12T11:20:00",
      unread: false,
    },
  },
  {
    id: 5,
    user: {
      id: 105,
      name: "Dr. Robert",
      avatar: null,
      role: "Pédiatre",
      online: true,
    },
    lastMessage: {
      text: "Votre enfant se porte bien, continuez comme ça.",
      timestamp: "2024-03-11T15:10:00",
      unread: false,
    },
  },
];

// Mock data for messages in a conversation
export const getMessages = (conversationId) => {
  const messages = {
    1: [
      {
        id: 1001,
        senderId: 101,
        text: "Bonjour, j'ai examiné vos résultats. Tout semble normal.",
        timestamp: "2024-03-15T10:30:00",
      },
      {
        id: 1002,
        senderId: 0, // Current user
        text: "Merci beaucoup pour votre retour rapide.",
        timestamp: "2024-03-15T10:35:00",
      },
      {
        id: 1003,
        senderId: 101,
        text: "De rien. N'hésitez pas si vous avez d'autres questions.",
        timestamp: "2024-03-15T10:40:00",
      },
    ],
    2: [
      {
        id: 2001,
        senderId: 102,
        text: "Votre rendez-vous est confirmé pour le 20 mars à 14h.",
        timestamp: "2024-03-14T16:45:00",
      },
      {
        id: 2002,
        senderId: 0,
        text: "Parfait, merci pour la confirmation.",
        timestamp: "2024-03-14T16:50:00",
      },
    ],
    3: [
      {
        id: 3001,
        senderId: 103,
        text: "Les résultats de votre examen sont disponibles.",
        timestamp: "2024-03-13T09:15:00",
      },
      {
        id: 3002,
        senderId: 0,
        text: "Pouvez-vous me les envoyer par email ?",
        timestamp: "2024-03-13T09:20:00",
      },
      {
        id: 3003,
        senderId: 103,
        text: "Bien sûr, je vais les envoyer dans quelques minutes.",
        timestamp: "2024-03-13T09:25:00",
      },
    ],
    4: [
      {
        id: 4001,
        senderId: 104,
        text: "N'oubliez pas de prendre vos médicaments.",
        timestamp: "2024-03-12T11:20:00",
      },
      {
        id: 4002,
        senderId: 0,
        text: "Je ne les oublie pas, merci pour le rappel.",
        timestamp: "2024-03-12T11:25:00",
      },
    ],
    5: [
      {
        id: 5001,
        senderId: 105,
        text: "Votre enfant se porte bien, continuez comme ça.",
        timestamp: "2024-03-11T15:10:00",
      },
      {
        id: 5002,
        senderId: 0,
        text: "C'est une excellente nouvelle, merci.",
        timestamp: "2024-03-11T15:15:00",
      },
    ],
  };

  return messages[conversationId] || [];
};

// Format timestamp to readable time
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format date to readable format
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
};

// Check if a date is today
export const isToday = (timestamp) => {
  const today = new Date();
  const date = new Date(timestamp);
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// Check if a date is yesterday
export const isYesterday = (timestamp) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = new Date(timestamp);
  return date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
}; 