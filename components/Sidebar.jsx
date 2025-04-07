import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  House,
  Megaphone,
  ChatText,
  CalendarCheck,
  Gear,
  CaretLeft,
  CaretRight
} from "phosphor-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <motion.nav
      initial={false}
      animate={{
        width: isOpen ? "240px" : "64px",
      }}
      transition={{ duration: 0.2 }}
      className="bg-white border-r border-gray-200 shadow-sm relative h-screen"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 bg-white rounded-full p-1.5 shadow-md z-10 border border-gray-200"
      >
        {isOpen ? <CaretLeft size={14} /> : <CaretRight size={14} />}
      </button>

      <ul className="space-y-2 pt-8">
        <li>
          <Link
            to="/"
            className="flex items-center h-12 px-4 text-gray-700 hover:bg-gray-100/60 rounded-lg transition-colors mx-2"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <House weight="duotone" className="text-2xl text-[#2c5282]" />
            </div>
            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
              className="ml-3 text-base"
            >
              Accueil
            </motion.span>
          </Link>
        </li>
        <li>
          <Link
            to="/annonces"
            className="flex items-center h-12 px-4 text-gray-700 hover:bg-gray-100/60 rounded-lg transition-colors mx-2"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Megaphone weight="duotone" className="text-2xl text-[#34657F]" />
            </div>
            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
              className="ml-3 text-base"
            >
              Annonces
            </motion.span>
          </Link>
        </li>
        <li>
          <Link
            to="/messagerie"
            className="flex items-center h-12 px-4 text-gray-700 hover:bg-gray-100/60 rounded-lg transition-colors mx-2"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <ChatText weight="duotone" className="text-2xl text-[#3b7a9b]" />
            </div>
            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
              className="ml-3 text-base"
            >
              Messagerie
            </motion.span>
          </Link>
        </li>
        <li>
          <Link
            to="/agenda"
            className="flex items-center h-12 px-4 text-gray-700 hover:bg-gray-100/60 rounded-lg transition-colors mx-2"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <CalendarCheck weight="duotone" className="text-2xl text-[#45818e]" />
            </div>
            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
              className="ml-3 text-base"
            >
              Agenda
            </motion.span>
          </Link>
        </li>
        <li>
          <Link
            to="/parametres"
            className="flex items-center h-12 px-4 text-gray-700 hover:bg-gray-100/60 rounded-lg transition-colors mx-2"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Gear weight="duotone" className="text-2xl text-[#4a5568]" />
            </div>
            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
              className="ml-3 text-base"
            >
              Parametres
            </motion.span>
          </Link>
        </li>
      </ul>
    </motion.nav>
  );
} 