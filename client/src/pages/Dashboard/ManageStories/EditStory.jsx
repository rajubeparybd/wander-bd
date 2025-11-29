import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";

const EditStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxios();
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [newImages, setNewImages] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [removingImageUrl, setRemovingImageUrl] = useState(null);

  // Fetch story
  const { data: story, isLoading } = useQuery({
    queryKey: ["story", id],
    queryFn: async () => {
      const res = await axios.get(`/stories/${id}`);
      const { title, text } = res.data;
      setValue("title", title);
      setValue("text", text);
      return res.data;
    },
    enabled: !!id,
  });

  // Remove image mutation
  const removeImageMutation = useMutation({
    mutationFn: (imgUrl) => axios.put(`/stories/${id}/remove-image`, { image: imgUrl }),
    onMutate: (imgUrl) => {
      setRemovingImageUrl(imgUrl);
      toast.loading("Removing image...", { id: "remove-image" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["story", id]);
      toast.success("Image removed successfully!", { id: "remove-image" });
      setRemovingImageUrl(null);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to remove image. Please try again.";
      toast.error(errorMessage, { id: "remove-image" });
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
      setRemovingImageUrl(null);
    },
  });

  const handleRemoveImage = async (img) => {
    const result = await Swal.fire({
      title: "Remove Image?",
      text: "Are you sure you want to remove this image?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, remove it",
    });
    if (result.isConfirmed) {
      removeImageMutation.mutate(img);
    }
  };

  // Upload new images
  const handleAddNewImages = async (e) => {
    const files = Array.from(e.target.files);
    const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;

    setImageUploading(true); // Start loading

    const uploads = files.map((file) => {
      const formData = new FormData();
      formData.append("image", file);
      return fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) return result.data.url;
          else throw new Error("Upload failed");
        });
    });

    try {
      const urls = await Promise.all(uploads);
      setNewImages((prev) => [...prev, ...urls]);
    } catch (err) {
      console.error(err);
      toast.error("One or more uploads failed.");
    } finally {
      setImageUploading(false); // Stop loading
    }
  };

  // Update story mutation
  const updateStoryMutation = useMutation({
    mutationFn: (data) => axios.put(`/stories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["story", id]);
      toast.success("Story updated!");
      navigate("/dashboard/manage-stories");
    },
  });

  // On form submit
  const onSubmit = (data) => {
    const payload = {
      title: data.title,
      text: data.text,
      newImages,
    };
    updateStoryMutation.mutate(payload);
  };

  if (isLoading || !story) return <p className="p-4">Loading story...</p>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-6">Edit Story</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full border p-2 rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            {...register("text", { required: true })}
            className="w-full border p-2 rounded h-32"
          />
          {errors.text && <p className="text-red-500 text-sm">Description is required</p>}
        </div>

        <div>
          <label className="block font-semibold mb-2">Current Images</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {story.images?.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="story" className="rounded h-32 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img)}
                  disabled={removingImageUrl === img}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {removingImageUrl === img ? "Removing..." : "Remove"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1 mt-4">Add New Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleAddNewImages}
            className="border p-2 rounded w-full"
          />

          {imageUploading && (
            <div className="flex items-center gap-2 mt-2 text-blue-600">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Uploading images...
            </div>
          )}

          {newImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
              {newImages.map((url, idx) => (
                <img key={idx} src={url} className="h-32 w-full object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={imageUploading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {imageUploading ? "Uploading..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditStory;
