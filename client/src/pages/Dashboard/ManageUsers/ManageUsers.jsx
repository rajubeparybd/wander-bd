import { useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "tourist", label: "Tourist" },
  { value: "guide", label: "Tour Guide" },
  { value: "admin", label: "Admin" },
];

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]);
  const axiosSecure = useAxiosSecure();

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["users", searchTerm, selectedRole.value],
    queryFn: async () => {
      const res = await axiosSecure.get("/users", {
        params: {
          search: searchTerm,
          role: selectedRole.value !== "all" ? selectedRole.value : undefined,
        },
      });
      return res.data;
    },
  });

  const handleEdit = async (user) => {
    const { value: newRole } = await Swal.fire({
      title: "Update User Role",
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>User:</strong> ${user.name}</p>
          <p class="mb-4"><strong>Email:</strong> ${user.email}</p>
          <p class="mb-2"><strong>Current Role:</strong> <span class="capitalize">${user.role}</span></p>
        </div>
      `,
      input: "select",
      inputOptions: {
        tourist: "Tourist",
        tourGuide: "Tour Guide",
        admin: "Admin",
      },
      inputValue: user.role,
      inputPlaceholder: "Select a role",
      showCancelButton: true,
      confirmButtonColor: "#29AB87",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Update Role",
      inputValidator: (value) => {
        if (!value) {
          return "You need to select a role!";
        }
      },
    });

    if (newRole && newRole !== user.role) {
      try {
        await axiosSecure.patch(`/users/${user._id}/role`, { role: newRole });
        Swal.fire("Updated!", "User role has been updated.", "success");
        refetch();
      } catch {
        Swal.fire("Error", "Something went wrong while updating.", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/users/${id}`);
        Swal.fire("Deleted!", "User has been deleted.", "success");
        refetch();
      } catch {
        Swal.fire("Error", "Something went wrong while deleting.", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        {/* Search */}
        <div className="flex items-center w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by name or email"
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="-ml-8 text-gray-500" />
        </div>

        {/* Role Filter */}
        <div className="w-full md:w-1/2">
          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
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
          <p className="p-4">Loading users...</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th className="text-center">Role</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-100 transition-colors">
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="text-center capitalize">{user.role}</td>
                    <td className="text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(user)}
                          className="btn btn-sm btn-info"
                          title="Edit Role"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="btn btn-sm btn-error"
                          title="Delete User"
                        >
                          Delete
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
    </div>
  );
};

export default ManageUsers;
