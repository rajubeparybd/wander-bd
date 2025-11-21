import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase.init"; 
import toast from "react-hot-toast";

const EditProfileModal = ({ user, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      photoURL: user?.photoURL || "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: data.photoURL,
      });

      toast.success("Profile updated successfully!");
      reset(data);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl space-y-4">
          <Dialog.Title className="text-xl font-semibold text-center">
            Edit Profile
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block font-medium">Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                className="input input-bordered w-full"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block font-medium">Photo URL</label>
              <input
                {...register("photoURL", { required: "Photo URL is required" })}
                type="text"
                className="input input-bordered w-full"
              />
              {errors.photoURL && <p className="text-red-500 text-sm">{errors.photoURL.message}</p>}
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                value={user?.email}
                readOnly
                className="input input-bordered w-full bg-gray-100 text-gray-500"
              />
            </div>

            <div>
              <label className="block font-medium">Role</label>
              <input
                value={user?.role || "Tourist"}
                readOnly
                className="input input-bordered w-full bg-gray-100 text-gray-500 capitalize"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditProfileModal;
