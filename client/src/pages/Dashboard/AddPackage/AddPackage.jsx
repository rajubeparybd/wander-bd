import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const AddPackage = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  const selectedFiles = watch("images"); // ✅ Watch for file input

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
        images: imageURLs, // ✅ Save uploaded URLs
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
    },
    onError: (error) => {
      toast.error("Failed to add package.");
      console.error(error);
    },
  });

  const onSubmit = (data) => {
    const files = selectedFiles;
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

    console.log("Submitting package data:", packageData);
    addPackageMutation.mutate(packageData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#29AB8760] rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Add New Tour Package</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="font-semibold">Package Title</label>
          <input
            {...register("title", { required: true })}
            className="input input-bordered w-full"
            placeholder="Example: Cox's Bazar Sea Tour"
          />
        </div>

        <div>
          <label className="font-semibold">Short Description</label>
          <textarea
            {...register("description", { required: true })}
            className="textarea textarea-bordered w-full"
            placeholder="Write a short description..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Location</label>
            <input
              {...register("location", { required: true })}
              className="input input-bordered w-full"
              placeholder="e.g., Bandarban"
            />
          </div>

          <div>
            <label className="font-semibold">Duration (in days)</label>
            <input
              type="number"
              {...register("duration", { required: true })}
              className="input input-bordered w-full"
              placeholder="e.g., 5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Price (USD)</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { required: true })}
              className="input input-bordered w-full"
              placeholder="e.g., 350"
            />
          </div>

          <div>
            <label className="font-semibold">Category</label>
            <select
              {...register("category", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="Adventure">Adventure</option>
              <option value="Beach">Beach</option>
              <option value="Cultural">Cultural</option>
              <option value="Mountain">Mountain</option>
              <option value="Historical">Historical</option>
              <option value="Wildlife">Wildlife</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold">Upload Images</label>
          <input
            type="file"
            multiple
            {...register("images")}
            className="file-input file-input-bordered w-full"
            accept="image/*"
          />
        </div>

        <div>
          <label className="font-semibold">Itinerary</label>
          <textarea
            {...register("itinerary")}
            className="textarea textarea-bordered w-full"
            placeholder="Day 1: Arrival, Day 2: Sightseeing, ..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-error w-full mt-2"
          disabled={addPackageMutation.isLoading}
        >
          {addPackageMutation.isLoading ? "Submitting..." : "Add Package"}
        </button>
      </form>
    </div>
  );
};

export default AddPackage;
