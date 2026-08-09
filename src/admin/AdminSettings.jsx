import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faPhone,
  faEnvelope,
  faLocationDot,
  faGear,
  faCreditCard,
  faBox,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    storeOpen: true,
    maintenanceMode: false,
    customerRegistration: true,
    cashOnDelivery: true,
    cardPayment: true,
    newOrders: true,
    orderStatus: "Pending",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await axios.get(
        "http://localhost:3000/settings"
      );

      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to load settings");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function saveSettings(e) {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await axios.put(
        "http://localhost:3000/settings",
        settings
      );

      if (res.data.success) {
        setSettings(res.data.data);
        toast.success("Settings saved successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <section className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-black text-slate-950">
          Admin Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your store and website settings.
        </p>
      </div>

      <form onSubmit={saveSettings} className="space-y-8">

        {/* Store Information */}

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <FontAwesomeIcon
                icon={faStore}
                className="text-emerald-700"
              />
            </div>

            <div>
              <h2 className="text-xl font-black">
                Store Information
              </h2>

              <p className="text-sm text-slate-500">
                Basic information about your store.
              </p>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Store Name */}

            <label>
              <span className="font-bold text-slate-950">
                Store Name
              </span>

              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-700"
              />
            </label>

            {/* Email */}

            <label>
              <span className="font-bold text-slate-950">
                Store Email
              </span>

              <div className="relative mt-2">

                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="storeEmail"
                  value={settings.storeEmail}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-emerald-700"
                />

              </div>
            </label>

            {/* Phone */}

            <label>
              <span className="font-bold text-slate-950">
                Store Phone
              </span>

              <div className="relative mt-2">

                <FontAwesomeIcon
                  icon={faPhone}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="storePhone"
                  value={settings.storePhone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-emerald-700"
                />

              </div>
            </label>

            {/* Address */}

            <label>
              <span className="font-bold text-slate-950">
                Store Address
              </span>

              <div className="relative mt-2">

                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="storeAddress"
                  value={settings.storeAddress}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-emerald-700"
                />

              </div>
            </label>

          </div>

        </div>

        {/* Store Controls */}

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <FontAwesomeIcon
                icon={faGear}
                className="text-emerald-700"
              />
            </div>

            <div>
              <h2 className="text-xl font-black">
                Store Controls
              </h2>

              <p className="text-sm text-slate-500">
                Control how your store behaves.
              </p>
            </div>

          </div>

          <div className="space-y-4">

            <Toggle
              name="storeOpen"
              checked={settings.storeOpen}
              onChange={handleChange}
              title="Store Open"
              description="Allow customers to use the store."
            />

            <Toggle
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              title="Maintenance Mode"
              description="Put the website into maintenance mode."
            />

            <Toggle
              name="customerRegistration"
              checked={settings.customerRegistration}
              onChange={handleChange}
              title="Customer Registration"
              description="Allow new customers to create accounts."
            />

            <Toggle
              name="newOrders"
              checked={settings.newOrders}
              onChange={handleChange}
              title="Accept New Orders"
              description="Allow customers to place new orders."
            />

          </div>

        </div>

        {/* Payment Settings */}

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="text-emerald-700"
              />
            </div>

            <div>
              <h2 className="text-xl font-black">
                Payment Methods
              </h2>

              <p className="text-sm text-slate-500">
                Choose which payment methods customers can use.
              </p>
            </div>

          </div>

          <div className="space-y-4">

            <Toggle
              name="cashOnDelivery"
              checked={settings.cashOnDelivery}
              onChange={handleChange}
              title="Cash on Delivery"
              description="Allow customers to pay when their order arrives."
            />

            <Toggle
              name="cardPayment"
              checked={settings.cardPayment}
              onChange={handleChange}
              title="Card Payment"
              description="Allow customers to pay using a card."
            />

          </div>

        </div>

        {/* Order Settings */}

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <FontAwesomeIcon
                icon={faBox}
                className="text-emerald-700"
              />
            </div>

            <div>
              <h2 className="text-xl font-black">
                Order Settings
              </h2>

              <p className="text-sm text-slate-500">
                Configure default order behavior.
              </p>
            </div>

          </div>

          <label className="block max-w-md">

            <span className="font-bold text-slate-950">
              Default Order Status
            </span>

            <select
              name="orderStatus"
              value={settings.orderStatus}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-700"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>

          </label>

        </div>

        {/* Save */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <FontAwesomeIcon icon={faSave} />

            {saving ? "Saving..." : "Save Settings"}

          </button>

        </div>

      </form>

    </section>
  );
}


/* Toggle Component */

function Toggle({
  name,
  checked,
  onChange,
  title,
  description,
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-stone-200 p-4 transition hover:bg-stone-50">

      <div>
        <p className="font-bold text-slate-950">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <div className="relative">

        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />

        <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-600"></div>

        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>

      </div>

    </label>
  );
}

export default AdminSettings;
