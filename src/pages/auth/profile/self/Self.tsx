import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useCheckTokenQuery, useDeleteAccountMutation } from "@/redux/api/customer-api";
import { clearToken } from "@/redux/features/token-slice";

const Self = () => {
  const { data } = useCheckTokenQuery(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      dispatch(clearToken());
      setShowConfirm(false);
      toast.success("Account deleted successfully", { position: "top-right" });
      navigate("/");
    } catch (err: any) {
      const raw = err?.data?.message;
      const message =
        typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "Failed to delete account";
      toast.error(message, { position: "top-right" });
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-xl">
        {/* User info */}
        <h2 className="text-2xl font-semibold mb-4">User Information</h2>
        <div className="flex flex-col gap-2">
          <p>
            <strong>Name:</strong> {data?.customer?.first_name}
          </p>
          <p>
            <strong>Surname:</strong> {data?.customer?.last_name}
          </p>
          <p>
            <strong>Phone:</strong> {data?.customer?.phone_number}
          </p>
          <p>
            <strong>Email:</strong> {data?.customer?.email}
          </p>
          <div>
            <button className="py-2 mt-3 px-4 bg-bg-primary text-white rounded-md">
              Edit Information
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="mt-10 border border-red-300 dark:border-red-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1">
            Danger Zone
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfirm(false);
          }}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Delete Account
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              This will permanently delete your account and all your data. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isDeleting && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {isDeleting ? "Deleting…" : "Delete my account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Self);
