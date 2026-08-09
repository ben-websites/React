import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faUser,
  faEnvelope,
  faPhone,
  faLocationDot,
  faCity,
  faMapPin,
  faImage,
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
    profilePic: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `https://bens-store.vercel.app/profile/${userId}`
      );

      if (res.data.success) {
        const user = res.data.data;

        setForm({
          name: user.name || "",
          email: user.email || "",
          profilePic: user.profilePic || "",
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "",
          postalCode: user.postalCode || "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to load profile");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await axios.put(
        `https://bens-store.vercel.app/profile/${userId}`,
        {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          profilePic: form.profilePic,
        }
      );

      if (res.data.success) {
        const updatedUser = res.data.data;

        // Only keep basic information in localStorage
        localStorage.setItem("name", updatedUser.name);
        localStorage.setItem("email", updatedUser.email);

        toast.success("Profile updated successfully");

        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-stone-100 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg font-semibold text-slate-600">
            Loading profile...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-stone-100 px-6 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Back Button */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 font-semibold text-emerald-700 transition hover:text-slate-950"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-950">
            Edit Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Update your personal information and profile details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-xl md:p-8"
        >

          {/* Profile Picture */}

          <div className="mb-8 border-b border-stone-200 pb-8">

            <h2 className="mb-5 text-xl font-black text-slate-950">
              Profile Picture
            </h2>

            <div className="flex flex-col items-center gap-5 sm:flex-row">

              {form.profilePic ? (
                <img
                  src={form.profilePic}
                  alt="Profile preview"
                  className="h-28 w-28 rounded-full border-4 border-emerald-100 object-cover shadow"
                />
              ) : (
                <div className="grid h-28 w-28 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-4xl"
                  />
                </div>
              )}

              <div className="w-full flex-1">

                <label className="mb-2 block font-bold text-slate-950">
                  <FontAwesomeIcon
                    icon={faImage}
                    className="mr-2 text-emerald-700"
                  />
                  Profile Picture URL
                </label>

                <input
                  type="url"
                  name="profilePic"
                  value={form.profilePic}
                  onChange={handleChange}
                  placeholder="https://example.com/profile.jpg"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />

                <p className="mt-2 text-sm text-slate-500">
                  Enter the URL of the image you want to use as your profile
                  picture.
                </p>

              </div>

            </div>
          </div>

          {/* Basic Information */}

          <div className="mb-8 border-b border-stone-200 pb-8">

            <h2 className="mb-5 text-xl font-black text-slate-950">
              Basic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Name */}

              <label className="block">

                <span className="mb-2 block font-bold text-slate-950">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2 text-emerald-700"
                  />
                  Name
                </span>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />

              </label>

              {/* Email */}

              <label className="block">

                <span className="mb-2 block font-bold text-slate-950">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="mr-2 text-emerald-700"
                  />
                  Email
                </span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-stone-300 bg-stone-100 px-4 py-3 text-slate-500"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Email cannot be changed from this page.
                </p>

              </label>

            </div>
          </div>

          {/* Contact Information */}

          <div className="mb-8 border-b border-stone-200 pb-8">

            <h2 className="mb-5 text-xl font-black text-slate-950">
              Contact Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Phone */}

              <label className="block">

                <span className="mb-2 block font-bold text-slate-950">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="mr-2 text-emerald-700"
                  />
                  Phone Number
                </span>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+92 300 0000000"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />

              </label>

              {/* City */}

              <label className="block">

                <span className="mb-2 block font-bold text-slate-950">
                  <FontAwesomeIcon
                    icon={faCity}
                    className="mr-2 text-emerald-700"
                  />
                  City
                </span>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Karachi"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />

              </label>

              {/* Address */}

              <label className="block md:col-span-2">

                <span className="mb-2 block font-bold text-slate-950">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="mr-2 text-emerald-700"
                  />
                  Address
                </span>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter your complete address"
                  className="w-full resize-none rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />

              </label>

              {/* Postal Code */}

              <label className="block">

                <span className="mb-2 block font-bold text-slate-950">
                  <FontAwesomeIcon
                    icon={faMapPin}
                    className="mr-2 text-emerald-700"
                  />
                  Postal Code
                </span>

                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="74000"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />

              </label>

            </div>
          </div>

          {/* Buttons */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-stone-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-stone-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faSave} />

              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </section>
  );
}

export default EditProfile;
