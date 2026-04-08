import { useDispatch } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { clearToken } from "@/redux/features/token-slice";
import { FaUser, FaShoppingBag, FaSignOutAlt } from "react-icons/fa";

const Profile = () => {
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(clearToken());
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row min-h-[600px] gap-6 p-4">
      <div className="w-full md:w-[280px] bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-white">
          My Account
        </h2>

        <nav className="flex flex-col gap-2 profile">
          <NavLink
            to="self"
            className="flex items-center gap-3 p-2 rounded-md text-gray-700 dark:text-gray-200 transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FaUser className="text-lg" /> Profile
          </NavLink>

          <NavLink
            to="order"
            className="flex items-center gap-3 p-2 rounded-md text-gray-700 dark:text-gray-200 transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FaShoppingBag className="text-lg" /> Orders
          </NavLink>

          <button
            onClick={handleLogOut}
            className="mt-4 flex items-center gap-3 p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200"
          >
            <FaSignOutAlt className="text-lg" /> Log out
          </button>
        </nav>
      </div>

      <div className="flex-1 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
