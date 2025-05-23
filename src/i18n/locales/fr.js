export default {
  common: {
    greeting: "Salut",
    welcome: "Bienvenue dans votre espace personnel",
    empty: "vide pour le moment",
    noAppointments: "vous n'avez aucun rendez-vous prévu",
    close: "Fermer",
    cancel: "Annuler",
  },
  validation: {
    required: "Ce champ est requis",
    phoneFormat: "Le numéro de téléphone doit contenir 10 chiffres",
    maxLength: "Maximum {{length}} caractères autorisés",
    email: "Veuillez entrer une adresse email valide",
    password: "Le mot de passe doit contenir au moins 8 caractères",
    confirmPassword: "Les mots de passe ne correspondent pas"
  },
  nav: {
    home: "Accueil",
    announcements: "Annonces",
    messages: "Messagerie",
    calendar: "Agenda",
    settings: "Paramètres",
  },
  notifications: {
    title: "Notifications et Logs",
    empty: "Aucune notification",
  },
  settings: {
    title: "Paramètres",
    language: {
      title: "Langue",
      description: "Choisissez la langue de l'application",
      french: "Français",
      arabic: "العربية",
    },
    profile: {
      title: "Informations du profil",
      photo: "Photo de profil",
      change: "Changer",
      name: "Nom",
      email: "Email",
      save: "Enregistrer",
      cancel: "Annuler",
      edit: "Modifier le profil",
    },
    password: {
      title: "Changer le mot de passe",
      description: "Changez votre mot de passe pour sécuriser votre compte",
      current: "Mot de passe actuel",
      new: "Nouveau mot de passe",
      confirm: "Confirmer le nouveau mot de passe",
      change: "Changer le mot de passe",
      cancel: "Annuler",
    },
    disconnect: {
      title: "Déconnexion",
      description: "Déconnectez-vous de votre compte",
      button: "Se déconnecter",
    },
  },
  messagerie: {
    title: "Messagerie",
    today: "Aujourd'hui",
    yesterday: "Hier",
    typeMessage: "Tapez votre message...",
    send: "Envoyer",
    noMessages: "Aucun message",
    startConversation: "Commencez une conversation",
    searchPlaceholder: "Rechercher une conversation...",
    newMessage: "Nouveau message",
    deleteConversation: "Supprimer la conversation",
    blockUser: "Bloquer l'utilisateur",
    unblockUser: "Débloquer l'utilisateur",
    reportUser: "Signaler l'utilisateur",
    attachments: {
      image: "Image",
      file: "Fichier",
      audio: "Audio",
      video: "Vidéo"
    }
  },
  agenda: {
    title: "Agenda",
    appointmentDetails: "Détails du rendez-vous",
    patient: "Patient",
    date: "Date",
    time: "Heure",
    type: "Type",
    statusType: "Statut",
    newAppointment: "Nouveau rendez-vous",
    manageAppointment: "Gérer votre rendez-vous",
    modifyAppointment: "Changer de rendez-vous",
    requestedAppointment: "a demandé un rendez-vous",
    accept: "Accepter",
    decline: "Refuser",
    noAppointments: "Aucun rendez-vous",
    addAppointment: "Ajouter un rendez-vous",
    editAppointment: "Modifier le rendez-vous",
    monthView: "Vue mensuelle",
    dayView: "Vue journalière",
    appointmentTypes: {
      consultation: "Consultation",
      "follow-up": "Suivi",
      emergency: "Urgence",
      other: "Autre"
    },
    days: {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche"
    },
    months: {
      january: "Janvier",
      february: "Février",
      march: "Mars",
      april: "Avril",
      may: "Mai",
      june: "Juin",
      july: "Juillet",
      august: "Août",
      september: "Septembre",
      october: "Octobre",
      november: "Novembre",
      december: "Décembre"
    },
    timeSlots: {
      morning: "Matin",
      afternoon: "Après-midi",
      evening: "Soir",
      title: "Créneaux horaires"
    },
    status: {
      pending: "En attente",
      accepted: "Accepté",
      declined: "Refusé",
      cancelled: "Annulé"
    },
    hasAppointment: "Rendez-vous",
    blocked: "Bloqué",
    available: "Disponible",
    form: {
      firstName: "Prénom",
      lastName: "Nom",
      phone: "Téléphone",
      email: "Email",
      optional: "facultatif",
      appointmentType: "Motif du rendez-vous",
      note: "remarques pour le médecin",
      submit: "Demander un rendez-vous"
    }
  },
  appointmentRequests: {
    title: "Demandes de rendez-vous",
    subtitle: "Gérez les demandes de rendez-vous en attente",
    noRequests: "Aucune demande de rendez-vous en attente",
    accept: "Accepter",
    decline: "Refuser",
    note: "Note du patient",
    viewNote: "Voir la note"
  },
  tableauDeBord: {
    dashboard: 'Tableau de bord',
    totalAppointments: 'Nombre total de rendez-vous',
    upcomingAppointments: 'Rendez-vous à venir',
    totalAccounts: 'Nombre de comptes',
    totalAnnouncements: "Nombre d'annonces",
    upcoming: 'à venir',
    allAppointments: 'tous les rendez-vous',
    createdAccounts: 'comptes créés',
    publishedAnnouncements: 'annonces publiées',
  },
  auth: {
    login: "Connexion",
    register: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    fullName: "Nom complet",
    clinicCode: "Code de la clinique",
    verifyCode: "Vérifier le code",
    verifying: "Vérification en cours...",
    registering: "Inscription en cours...",
    loggingIn: "Connexion en cours...",
    back: "Retour",
    chooseRole: "Choisissez votre rôle",
    roleSelectionMessage: "Sélectionnez le type de compte que vous souhaitez créer",
    registerAsPatient: "S'inscrire en tant que patient",
    registerAsDoctor: "S'inscrire en tant que médecin",
    patientRegistrationMessage: "Créez votre compte patient pour prendre rendez-vous",
    doctorRegistrationMessage: "Créez votre compte médecin pour gérer votre cabinet",
    registrationSuccess: "Inscription réussie",
    confirmationEmailSent: "Un email de confirmation a été envoyé à votre adresse email",
    loginMessage: "Connectez-vous à votre compte",
    emailRequired: "L'email est requis",
    passwordRequired: "Le mot de passe est requis",
    confirmPasswordRequired: "La confirmation du mot de passe est requise",
    fullNameRequired: "Le nom complet est requis",
    clinicCodeRequired: "Le code de la clinique est requis",
    invalidEmail: "Email invalide",
    passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
    invalidClinicCode: "Code de clinique invalide",
    verificationError: "Erreur lors de la vérification du code",
    registrationError: "Erreur lors de l'inscription",
    loginError: "Identifiants invalides",
    requiredFields: "Tous les champs sont requis",
    noAccount: "Vous n'avez pas de compte ?",
  },
  announcements: {
    title: "Annonces",
    subtitle: "Gérez et publiez vos annonces",
    addButton: "Ajouter une annonce",
    noAnnouncements: "Aucune annonce pour le moment",
    addAnnouncementHint: "Cliquez sur \"Ajouter une annonce\" pour commencer",
    addModal: {
      title: "Ajouter une annonce",
      titleLabel: "Titre de l'annonce",
      titlePlaceholder: "Titre de l'annonce",
      contentLabel: "Contenu",
      contentPlaceholder: "Contenu de l'annonce",
      photoLabel: "Photo (optionnelle)",
      addPhoto: "Ajouter une photo",
      removePhoto: "Supprimer la photo",
      cancel: "Annuler",
      publish: "Publier",
      update: "Mettre à jour"
    },
    deleteModal: {
      title: "Supprimer l'annonce",
      confirmation: "Êtes-vous sûr de vouloir supprimer l'annonce \"{{title}}\" ?",
      warning: "Cette action est irréversible.",
      cancel: "Annuler",
      delete: "Supprimer"
    },
    card: {
      delete: "Supprimer"
    }
  },
  roles: {
    doctor: "Médecin",
    patient: "Patient",
    cardiologist: "Cardiologue",
    dermatologist: "Dermatologue",
    ophthalmologist: "Ophtalmologue",
    gynecologist: "Gynécologue",
    pediatrician: "Pédiatre"
  },
}; 