/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
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

const AddPackage = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
  const [selectedImages, setSelectedImages] = useState([]);

  const selectedFiles = watch("images");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addPackageMutation = useMutation({
    mutationFn: async (newPackage) => {
      const imageURLs = [];

      for (let i = 0; i < newPackage.images.length; i++) {
        const formData = new FormData();
        formData.append("image", newPackage.images[i]);

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

      const finalPackage = {
        title: newPackage.title,
        description: newPackage.description,
        location: newPackage.location,
        duration: newPackage.duration,
        price: newPackage.price,
        category: newPackage.category,
        itinerary: newPackage.itinerary,
        images: imageURLs,
        rating: 0,
        reviews: [],
        createdAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/packages", finalPackage);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Package added successfully!");
      queryClient.invalidateQueries(["packages"]);
      reset();
      setSelectedImages([]);
    },
    onError: (error) => {
      toast.error("Failed to add package.");
      console.error(error);
    },
  });

  const onSubmit = (data) => {
    const files = selectedImages;
    if (!files || files.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    const packageData = {
      ...data,
      price: parseFloat(data.price),
      duration: parseInt(data.duration),
      images: files,
    };

    addPackageMutation.mutate(packageData);
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
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black mb-2">
          Add New{" "}
          <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
            Tour Package
          </span>
        </h1>
        <p className="text-gray-600 text-lg">
          Create an amazing travel experience for tourists
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                <FiX className="w-4 h-4" />
                {errors.title.message}
              </motion.p>
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
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                <FiX className="w-4 h-4" />
                {errors.description.message}
              </motion.p>
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
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <FiX className="w-4 h-4" />
                  {errors.location.message}
                </motion.p>
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
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <FiX className="w-4 h-4" />
                  {errors.duration.message}
                </motion.p>
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
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <FiX className="w-4 h-4" />
                  {errors.price.message}
                </motion.p>
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
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <FiX className="w-4 h-4" />
                  {errors.category.message}
                </motion.p>
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

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-3">
              <FiImage className="w-5 h-5 text-[#29AB87]" />
              Upload Images
            </label>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                {...register("images")}
                onChange={handleImageChange}
                className="hidden"
                id="package-image-upload"
              />
              <label
                htmlFor="package-image-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#29AB87] hover:bg-gray-50 transition-all"
              >
                <FiUpload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-600 font-semibold mb-1">
                  Click to upload package images
                </p>
                <p className="text-gray-400 text-sm">
                  PNG, JPG up to 10MB each
                </p>
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {selectedImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
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
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={addPackageMutation.isLoading}
            whileHover={{ scale: addPackageMutation.isLoading ? 1 : 1.02, y: addPackageMutation.isLoading ? 0 : -2 }}
            whileTap={{ scale: addPackageMutation.isLoading ? 1 : 0.98 }}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
              addPackageMutation.isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white hover:shadow-xl"
            }`}
          >
            {addPackageMutation.isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                />
                Creating Package...
              </>
            ) : (
              <>
                <FiCheck className="w-6 h-6" />
                Create Package
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddPackage;
