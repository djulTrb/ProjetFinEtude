import { motion, AnimatePresence } from "framer-motion";
import { X } from "phosphor-react";

export default function NotificationsModal({ show, onClose, notifications }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-4 bg-white rounded-xl shadow-2xl z-50 overflow-hidden max-w-4xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">
                Notifications et Logs
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100/60 rounded-full"
              >
                <X weight="bold" className="text-[#4a5568]" />
              </button>
            </div>
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 mb-3 border border-gray-100 rounded-lg hover:bg-gray-100/60 transition-colors"
                >
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 