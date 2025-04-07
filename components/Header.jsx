import { Bell, User } from "phosphor-react";

export default function Header({ onShowNotifications }) {
  const user = {
    name: "John Doe",
    role: "Doctor",
    avatar: null
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User weight="duotone" className="text-white text-xl" />
            )}
          </div>
          <div>
            <h2 className="font-medium text-gray-800">Bonjour, {user.name}</h2>
            <p className="text-sm text-gray-600">{user.role}</p>
          </div>
        </div>

        <button
          onClick={onShowNotifications}
          className="p-2 hover:bg-gray-100/60 rounded-full relative"
        >
          <Bell weight="duotone" className="text-[#2c5282] text-xl" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#dc3545] rounded-full"></span>
        </button>
      </div>
    </header>
  );
} 