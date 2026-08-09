import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contextApi/CartDataContext";
import { Navigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const [showCardPopup, setShowCardPopup] = useState(false);

const [cardDetails, setCardDetails] = useState({
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});
  const handleCardChange = (e) => {
  setCardDetails({
    ...cardDetails,
    [e.target.name]: e.target.value,
  });
};

  const { cartItems, clearCart } = useCart();

  const [form, setForm] = useState({
    customerName: localStorage.getItem("name") || "",
    customerEmail: localStorage.getItem("email") || "",
    customerPhone: "",
    shippingAddress: "",
    paymentMethod: "Cash on Delivery",
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return toast.error("Your cart is empty");
    }

    try {
      const order = {
        userId: localStorage.getItem("userId"),

        ...form,

        products: cartItems.map((item) => ({
          productId: item._id,
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),

        totalAmount,
      };

      const res = await axios.post(
        "https://bens-store.vercel.app/placeorder",
        order
      );

      if (res.data.success) {
        toast.success("Order Placed Successfully");

        clearCart();

        navigate("/");
      }
    } catch (error) {
      toast.error("Unable to place order");
    }
  };
  if (cartItems.length === 0) {
  return <Navigate to="/cart" replace />;
}

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-black">
        Checkout
      </h1>

      <div className="grid gap-10 lg:grid-cols-2">

        {/* Shipping Form */}

        <form
          onSubmit={placeOrder}
          className="space-y-5 rounded-xl bg-white p-8 shadow-lg"
        >

          <input
            type="text"
            name="customerName"
            placeholder="Full Name"
            value={form.customerName}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="email"
            name="customerEmail"
            placeholder="Email"
            value={form.customerEmail}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="text"
            name="customerPhone"
            placeholder="Phone Number"
            value={form.customerPhone}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <textarea
            name="shippingAddress"
            placeholder="Shipping Address"
            rows="4"
            value={form.shippingAddress}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

         <select
  name="paymentMethod"
  value={form.paymentMethod}
  onChange={(e) => {
    handleChange(e);

    if (e.target.value === "Card") {
      setShowCardPopup(true);
    }
  }}
  className="w-full rounded-lg border p-3"
>
  <option value="Cash on Delivery">
    Cash on Delivery
  </option>

  <option value="Card">
    Card
  </option>
</select>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-700 py-3 font-bold text-white hover:bg-emerald-800"
          >
            Place Order
          </button>

        </form>

        {/* Order Summary */}

        <div className="rounded-xl bg-white p-8 shadow-lg">

          <h2 className="mb-6 text-2xl font-bold">
            Order Summary
          </h2>

          {cartItems.map((item) => (
            <div
              key={item._id}
              className="mb-4 flex items-center gap-4 border-b pb-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-20 w-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <p>
                  Qty : {item.quantity}
                </p>
              </div>

              <p className="font-bold">
                ${item.price * item.quantity}
              </p>
            </div>
          ))}

          <div className="mt-8 flex justify-between border-t pt-5 text-xl font-black">
            <span>Total</span>
            <span>${totalAmount}</span>
          </div>

        </div>

      </div>

      {showCardPopup && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-950">
          Card Details
        </h2>

        <button
          type="button"
          onClick={() => {
            setShowCardPopup(false);
            setForm({
              ...form,
              paymentMethod: "Cash on Delivery",
            });
          }}
          className="text-2xl font-bold text-slate-500 hover:text-red-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">

        <div>
          <label className="mb-1 block font-semibold">
            Cardholder Name
          </label>

          <input
            type="text"
            name="cardName"
            value={cardDetails.cardName}
            onChange={handleCardChange}
            placeholder="Name on card"
            className="w-full rounded-lg border border-stone-300 p-3 outline-none focus:border-emerald-700"
            required
          />
        </div>

        <div>
          <label className="mb-1 block font-semibold">
            Card Number
          </label>

          <input
            type="text"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleCardChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="w-full rounded-lg border border-stone-300 p-3 outline-none focus:border-emerald-700"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="mb-1 block font-semibold">
              Expiry Date
            </label>

            <input
              type="text"
              name="expiry"
              value={cardDetails.expiry}
              onChange={handleCardChange}
              placeholder="MM/YY"
              maxLength="5"
              className="w-full rounded-lg border border-stone-300 p-3 outline-none focus:border-emerald-700"
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold">
              CVV
            </label>

            <input
              type="password"
              name="cvv"
              value={cardDetails.cvv}
              onChange={handleCardChange}
              placeholder="•••"
              maxLength="4"
              className="w-full rounded-lg border border-stone-300 p-3 outline-none focus:border-emerald-700"
              required
            />
          </div>

        </div>

        <button
          type="button"
          onClick={() => {
            setShowCardPopup(false);
            toast.success("Card details added");
          }}
          className="mt-3 w-full rounded-lg bg-emerald-700 py-3 font-bold text-white hover:bg-emerald-800"
        >
          Continue
        </button>

      </div>

    </div>
  </div>
)}

    </section>
  );
}

export default Checkout;
