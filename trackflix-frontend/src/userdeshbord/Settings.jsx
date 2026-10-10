import React, { useState, useEffect } from "react";

const Settings = ({ user, onUpdateProfile }) => {
  // Local state for editable name input
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setDisplayName(user.displayName || "");
  }, [user.displayName]);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Call the passed in update function, which can do the API call
      if (onUpdateProfile) {
        await onUpdateProfile({ displayName });
      }

      setSuccessMessage("Profile updated successfully.");
    } catch {
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      <div className="bg-white p-6 rounded shadow-md space-y-6">

        {/* Editable Name */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="displayName"
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isSaving}
          />
        </div>

        {/* Readonly Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed"
            value={user.email}
            readOnly
          />
        </div>

        {/* Info Text */}
        <p className="text-sm text-gray-500">
          To change your email, please manage it through your Google/Firebase account.
        </p>

        {/* Action buttons and messages */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSave}
            disabled={isSaving || displayName.trim() === ""}
            className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          {successMessage && <p className="text-green-600">{successMessage}</p>}
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Settings;
