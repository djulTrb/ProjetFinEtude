import { useState } from "react";
import { Plus } from "phosphor-react";
import { useTranslation } from "react-i18next";
import { initialAnnouncements } from "./announcements/utils";
import { AddModal, DeleteModal } from "./announcements/AnnouncementModals";
import { useSelector } from "react-redux";

export default function Annonces() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const filteredAnnouncements = user.role.toLowerCase() === 'patient' 
    ? announcements.filter(announcement => announcement.author.toLowerCase().includes('dr.'))
    : announcements;

  const handleDelete = (id) => {
    setSelectedAnnouncement(announcements.find((a) => a.id === id));
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setAnnouncements(
      announcements.filter((a) => a.id !== selectedAnnouncement.id)
    );
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

  const handleAdd = (e) => {
    e.preventDefault();
    const now = new Date();
    const newPost = {
      id: announcements.length + 1,
      ...newAnnouncement,
      date: now.toISOString().split("T")[0],
      image: imagePreview,
    };
    setAnnouncements([newPost, ...announcements]);
    setNewAnnouncement({ title: "", content: "", image: null });
    setImagePreview(null);
    setShowAddModal(false);
  };

  return (
    <div className="w-full max-w-[2000px] mx-auto py-4 sm:py-6 px-2 sm:px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            {t('announcements.title')}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {t('announcements.subtitle')}
          </p>
        </div>
        {user.role.toLowerCase() === 'doctor' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 border bg-stone-200 bg-opacity-50 border-stone-300 text-blue-500 font-bold rounded-xl text-sm font-medium w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus weight="bold" className="text-lg" />
            <span>{t('announcements.addButton')}</span>
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6">
        {filteredAnnouncements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 text-lg">{t('announcements.noAnnouncements')}</p>
            {user.role.toLowerCase() === 'doctor' && (
              <p className="text-gray-400 text-sm mt-2">{t('announcements.addAnnouncementHint')}</p>
            )}
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {announcement.image && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-800 mb-1.5">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                    {user.role.toLowerCase() === 'doctor' && (
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium shrink-0"
                      >
                        {t('announcements.card.delete')}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{announcement.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {user.role.toLowerCase() === 'doctor' && (
        <>
          <AddModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            newAnnouncement={newAnnouncement}
            setNewAnnouncement={setNewAnnouncement}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            handleImageChange={handleImageChange}
            handleAdd={handleAdd}
          />

          <DeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            announcement={selectedAnnouncement}
          />
        </>
      )}
    </div>
  );
}
