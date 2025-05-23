import { motion, AnimatePresence } from "framer-motion";
import { X } from "phosphor-react";
import { useTranslation } from "react-i18next";
import AnnouncementForm from "./AnnouncementForm";

export function AddModal({ 
  isOpen, 
  onClose, 
  newAnnouncement, 
  setNewAnnouncement, 
  imagePreview, 
  setImagePreview, 
  handleImageChange,
  handleAdd 
}) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {t('announcements.addModal.title')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 rounded-lg"
              >
                <X weight="bold" className="text-xl" />
              </button>
            </div>
            <AnnouncementForm
              onSubmit={handleAdd}
              isEdit={false}
              newAnnouncement={newAnnouncement}
              setNewAnnouncement={setNewAnnouncement}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              handleImageChange={handleImageChange}
              onCancel={onClose}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DeleteModal({ isOpen, onClose, onConfirm, announcement }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {t('announcements.deleteModal.title')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('announcements.deleteModal.confirmation', { title: announcement?.title })}
              <br />
              {t('announcements.deleteModal.warning')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
              >
                {t('announcements.deleteModal.cancel')}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                {t('announcements.deleteModal.delete')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 