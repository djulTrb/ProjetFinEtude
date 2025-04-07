import { useState } from "react";
import { Plus } from "phosphor-react";
import { initialAnnouncements } from "./announcements/utils";
import AnnouncementCard from "./announcements/AnnouncementCard";
import { AddModal, DeleteModal } from "./announcements/AnnouncementModals";

export default function Annonces() {
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
      author: "Dr. Smith",
      image: imagePreview,
    };
    setAnnouncements([newPost, ...announcements]);
    setNewAnnouncement({ title: "", content: "", image: null });
    setImagePreview(null);
    setShowAddModal(false);
  };

  return (
    <div className="w-full max-w-[2000px] mx-auto py-4 sm:py-6 px-2 sm:px-4 md:px-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            Annonces
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Gérez et publiez vos annonces
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 border bg-stone-200 bg-opacity-50 border-stone-300 text-blue-500 font-bold rounded-xl text-sm font-medium w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus weight="bold" className="text-lg" />
          <span>Ajouter une annonce</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="grid gap-4 sm:gap-6">
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 text-lg">Aucune annonce pour le moment</p>
            <p className="text-gray-400 text-sm mt-2">Cliquez sur "Ajouter une annonce" pour commencer</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Modals */}
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
    </div>
  );
}
