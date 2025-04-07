import { useState } from "react";
import { Plus, X, Image } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";

const initialAnnouncements = [
  {
    id: 1,
    title: "Nouveaux horaires de consultation",
    content: "À partir du 1er juin, les consultations seront disponibles de 8h à 18h du lundi au vendredi.",
    date: "2024-03-15",
    author: "Dr. Smith",
    department: "Médecine générale",
    image: null
  },
  {
    id: 2,
    title: "Fermeture temporaire du laboratoire",
    content: "Le laboratoire sera fermé pour maintenance du 20 au 22 mars. Les urgences seront redirigées vers le laboratoire central.",
    date: "2024-03-14",
    author: "Dr. Smith",
    department: "Administration",
    image: null
  },
  {
    id: 3,
    title: "Nouveau service de téléconsultation",
    content: "Nous mettons en place un nouveau service de téléconsultation pour les suivis de routine. Contactez le secrétariat pour plus d'informations.",
    date: "2024-03-12",
    author: "Dr. Smith",
    department: "Médecine générale"
  }
];

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

export default function Annonces() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleDelete = (id) => {
    setSelectedAnnouncement(announcements.find(a => a.id === id));
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setAnnouncements(announcements.filter(a => a.id !== selectedAnnouncement.id));
    setShowDeleteModal(false);
    setSelectedAnnouncement(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewAnnouncement({ ...newAnnouncement, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      image: announcement.image
    });
    setImagePreview(announcement.image);
    setShowEditModal(true);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const now = new Date();
    const newPost = {
      id: announcements.length + 1,
      ...newAnnouncement,
      date: now.toISOString().split('T')[0],
      author: "Dr. Smith",
      image: imagePreview
    };
    setAnnouncements([newPost, ...announcements]);
    setNewAnnouncement({ title: "", content: "", image: null });
    setImagePreview(null);
    setShowAddModal(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setAnnouncements(announcements.map(a => 
      a.id === selectedAnnouncement.id 
        ? { 
            ...a, 
            title: newAnnouncement.title, 
            content: newAnnouncement.content,
            image: imagePreview
          }
        : a
    ));
    setShowEditModal(false);
    setSelectedAnnouncement(null);
    setNewAnnouncement({ title: "", content: "", image: null });
    setImagePreview(null);
  };

  const AnnouncementForm = ({ onSubmit, isEdit }) => (
    <form onSubmit={onSubmit} className="flex flex-col h-full">
      <div className="flex-1 p-3 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre de l'annonce
          </label>
          <input
            type="text"
            required
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm sm:text-base"
            placeholder="Titre de l'annonce"
            maxLength={150}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenu
          </label>
          <textarea
            required
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm sm:text-base"
            placeholder="Contenu de l'annonce"
            maxLength={3000}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo (optionnelle)
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-4">
            <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200 w-full sm:w-auto justify-center sm:justify-start">
              <Image weight="duotone" className="text-xl" />
              <span className="text-sm">Ajouter une photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setNewAnnouncement({...newAnnouncement, image: null});
                }}
                className="text-red-600 text-sm hover:text-red-700 self-start sm:self-auto"
              >
                Supprimer la photo
              </button>
            )}
          </div>
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="max-h-36 sm:max-h-48 rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => {
            isEdit ? setShowEditModal(false) : setShowAddModal(false);
            setNewAnnouncement({ title: "", content: "", image: null });
            setImagePreview(null);
          }}
          className="px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-3 sm:px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm"
        >
          {isEdit ? 'Mettre à jour' : 'Publier'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="w-full max-w-[2000px] mx-auto py-4 sm:py-6 px-2 sm:px-4 md:px-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Annonces</h1>
          <p className="text-gray-500 text-sm sm:text-base">Gérez et publiez vos annonces</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl w-full sm:w-auto justify-center sm:justify-start group"
        >
          <Plus weight="bold" className="text-lg group-hover:rotate-90 transition-transform duration-300" />
          <span>Ajouter une annonce</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="grid gap-4 sm:gap-6">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {announcement.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-gray-50 px-2 py-1 rounded-full">{formatDate(announcement.date)}</span>
                  <span>•</span>
                  <span className="bg-gray-50 px-2 py-1 rounded-full">Publié par {announcement.author}</span>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(announcement.id)}
                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-300 self-start sm:self-auto"
              >
                <X weight="bold" className="text-lg" />
              </button>
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
              {announcement.content}
            </p>
            {announcement.image && (
              <div className="rounded-xl overflow-hidden">
                <img
                  src={announcement.image}
                  alt=""
                  className="w-full h-48 sm:h-64 object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedAnnouncement(null);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl z-50 p-6 max-w-sm w-full mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Confirmer la suppression
                </h3>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedAnnouncement(null);
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add/Edit Announcement Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => {
                showAddModal ? setShowAddModal(false) : setShowEditModal(false);
                setNewAnnouncement({ title: "", content: "", image: null });
                setImagePreview(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-4 bg-white rounded-xl shadow-2xl z-50 overflow-hidden max-w-2xl mx-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {showEditModal ? 'Modifier l\'annonce' : 'Nouvelle Annonce'}
                </h2>
                <button
                  onClick={() => {
                    showAddModal ? setShowAddModal(false) : setShowEditModal(false);
                    setNewAnnouncement({ title: "", content: "", image: null });
                    setImagePreview(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X weight="bold" className="text-gray-600" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <AnnouncementForm onSubmit={showEditModal ? handleUpdate : handleAdd} isEdit={showEditModal} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 