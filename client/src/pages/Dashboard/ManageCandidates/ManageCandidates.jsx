import { useQuery, useQueryClient } from "@tanstack/react-query";

import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageCandidates = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  // Fetch applications
  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res = await axiosSecure.get("/applications");
      return res.data;
    },
  });
  console.log(candidates);

  const handleAccept = async (candidate) => {
    const confirm = await Swal.fire({
      title: "Accept Candidate?",
      text: `Promote ${candidate.name} to Tour Guide?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.patch(`/applications/${candidate._id}/accept`);
      await axiosSecure.delete(`/applications/${candidate._id}`);
      queryClient.invalidateQueries(["candidates"]);
      Swal.fire("Accepted!", `${candidate.name} is now a Tour Guide.`, "success");
    }
  };

  const handleReject = async (candidate) => {
    const confirm = await Swal.fire({
      title: "Reject Application?",
      text: `Reject ${candidate.name}'s application?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.delete(`/applications/${candidate._id}`);
      queryClient.invalidateQueries(["candidates"]);
      Swal.fire("Rejected!", `${candidate.name}'s application was removed.`, "info");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Tour Guide Applications</h2>

      <div className="overflow-x-auto shadow-md rounded-lg border">
        {isLoading ? (
          <p className="p-4">Loading applications...</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Title</th>
                <th>Reason</th>
                <th>CV</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No applications found.
                  </td>
                </tr>
              ) : (
                candidates.map((candidate, idx) => (
                  <tr key={candidate._id} className="hover:bg-gray-100 transition-colors">
                    <td>{idx + 1}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.applicationTitle}</td>
                    <td>{candidate.reason}</td>
                    <td>
                      <a
                        href={candidate.cvLink}
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View CV
                      </a>
                    </td>
                    <td className="text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleAccept(candidate)}
                          className="btn btn-sm btn-success tooltip"
                          data-tip="Accept"
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          onClick={() => handleReject(candidate)}
                          className="btn btn-sm btn-error tooltip"
                          data-tip="Reject"
                        >
                          <FaTimesCircle />
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

export default ManageCandidates;
