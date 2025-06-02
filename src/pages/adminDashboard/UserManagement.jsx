import { useEffect, useState } from "react";
import AdminTradeCard from "../../components/AdminTradeCard";
import AdminTradeCard2 from "../../components/AdminTradeCard2";
import LoadingSpiner from "../../components/LoadingSpiner";
import NotificationPopup from "../../components/NotificationPopup";
import { ErrorToast } from "../../utils/Error";
import { SuccessToast } from "../../utils/Success";
import { UserPlus2Icon } from "lucide-react";
import AdminUserCard from "../../components/AdminUserCard";
import { useAuth } from "../../utils/AuthProvider";

const UserManagement = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sellOrders, setSellOrders] = useState([]);
  const [loadingSell, setLoadingSell] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [change, setChange] = useState(true);
  console.log("🚀 ~ UserManagement ~ change:", change)
  // const { allUser } = useAuth();
   const { updateUser, setUser } = useAuth();

  // Amount filter state for sell orders: "all", "lt500", "500to1000", "gt1000"

  const [sellAmountFilter, setSellAmountFilter] = useState("all");

  const allUser = async () => {
    try {
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log("Users fetched successfully 12345667", data);
      setAllUsers(data); // return parsed user data
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingSell(false);
    }
  };
   useEffect(() => {
      allUser()
    }, []);

    const handleSubmit = async (nickname) => {
      let updatedUser;
      if(change) {
        updatedUser = {
      nickname: nickname,
      status: "active",
      // admin: user?.admin || false, // preserve existing admin status
    };
      } else {

        updatedUser = {
         nickname: nickname,
         status: "inactive",
         // admin: user?.admin || false, // preserve existing admin status
       };
      }

    try {
      const response = await updateUser(updatedUser);
      if (response) {
        SuccessToast("You have successfully updated the status");
        allUser();
      }
      console.log("User Info updated:", updatedUser);
    } catch (error) {
      console.error("Error during sign-up:", error);
      ErrorToast(`something went wrong ${error}`);
      // Optionally handle error here (e.g., show error message)
    } 
  };

  useEffect(() => {
    fetchSellPendingOrders();
  }, []);

  async function fetchSellPendingOrders(status = "") {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/all/pending-orders",
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/allonsell-orders-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const sellPendingOrders = await response.json();
      console.log("🚀 ~ fetchSellOrders ~ sellOrders:", sellPendingOrders);

      //   // Sort oldest date first
      //   sellPendingOrders?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setPendingOrders(sellPendingOrders);
      // You can now render buyOrders in your UI
      //   return sellOrders;
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  async function approveOrders(orderId) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/sell-orders/${orderId}/approve`,
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/allonsell-orders-orders",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Order approved:", result);
      SuccessToast("Sell Order Approve Successful");

      // Remove the approved order from the current pendingOrders state
      setPendingOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  async function rejectOrders(orderId) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/sell-orders/${orderId}/reject`,
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/allonsell-orders-orders",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Order approved:", result);
      SuccessToast("Buy Order Rejected Successful");

      // Remove the approved order from the current pendingOrders state
      setPendingOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/sellOrders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      console.log("🚀 ~ fetchNotifications ~ data:", data);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }

  async function markNotificationRead(notificationId) {
    try {
      const token = localStorage.getItem("token");
      // `https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/mark-read/${notificationId}`,
      const response = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/mark-read/${notificationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to mark notification as read");

      console.log("🚀 ~ markNotificationRead ~ response:", response);
      // Remove the marked notification from state so the card disappears
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // Handle amount filter button clicks
  const handleAmountFilterChange = (filter) => {
    setSellAmountFilter(filter);
  };

  // Filter sell orders based on amount
  const filteredSellOrders = sellOrders.filter((order) => {
    if (sellAmountFilter === "all") return true;
    if (sellAmountFilter === "lt500") return order.amount < 500;
    if (sellAmountFilter === "500to1000")
      return order.amount >= 500 && order.amount <= 1000;
    if (sellAmountFilter === "gt1000") return order.amount > 1000;
    return true;
  });

  if (loadingSell) return <LoadingSpiner />;

  const Sell = true;

  return (
    <div>
      <div className="flex bg-gray-100 pt-2 min-h-screen">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6 border bg-slate-200 border-slate-300 px-4 py-3 md:mb-12 rounded-2xl ">
            <div className=" px-5 py-2 rounded-2xl ">
              <h1 className="text-3xl font-bold bg-gradient-to-br flex from-green-600 via-[#26a17b] to-green-800 items-center text-transparent bg-clip-text ">
                <UserPlus2Icon className="text-green-600 mr-5" /> User
                Management
              </h1>
            </div>
          </div>

          <div>
            {pendingOrders &&
              pendingOrders?.map((offer) => (
                <AdminTradeCard2
                  key={offer._id}
                  offer={offer}
                  sell={Sell}
                  approveOrders={() => approveOrders(offer._id)}
                  rejectOrders={() => rejectOrders(offer._id)}
                  setPendingOrders={setPendingOrders}
                  showChatButton={offer.status === "Pending Approval"}
                  onChatClick={() => navigate(`/admin/chat/${offer._id}`)}
                />
              ))}
          </div>

          {/* Render Sell Orders */}
          <div className="mb-2">
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            {allUsers?.length === 0 ? (
              <p className="text-gray-500">No sell orders match the filter.</p>
            ) : (
              allUsers.map((offer) => (
                <AdminUserCard
                  key={offer._id}
                  offer={offer}
                  handleSubmit={()=>handleSubmit(offer.nickname)}
                  setChange={setChange}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {/* Notification Alert Box */}
      <NotificationPopup
        loading={loadingNotifications}
        notifications={notifications}
        onMarkRead={markNotificationRead}
      />
    </div>
  );
};

export default UserManagement;
