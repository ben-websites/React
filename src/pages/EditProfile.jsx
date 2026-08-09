import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faCamera,
  faUser,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

function EditProfile() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

 
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await axios.get(
        `https://bens-store.vercel.app/profile/${userId}`
      );

      if (res.data.success) {
        const user = res.data.data;

        // Fetch OLD information from database
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "",
          postalCode: user.postalCode || "",
        });

        setPreview(user.profilePic || "");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    setProfilePic(file);

    setPreview(URL.createObjectURL(file));
  };

  // =====================================
  // SAVE PROFILE
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      // Name CAN be changed
      formData.append("name", form.name);

      // Email is NOT sent because it cannot be changed

      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("postalCode", form.postalCode);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const res = await axios.put(
        `https://bens-store.vercel.app/profile/${userId}`,
        formData
      );

      if (res.data.success) {
        toast.success("Profile updated successfully");

        // Update only display information that is safe
        localStorage.setItem(
          "name",
          res.data.data.name
        );

        navigate("/");
      }
    } catch (error) {
      console.log("Update profile error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <section className="min-h-screen bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold text-slate-600">
            Loading profile...
          </p>
        </div>
      </section>
    );
  }

  // =====================================
  // PAGE
  // =====================================

  return (
    <section className="min-h-screen bg-stone-50 px-6 py-12">

      <div className="mx-auto max-w-3xl">

        {/* Back */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-8 inline-flex items-center gap-2 font-semibold text-emerald-700 transition hover:text-emerald-900"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>

        {/* Card */}

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl md:p-8">

          <div className="mb-8">

            <h1 className="text-3xl font-black text-slate-950">
              Edit Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Update your personal information and profile picture.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* ========================= */}
            {/* PROFILE PICTURE */}
            {/* ========================= */}

            <div className="mb-8 flex flex-col items-center">

              <div className="relative">

                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="h-32 w-32 rounded-full border-4 border-emerald-100 object-cover"
                  />
                ) : (
                  <div className="grid h-32 w-32 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-5xl"
                    />
                  </div>
                )}

                <label
                  htmlFor="profilePic"
                  className="absolute bottom-1 right-1 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-emerald-700 text-white shadow-lg transition hover:bg-emerald-800"
                >
                  <FontAwesomeIcon icon={faCamera} />
                </label>

                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </div>

              <p className="mt-3 text-sm text-slate-500">
                Click the camera icon to change your picture
              </p>

            </div>

            {/* ========================= */}
            {/* NAME + EMAIL */}
            {/* ========================= */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* NAME - EDITABLE */}

              <div>

                <label className="mb-2 block font-bold text-slate-950">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-700"
                />

              </div>

              {/* EMAIL - NOT EDITABLE */}

              <div>

                <label className="mb-2 block font-bold text-slate-950">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-stone-300 bg-stone-100 px-4 py-3 text-slate-500 outline-none"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Email address cannot be changed.
                </p>

              </div>

            </div>

            {/* ========================= */}
            {/* PHONE */}
            {/* ========================= */}

            <div className="mt-5">

              <label className="mb-2 block font-bold text-slate-950">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+92 300 0000000"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-700"
              />

            </div>

            {/* ========================= */}
            {/* ADDRESS */}
            {/* ========================= */}

            <div className="mt-5">

              <label className="mb-2 block font-bold text-slate-950">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                placeholder="Enter your complete address"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-700"
              />

            </div>

            {/* ========================= */}
            {/* CITY + POSTAL CODE */}
            {/* ========================= */}

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-bold text-slate-950">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Karachi"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-700"
                />

              </div>

              <div>

                <label className="mb-2 block font-bold text-slate-950">
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="74000"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-700"
                />

              </div>

            </div>

            {/* ========================= */}
            {/* BUTTONS */}
            {/* ========================= */}

            <div className="mt-8 flex gap-4">

              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-lg border border-stone-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-stone-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FontAwesomeIcon icon={faSave} />

                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </section>
  );
}

export default EditProfile;
