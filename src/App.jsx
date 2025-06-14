import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminRoute from "./components/AdminRoute";
import Footers from "./components/Footers";
import History from "./components/History";
import Navbar from "./components/Navbar";
import PublicRoute from "./components/PublicRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import AdminTransactions from "./pages/adminDashboard/AdminTransactions";
import AllChatPage from "./pages/adminDashboard/AllChatPage";
import BuyLivePage from "./pages/adminDashboard/BuyLivePage";
import Dashboards from "./pages/adminDashboard/Dashboard";
import InquiryManagement from "./pages/adminDashboard/InquiryManagement";
import SellLivePage from "./pages/adminDashboard/SellLivePage";
import TransactionDetails from "./pages/adminDashboard/TransactionDetails";
import UserDetails from "./pages/adminDashboard/UserDetails";
import UserManagement from "./pages/adminDashboard/UserManagement";
import ChatRoom from "./pages/ChatRoom";
import AccountSettings from "./pages/dashboard/AccountSetting";
import BuyFormInput from "./pages/dashboard/BuyFormInput";
import Dashboard from "./pages/dashboard/Dashboard";
import InquiryHistory from "./pages/dashboard/InquiryHistory";
import ProfileOverview from "./pages/dashboard/ProfileOverview";
import TradingOffers from "./pages/dashboard/TradingOffers";
import TradingPage from "./pages/Exchange";
import Home from "./pages/Home";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Support from "./pages/Support";
import TransactionHistory from "./pages/TransactionHistory";

function App() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />

      <Routes>
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <PublicRoute>
              <OtpVerificationPage />
            </PublicRoute>
          }
        />
        <Route path="/OtpVerificationPage" element={<OtpVerificationPage />} />

        <Route path="/" element={<Home />} />
        <Route path="/chats/:orderId/:orderType" element={<ChatRoom />} />
        {/* <Route path="/chat/:offerId" element={<ChatRoom2 />} /> */}
        <Route path="/adnin/users/:userId" element={<UserDetails />} />

        {/* <Route path="/trade-listings" element={<TradingPage />} /> */}
        <Route path="/post-offer" element={<TransactionHistory />} />

        <Route
          path="/dashboard"
          element={
            <UserProtectedRoute>
              <Dashboard />
            </UserProtectedRoute>
          }
        >
          <Route path="profile" element={<ProfileOverview />} />
          <Route path="sell-order" element={<TradingOffers />} />
          <Route path="sell-history" element={<History />} />
          <Route path="buy-order" element={<BuyFormInput />} />
          <Route path="buy-history" element={<TradingPage />} />
          <Route path="settings" element={<AccountSettings />} />
          <Route path="support" element={<Support />} />
          <Route path="one-on-one" element={<Support />} />
          <Route path="inquiry-history" element={<InquiryHistory />} />
          <Route path="edit-info" element={<AccountSettings />} />
          {/* <Route path="support" element={<Support />} /> */}
        </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboards />} />
          <Route path="transactions" element={<AdminTransactions />} />{" "}
          <Route path="transaction/:id" element={<TransactionDetails />} />
          <Route path="sell-orders" element={<SellLivePage />} />
          <Route path="buy-orders" element={<BuyLivePage />} />
          <Route path="users" element={<UserManagement />}></Route>
          <Route path="inquiries" element={<InquiryManagement />}></Route>
          {/* <Route path="users" element={<AllUsers />}>
            <Route path=":userId" element={<UserDetails />} />
          </Route> */}
          <Route path="chat" element={<AllChatPage />} />{" "}
          {/* You can customize this */}
        </Route>
      </Routes>

      <Footers />
    </div>
  );
}

export default App;
