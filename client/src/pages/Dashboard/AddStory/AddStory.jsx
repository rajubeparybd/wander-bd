import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios"; // Required for image and story upload
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

const AddStory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);

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
    const imageUrls = await uploadImagesToImgBB();
    if (!imageUrls) return;

    const story = {
      title: data.title,
      text: data.text,
      authorName: user?.displayName || "Anonymous",
      authorEmail: user?.email,
      authorPhoto: user?.photoURL || "",
      date: new Date().toISOString(),
      images: imageUrls
    };

    try {
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
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Your Travel Story</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#29AB8760] shadow-md p-6 rounded-lg space-y-4"
      >
        {/* Title */}
        <div>
          <label className="font-semibold block mb-1">Story Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            placeholder="Enter a title for your story"
            className="w-full border px-4 py-2 rounded bg-white"
          />
          {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
        </div>

        {/* Text */}
        <div>
          <label className="font-semibold block mb-1">Story Text</label>
          <textarea
            {...register("text", { required: true })}
            rows={5}
            placeholder="Write your experience here..."
            className="w-full border px-4 py-2 rounded bg-white"
          ></textarea>
          {errors.text && <p className="text-red-500 text-sm">Text is required</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="font-semibold block mb-1">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            {...register("images", { required: true })}
            onChange={onImageChange}
            className="w-full border px-2 py-2 rounded bg-white"
          />
          {errors.images && (
            <p className="text-red-500 text-sm">Please upload at least one image</p>
          )}
        </div>

        {/* Image Preview */}
        {selectedImages.length > 0 && (
          <div className="flex gap-3 flex-wrap mt-2">
            {selectedImages.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover rounded shadow"
              />
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-error text-black py-2 rounded"
        >
          Submit Story
        </button>
      </form>
    </div>
  );
};

export default AddStory;
