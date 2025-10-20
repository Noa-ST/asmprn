export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-3">
        ✅ Payment Successful!
      </h2>
      <p className="text-gray-600">Thank you for your order.</p>
      <a
        href="/orders"
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View Orders
      </a>
    </div>
  );
}
