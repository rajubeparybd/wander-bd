import { useForm } from "react-hook-form";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const JoinAsTourGuide = () => {
  const { register, handleSubmit, reset } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // ✅ get logged-in user

  const onSubmit = async (data) => {
    try {
      const applicationData = {
        ...data,
        name: user?.displayName || "Unknown",
        email: user?.email,
        photoURL: user?.photoURL || "",
        status: "pending",
        submittedAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/applications", applicationData);

      if (res.data.insertedId || res.data.success) {
        setIsOpen(true);
        reset();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Application submission error:", error);
      alert("Failed to submit application.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Apply to Become a Tour Guide</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-[#29AB8760] shadow-md rounded-lg p-6"
      >
        <div>
          <label className="block font-medium">Application Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full mt-1 input input-bordered"
            placeholder="e.g. Experienced Travel Enthusiast"
          />
        </div>

        <div>
          <label className="block font-medium">Why do you want to be a Tour Guide?</label>
          <textarea
            {...register("reason", { required: true })}
            className="w-full mt-1 textarea textarea-bordered"
            rows="4"
            placeholder="Share your passion, experience, or interest"
          ></textarea>
        </div>

        {/* ✅ New Input: Experience */}
        <div>
          <label className="block font-medium">Experience</label>
          <input
            type="text"
            {...register("experience", { required: true })}
            className="w-full mt-1 input input-bordered"
            placeholder="e.g. 3 years in Dhaka, Cox's Bazar, and Bandarban"
          />
        </div>

        {/* ✅ New Input: Languages */}
        <div>
          <label className="block font-medium mb-1">Languages</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Bangla",
              "English",
              "Hindi",
              "Arabic",
              "Mandarin",
              "Spanish",
              "French",
              "Russian",
              "German",
              "Japanese",
            ].map((lang) => (
              <label key={lang} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={lang}
                  {...register("languages", { required: true })}
                  className="checkbox checkbox-primary"
                />
                <span>{lang}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Select one or more languages.</p>
        </div>


        {/* ✅ New Input: Specialty */}
        <div>
          <label className="block font-medium">Specialty</label>
          <textarea
            {...register("specialty", { required: true })}
            className="w-full mt-1 textarea textarea-bordered"
            rows="2"
            placeholder="e.g. Mountain trekking, city tours, cultural experiences"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">CV/Portfolio Link</label>
          <input
            type="url"
            {...register("cvLink", { required: true })}
            className="w-full mt-1 input input-bordered"
            placeholder="https://your-cv-link.com"
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-error">
            Submit Application
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
            <Dialog.Title className="text-xl font-bold mb-2">
              🎉 Application Submitted!
            </Dialog.Title>
            <Dialog.Description>
              Thank you for applying. Our team will review your request and get back to you soon.
            </Dialog.Description>
            <div className="mt-4 text-right">
              <button onClick={() => setIsOpen(false)} className="btn btn-success">
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default JoinAsTourGuide;
