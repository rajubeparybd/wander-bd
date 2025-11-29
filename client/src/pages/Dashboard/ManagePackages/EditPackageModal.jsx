/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FiPackage,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiTag,
  FiImage,
  FiFileText,
  FiX,
  FiCheck,
  FiUpload,
} from "react-icons/fi";

const EditPackageModal = ({ packageData, onClose, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: packageData.title,
      description: packageData.description,
      location: packageData.location,
      duration: packageData.duration,
      price: packageData.price,
      category: packageData.category,
      itinerary: packageData.itinerary,
    }
  });
  const axiosSecure = useAxiosSecure();
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
  const [selectedImages, setSelectedImages] = useState([]);
  const [keepExistingImages, setKeepExistingImages] = useState(true);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    if (files.length > 0) {
      setKeepExistingImages(false);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const updatePackageMutation = useMutation({
    mutationFn: async (updateData) => {
      let imageURLs = packageData.images || [];

      // If new images are selected, upload them
      if (selectedImages.length > 0 && !keepExistingImages) {
        imageURLs = [];
        for (let i = 0; i < selectedImages.length; i++) {
          const formData = new FormData();
          formData.append("image", selectedImages[i]);

          const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await res.json();
          if (!data.success) throw new Error("Image upload failed");
          imageURLs.push(data.data.url);
        }
      }

      const finalPackage = {
        title: updateData.title,
        description: updateData.description,
        location: updateData.location,
        duration: updateData.duration,
        price: updateData.price,
        category: updateData.category,
        itinerary: updateData.itinerary,
        images: imageURLs,
        updatedAt: new Date().toISOString(),
      };

      const res = await axiosSecure.patch(`/packages/${packageData._id}`, finalPackage);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Package updated successfully!");
      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to update package.");
      console.error(error);
    },
  });

  const onSubmit = (data) => {
    const packageUpdateData = {
      ...data,
      price: parseFloat(data.price),
      duration: parseInt(data.duration),
    };

    updatePackageMutation.mutate(packageUpdateData);
  };

  const categories = [
    "Adventure",
    "Beach",
    "Cultural",
    "Mountain",
    "Historical",
    "Wildlife",
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl z-10">
            <h2 className="text-3xl font-black">
              Edit{" "}
              <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                Package
              </span>
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Package Title */}
            <div>
              <label className="flex items-center gap-2 text-lg font-bold mb-3">
                <FiPackage className="w-5 h-5 text-[#29AB87]" />
                Package Title
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                placeholder="e.g., Cox's Bazar Sea Tour"
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <FiX className="w-4 h-4" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-lg font-bold mb-3">
                <FiFileText className="w-5 h-5 text-[#29AB87]" />
                Description
              </label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={5}
                placeholder="Write a detailed description of the tour package..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg resize-none"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <FiX className="w-4 h-4" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Location & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-lg font-bold mb-3">
                  <FiMapPin className="w-5 h-5 text-[#29AB87]" />
                  Location
                </label>
                <input
                  {...register("location", { required: "Location is required" })}
                  placeholder="e.g., Bandarban"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <FiX className="w-4 h-4" />
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-bold mb-3">
                  <FiClock className="w-5 h-5 text-[#29AB87]" />
                  Duration (days)
                </label>
                <input
                  type="number"
                  {...register("duration", { required: "Duration is required", min: 1 })}
                  placeholder="e.g., 5"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <FiX className="w-4 h-4" />
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-lg font-bold mb-3">
                  <FiDollarSign className="w-5 h-5 text-[#29AB87]" />
                  Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", { required: "Price is required", min: 0 })}
                  placeholder="e.g., 350"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <FiX className="w-4 h-4" />
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-bold mb-3">
                  <FiTag className="w-5 h-5 text-[#29AB87]" />
                  Category
                </label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg appearance-none bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <FiX className="w-4 h-4" />
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <label className="flex items-center gap-2 text-lg font-bold mb-3">
                <FiFileText className="w-5 h-5 text-[#29AB87]" />
                Itinerary
              </label>
              <textarea
                {...register("itinerary")}
                rows={6}
                placeholder="Day 1: Arrival and check-in&#10;Day 2: Sightseeing tour&#10;Day 3: Adventure activities..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg resize-none"
              ></textarea>
            </div>

            {/* Current Images */}
            {keepExistingImages && packageData.images && packageData.images.length > 0 && (
              <div>
                <label className="flex items-center gap-2 text-lg font-bold mb-3">
                  <FiImage className="w-5 h-5 text-[#29AB87]" />
                  Current Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {packageData.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`current-${idx}`}
                      className="w-full h-32 object-cover rounded-2xl shadow-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-lg font-bold mb-3">
                <FiImage className="w-5 h-5 text-[#29AB87]" />
                {keepExistingImages ? "Upload New Images (Optional)" : "Upload New Images"}
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="edit-package-image-upload"
                />
                <label
                  htmlFor="edit-package-image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#29AB87] hover:bg-gray-50 transition-all"
                >
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 font-semibold text-sm">
                    Click to upload new images
                  </p>
                </label>
              </div>
            </div>

            {/* New Image Preview */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${idx}`}
                      className="w-full h-32 object-cover rounded-2xl shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updatePackageMutation.isLoading}
                className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
                  updatePackageMutation.isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white hover:shadow-xl"
                }`}
              >
                {updatePackageMutation.isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-6 h-6" />
                    Update Package
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditPackageModal;

