export const initialAnnouncements = [
  {
    id: 1,
    title: "Nouveaux horaires de consultation",
    content:
      "À partir du 1er juin, les consultations seront disponibles de 8h à 18h du lundi au vendredi.",
    date: "2024-03-15",
    author: "Dr. Smith",
    image: null,
  },
  {
    id: 2,
    title: "Fermeture temporaire du laboratoire",
    content:
      "Le laboratoire sera fermé pour maintenance du 20 au 22 mars. Les urgences seront redirigées vers le laboratoire central.",
    date: "2024-03-14",
    author: "Dr. Smith",
    image: null,
  },
  {
    id: 3,
    title: "Nouveau service de téléconsultation",
    content:
      "Nous mettons en place un nouveau service de téléconsultation pour les suivis de routine. Contactez le secrétariat pour plus d'informations.",
    date: "2024-03-12",
    author: "Dr. Smith",
  },
];

export function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
} 