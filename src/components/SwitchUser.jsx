import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleRole } from "../redux/features/authSlice";
import { Shield, Eye } from "lucide-react";

const SwitchUser = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const isAdmin = user?.currentRole === "admin";

  return (
    <div className="flex items-center gap-4 bg-white border border-gray-200 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Viewer Icon & Label */}
      <div
        className={`flex items-center gap-2 transition-all duration-300 ${!isAdmin ? "text-blue-600 scale-110" : "text-gray-400 scale-100 opacity-50"}`}
      >
        <Eye
          size={18}
          className={`${!isAdmin ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}`}
        />
      </div>

      {/* The Smooth Toggle Switch */}
      <label className="relative inline-flex items-center cursor-pointer group">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isAdmin}
          onChange={() => dispatch(toggleRole())}
        />
        {/* Main Track */}
        <div
          className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer 
                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-1 after:left-2
                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all after:duration-300
                        peer-checked:bg-blue-600 group-hover:bg-gray-300 peer-checked:group-hover:bg-blue-700"
        ></div>
      </label>

      {/* Admin Icon & Label */}
      <div
        className={`flex items-center gap-2 transition-all duration-300 ${isAdmin ? "text-blue-600 scale-110" : "text-gray-400 scale-100 opacity-50"}`}
      >
        <Shield
          size={18}
          className={`${isAdmin ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}`}
        />
      </div>
    </div>
  );
};

export default SwitchUser;
