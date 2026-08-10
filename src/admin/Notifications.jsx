
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheck,
  faCheckDouble,
  faUser,
  faBox,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://bens-store.vercel.app/notifications"
      );

      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.log("Notifications Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =====================================
  // MARK ONE AS READ
  // =====================================

  const markAsRead = async (id) => {
    try {
      const res = await axios.put(
        `https://bens-store.vercel.app/notifications/${id}/read`
      );

      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.log("Mark Read Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to mark notification as read"
      );
    }
  };

  // =====================================
  // MARK ALL AS READ
  // =====================================

  const markAllAsRead = async () => {
    try {
      const res = await axios.put(
        "https://bens-store.vercel.app/notifications/read-all"
      );

      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );

        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.log("Mark All Read Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to mark notifications as read"
      );
    }
  };

  // =====================================
  // NOTIFICATION ICON
  // =====================================

  const getNotificationIcon = (type) => {
    if (type === "login") {
      return faUser;
    }

    if (type === "order") {
      return faBox;
    }

    if (type === "message") {
      return faEnvelope;
    }

    return faBell;
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">
          Loading notifications...
        </p>
      </div>
    );
  }

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="mx-auto max-w-5xl">

      {/* HEADER */}

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <FontAwesomeIcon
                icon={faBell}
                className="text-xl"
              />
            </div>

            <div>
              <h1 className="text-3xl font-black text-slate-950">
                Notifications
              </h1>

              <p className="mt-1 text-slate-500">
                View recent customer activity.
              </p>
            </div>
          </div>
        </div>

        {notifications.some(
          (notification) => !notification.isRead
        ) && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
          >
            <FontAwesomeIcon icon={faCheckDouble} />
            Mark All as Read
          </button>
        )}

      </div>

      {/* NOTIFICATIONS */}

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm">

          <FontAwesomeIcon
            icon={faBell}
            className="mb-4 text-4xl text-slate-300"
          />

          <h2 className="text-xl font-bold text-slate-800">
            No notifications
          </h2>

          <p className="mt-2 text-slate-500">
            New customer activity will appear here.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                notification.isRead
                  ? "border-stone-200"
                  : "border-emerald-200 bg-emerald-50/40"
              }`}
            >

              <div className="flex gap-4">

                {/* ICON */}

                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                    notification.isRead
                      ? "bg-slate-100 text-slate-500"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={getNotificationIcon(
                      notification.type
                    )}
                  />
                </div>

                {/* CONTENT */}

                <div className="min-w-0 flex-1">

                  <div className="flex flex-col justify-between gap-2 sm:flex-row">

                    <div>
                      <div className="flex items-center gap-2">

                        <h3 className="font-bold text-slate-950">
                          {notification.title}
                        </h3>

                        {!notification.isRead && (
                          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        )}

                      </div>

                      <p className="mt-1 text-slate-600">
                        {notification.message}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(notification._id)
                        }
                        className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-emerald-200 px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                        Mark as Read
                      </button>
                    )}

                  </div>

                  {/* CUSTOMER */}

                  {notification.userId && (
                    <div className="mt-3 text-sm text-slate-400">
                      Customer:{" "}
                      <span className="font-semibold text-slate-500">
                        {notification.userId.name ||
                          notification.userId.email ||
                          "Unknown"}
                      </span>
                    </div>
                  )}

                  {/* DATE */}

                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Notifications;

