import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentForm = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch booking using TanStack Query
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/${bookingId}`);
      return res.data;
    },
    enabled: !!bookingId,
  });

  // Create payment intent
  useEffect(() => {
    if (!booking?.price) return;
    const createIntent = async () => {
      const res = await axiosSecure.post("/create-payment-intent", { price: booking.price });
      setClientSecret(res.data.clientSecret);
    };
    createIntent();
  }, [booking, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    setError("");
    setSuccess("");

    const card = elements.getElement(CardElement);
    const { error: methodErr, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (methodErr) {
      setError(methodErr.message);
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmErr } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmErr) {
      setError(confirmErr.message);
      setProcessing(false);
      return;
    }

    const paymentInfo = {
      bookingId,
      email: user.email,
      transactionId: paymentIntent.id,
      price: booking.price,
      date: new Date().toISOString(),
      status: "In Review",
    };

    try {
      await axiosSecure.post("/payments", paymentInfo);
      setSuccess("Payment successful!");
      navigate("/dashboard/my-bookings");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "An unexpected error occurred";
      setError(msg);
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) return <p className="p-5">Loading booking info...</p>;

  return (
    <div className="max-w-md mx-auto p-6 shadow-md rounded bg-white mt-5">
      {booking ? (
        <>
          <h2 className="text-xl font-bold mb-4">Pay for {booking.packageName}</h2>
          <p className="mb-2">Amount: ৳{booking.price}</p>
        </>
      ) : (
        <p className="text-gray-600">Loading booking details...</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement
          options={{
            style: {
              base: { fontSize: "16px", color: "#424770" },
              invalid: { color: "#9e2146" },
            },
          }}
        />
        {typeof error === "string" && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <button
          type="submit"
          disabled={
            !stripe ||
            !clientSecret ||
            processing ||
            booking?.status === "In Review"
          }
          className={`px-4 py-2 rounded text-white ${booking?.status === "In Review" || processing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {booking?.status === "In Review"
            ? "Already Paid"
            : processing
              ? "Processing..."
              : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
