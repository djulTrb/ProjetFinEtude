import { Image } from "phosphor-react";

export default function AnnouncementForm({ 
  onSubmit, 
  isEdit, 
  newAnnouncement, 
  setNewAnnouncement, 
  imagePreview, 
  setImagePreview, 
  handleImageChange,
  onCancel 
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col h-full">
      <div className="flex-1 p-3 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre de l'annonce
          </label>
          <input
            type="text"
            required
            value={newAnnouncement.title}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
            }
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
            onChange={(e) =>
              setNewAnnouncement({
                ...newAnnouncement,
                content: e.target.value,
              })
            }
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
            <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 rounded-lg cursor-pointer border border-gray-200 w-full sm:w-auto justify-center sm:justify-start">
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
                  setNewAnnouncement({ ...newAnnouncement, image: null });
                }}
                className="text-red-600 text-sm self-start sm:self-auto"
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
          onClick={onCancel}
          className="px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg text-sm"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-3 sm:px-4 py-2 bg-sky-600 text-white rounded-lg text-sm"
        >
          {isEdit ? "Mettre à jour" : "Publier"}
        </button>
      </div>
    </form>
  );
} 