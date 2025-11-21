import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const BookingForm = ({ price, packageName, user, guides }) => {
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      packageName: packageName || "",
      touristName: user?.name || "",
      touristEmail: user?.email || "",
      touristImage: user?.photoURL || "",
      price: price || "",
      tourDate: new Date(),
      tourGuide: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const selectedGuide = JSON.parse(data.tourGuide);

      const bookingData = {
        ...data,
        tourGuideName: selectedGuide.name,
        tourGuideEmail: selectedGuide.email,
        status: "Pending",
      };

      // Optional: remove original field to avoid confusion
      delete bookingData.tourGuide;

      const res = await axiosSecure.post("/bookings", bookingData);

      if (res.data.insertedId || res.data.acknowledged) {
        alert("Booking successful!");
        reset();
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto bg-[#29AB8760] p-6 rounded-lg shadow-md"
    >
      {/* Package Name (read-only) */}
      <div>
        <label className="block font-semibold mb-1">Name of the Package</label>
        <input
          type="text"
          {...register("packageName")}
          className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          readOnly
        />
      </div>

      {/* Tourist Name (read-only) */}
      <div>
        <label className="block font-semibold mb-1">Tourist Name</label>
        <input
          type="text"
          {...register("touristName")}
          className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          readOnly
        />
      </div>

      {/* Tourist Email (read-only) */}
      <div>
        <label className="block font-semibold mb-1">Tourist Email</label>
        <input
          type="email"
          {...register("touristEmail")}
          className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          readOnly
        />
      </div>

      {/* Tourist Image URL (read-only) */}
      <div>
        <label className="block font-semibold mb-1">Tourist Image URL</label>
        <input
          type="text"
          {...register("touristImage")}
          className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          readOnly
        />
      </div>

      {/* Price (read-only) */}
      <div>
        <label className="block font-semibold mb-1">Price</label>
        <input
          type="number"
          {...register("price")}
          readOnly
          className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Tour Date */}
      <div>
        <label className="block font-semibold mb-1">Tour Date</label>
        <Controller
          control={control}
          name="tourDate"
          rules={{ required: "Tour date is required" }}
          render={({ field }) => (
            <DatePicker
              className={`input input-bordered w-full ${errors.tourDate ? "border-error" : ""}`}
              placeholderText="Select a date"
              selected={field.value}
              onChange={field.onChange}
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
            />
          )}
        />
        {errors.tourDate && (
          <p className="text-error mt-1 text-sm">{errors.tourDate.message}</p>
        )}
      </div>

      {/* Tour Guide Dropdown */}
      <div>
        <label className="block font-semibold mb-1">Tour Guide Name</label>
        <select
          {...register("tourGuide", { required: "Please select a tour guide" })}
          className={`select select-bordered w-full ${errors.tourGuide ? "border-error" : ""}`}
          defaultValue=""
        >
          <option value="" disabled>
            Select a tour guide
          </option>
          {guides.map((guide) => (
            <option
              key={guide.id}
              value={JSON.stringify({ name: guide.name, email: guide.email })}
            >
              {guide.name}
            </option>
          ))}
        </select>
        {errors.tourGuide && (
          <p className="text-error mt-1 text-sm">{errors.tourGuide.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-error w-full text-lg font-semibold"
      >
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;
