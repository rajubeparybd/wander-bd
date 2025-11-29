/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FiBookOpen,
  FiImage,
  FiX,
  FiUpload,
  FiCheck,
} from "react-icons/fi";

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

const AddStory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToImgBB = async () => {
    const uploadedUrls = [];

    for (const image of selectedImages) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          formData
        );
        uploadedUrls.push(response.data.data.url);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed. Please try again.");
        return null;
      }
    }

    return uploadedUrls;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const imageUrls = await uploadImagesToImgBB();
      if (!imageUrls) {
        setIsSubmitting(false);
        return;
      }

      const story = {
        title: data.title,
        text: data.text,
        authorName: user?.displayName || "Anonymous",
        authorEmail: user?.email,
        authorPhoto: user?.photoURL || "",
        date: new Date().toISOString(),
        images: imageUrls
      };

      const res = await axiosSecure.post("/stories", story);
      if (res.data.insertedId) {
        toast.success("Story added successfully!");
        reset();
        setSelectedImages([]);
        navigate("/dashboard/manage-stories");
      }
    } catch (err) {
      console.error("Story submission failed:", err);
      toast.error("Failed to add story.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black mb-2">
          Share Your{" "}
          <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
            Travel Story
          </span>
        </h1>
        <p className="text-gray-600 text-lg">
          Inspire others with your amazing travel experiences
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
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-3">
              <FiBookOpen className="w-5 h-5 text-[#29AB87]" />
              Story Title
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter a captivating title for your story"
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

          {/* Story Text */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-3">
              <FiBookOpen className="w-5 h-5 text-[#29AB87]" />
              Your Story
            </label>
            <textarea
              {...register("text", { required: "Story content is required" })}
              rows={8}
              placeholder="Share your travel experience, what made it special, the places you visited, the people you met..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg resize-none"
            ></textarea>
            {errors.text && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                <FiX className="w-4 h-4" />
                {errors.text.message}
              </motion.p>
            )}
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
                {...register("images", { required: selectedImages.length === 0 })}
                onChange={onImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#29AB87] hover:bg-gray-50 transition-all"
              >
                <FiUpload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-600 font-semibold mb-1">
                  Click to upload images
                </p>
                <p className="text-gray-400 text-sm">
                  PNG, JPG up to 10MB each
                </p>
              </label>
            </div>
            
            {errors.images && selectedImages.length === 0 && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                <FiX className="w-4 h-4" />
                Please upload at least one image
              </motion.p>
            )}
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
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                />
                Uploading...
              </>
            ) : (
              <>
                <FiCheck className="w-6 h-6" />
                Publish Story
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddStory;
