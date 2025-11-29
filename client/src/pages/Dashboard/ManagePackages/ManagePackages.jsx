import { useState } from "react";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import EditPackageModal from "./EditPackageModal";

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "Adventure", label: "Adventure" },
  { value: "Beach", label: "Beach" },
  { value: "Cultural", label: "Cultural" },
  { value: "Mountain", label: "Mountain" },
  { value: "Historical", label: "Historical" },
  { value: "Wildlife", label: "Wildlife" },
];

const ManagePackages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [editingPackage, setEditingPackage] = useState(null);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: packages = [], isLoading, refetch } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]);
      Swal.fire("Deleted!", "Package has been deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete package.", "error");
    },
  });

  const handleDelete = async (pkg) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${pkg.title}"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      deleteMutation.mutate(pkg._id);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory.value === "all" || pkg.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        {/* Search */}
        <div className="flex items-center w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by title or location"
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="-ml-8 text-gray-500" />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-1/2">
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            className="text-sm"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#d1d5db",
              }),
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg border">
        {isLoading ? (
          <p className="p-4">Loading packages...</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Location</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Category</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No packages found
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg, index) => (
                  <tr key={pkg._id} className="hover:bg-gray-100 transition-colors">
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={pkg.images?.[0] || "/placeholder.jpg"}
                        alt={pkg.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="font-semibold">{pkg.title}</td>
                    <td>{pkg.location}</td>
                    <td>{pkg.duration} days</td>
                    <td>${pkg.price}</td>
                    <td>
                      <span className="badge badge-primary">{pkg.category}</span>
                    </td>
                    <td className="text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="btn btn-sm btn-info"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg)}
                          className="btn btn-sm btn-error"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editingPackage && (
        <EditPackageModal
          packageData={editingPackage}
          onClose={() => setEditingPackage(null)}
          onSuccess={() => {
            setEditingPackage(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ManagePackages;

