import { useState } from "react";

const destinations = ["Cox’s Bazar", "Sundarbans", "Srimangal", "Bandarban", "Dhaka"];
const travelTypes = ["Adventure", "Relaxing", "Cultural", "Family", "Romantic"];

const dummyPackages = [
  {
    id: 1,
    title: "Cox’s Bazar Beach Escape",
    tourType: "Relaxing",
    duration: 3,
    price: 150,
    destination: "Cox’s Bazar",
  },
  {
    id: 2,
    title: "Sundarbans Wildlife Safari",
    tourType: "Adventure",
    duration: 4,
    price: 200,
    destination: "Sundarbans",
  },
  {
    id: 3,
    title: "Srimangal Tea Garden Retreat",
    tourType: "Relaxing",
    duration: 2,
    price: 100,
    destination: "Srimangal",
  },
  {
    id: 4,
    title: "Bandarban Hills Trekking",
    tourType: "Adventure",
    duration: 5,
    price: 250,
    destination: "Bandarban",
  },
];

const PlanYourTrip = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    travelType: "",
    budget: 500,
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filter packages based on formData
  const filteredPackages = dummyPackages.filter((pkg) => {
    return (
      (formData.destination ? pkg.destination === formData.destination : true) &&
      (formData.travelType ? pkg.tourType === formData.travelType : true) &&
      (formData.duration ? pkg.duration <= Number(formData.duration) : true) &&
      pkg.price <= Number(formData.budget)
    );
  });

  return (
    <section className="max-w-4xl mx-auto my-12 p-6 bg-[#29AB8760] rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">Plan Your Trip</h2>

      {/* Step indicators */}
      <div className="flex justify-between mb-6">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
              step === s ? "bg-[#29AB87] text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setStep(s)}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div>
          <label className="block mb-2 font-semibold">Choose Destination</label>
          <select
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="">Select a destination</option>
            {destinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block mb-2 font-semibold">Trip Duration (days)</label>
          <input
            type="number"
            name="duration"
            min="1"
            max="30"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Enter trip duration"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="block mb-2 font-semibold">Travel Type</label>
          <select
            name="travelType"
            value={formData.travelType}
            onChange={handleChange}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="">Select travel type</option>
            {travelTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      {step === 4 && (
        <div>
          <label className="block mb-2 font-semibold">Budget ($)</label>
          <input
            type="range"
            name="budget"
            min="50"
            max="1000"
            step="10"
            value={formData.budget}
            onChange={handleChange}
            className="w-full max-w-xs"
          />
          <p>Selected budget: ${formData.budget}</p>
        </div>
      )}

      {step === 5 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Suggested Packages</h3>
          {filteredPackages.length === 0 && <p>No packages found matching your criteria.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="card bg-base-200 shadow-md p-4 rounded-lg">
                <h4 className="font-bold text-lg">{pkg.title}</h4>
                <p>Type: {pkg.tourType}</p>
                <p>Duration: {pkg.duration} days</p>
                <p>Price: ${pkg.price}</p>
                <button className="btn btn-primary mt-2">View Details</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className="btn btn-outline"
        >
          Previous
        </button>
        {step < 5 && (
          <button
            onClick={nextStep}
            disabled={
              (step === 1 && !formData.destination) ||
              (step === 2 && !formData.duration) ||
              (step === 3 && !formData.travelType)
            }
            className="btn btn-primary bg-[#29AB87] border-none"
          >
            Next
          </button>
        )}
      </div>
    </section>
  );
};

export default PlanYourTrip;
