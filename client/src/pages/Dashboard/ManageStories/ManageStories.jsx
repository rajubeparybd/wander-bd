/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "react-hot-toast";
import useStories from "../../../hooks/useStories";
import {
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiImage,
  FiBookOpen,
  FiEye,
  FiMoreVertical,
} from "react-icons/fi";

const ManageStories = () => {
  const { stories, isLoading, refetch } = useStories();
  const [deletingId, setDeletingId] = useState(null);
  const [expandedStory, setExpandedStory] = useState(null);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this story?");
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/stories/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (result.deletedCount > 0) {
        toast.success("Story deleted successfully!");
        refetch();
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#29AB87] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black mb-2">
          Manage Your{" "}
          <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
            Stories
          </span>
        </h1>
        <p className="text-gray-600 text-lg">
          Edit or delete your travel stories
        </p>
      </motion.div>

      {/* Stories Grid */}
      {stories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-16 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center">
            <FiBookOpen className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-black mb-2">No Stories Yet</h3>
          <p className="text-gray-600 mb-6">
            Start sharing your travel experiences!
          </p>
          <Link to="/dashboard/add-story">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              Add Your First Story
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {story.images && story.images.length > 0 ? (
                    <div className="relative w-full h-full">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={story.images[0]}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                      {story.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-sm text-white rounded-full text-sm font-semibold flex items-center gap-1">
                          <FiImage className="w-4 h-4" />
                          {story.images.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#29AB87]/20 to-[#4F46E5]/20">
                      <FiImage className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-black text-white mb-1 line-clamp-2">
                      {story.title}
                    </h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      {formatDate(story.date)}
                    </div>
                    {story.authorName && (
                      <div className="flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        {story.authorName}
                      </div>
                    )}
                  </div>

                  {/* Story Text */}
                  <p className="text-gray-700 leading-relaxed line-clamp-3">
                    {story.text}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Link
                      to={`/dashboard/edit-story/${story._id}`}
                      className="flex-1"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <FiEdit className="w-5 h-5" />
                        Edit
                      </motion.button>
                    </Link>
                    
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDelete(story._id)}
                      disabled={deletingId === story._id}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow ${
                        deletingId === story._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {deletingId === story._id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <FiTrash2 className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ManageStories;
