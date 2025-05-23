import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AccountSettings from "./pages/dashboard/AccountSetting";
import BalanceOverview from "./pages/dashboard/BalanceOverview";
import Dashboard from "./pages/dashboard/Dashboard";
import ProfileOverview from "./pages/dashboard/ProfileOverview";
import TransactionOverview from "./pages/dashboard/TransactionOverview";
import TradingOffers from "./pages/dashboard/TradingOffers";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import TransactionDetails from "./pages/adminDashboard/TransactionDetails";
import AdminTransactions from "./pages/adminDashboard/AdminTransactions";
import UserDetails from "./pages/adminDashboard/UserDetails";
import AllUsers from "./pages/adminDashboard/AllUsers";
import TradingPage from "./pages/Exchange";
import SellOfferPage from "./components/SellOfferPage";
import Home from "./pages/Home";
import TransactionHistory from "./pages/TransactionHistory";
import History from "./components/History";
import Footers from "./components/Footers";
import Support from "./pages/Support";
import SystemAlert from "./pages/adminDashboard/SystemAlert";
import BuyFormInput from "./pages/dashboard/BuyFormInput";
import AccountSetting from "./components/AccountSetting";
import InquiryHistory from "./pages/dashboard/InquiryHistory";

function App() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />

      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Home />} />
        {/* <Route path="/trade-listings" element={<TradingPage />} /> */}
        <Route path="/post-offer" element={<TransactionHistory />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile" element={<ProfileOverview />} />
          <Route path="sell-order" element={<TradingOffers />} />
          <Route path="sell-history" element={<History />} />
          <Route path="buy-order" element={<BuyFormInput />} />
          {/* <Route path="buy-order" element={<TransactionHistory />} /> */}
          <Route path="buy-history" element={<TradingPage />} />
          <Route path="settings" element={<AccountSettings />} />
          <Route path="support" element={<Support />} />
          <Route path="one-on-one" element={<Support />} />
          <Route path="inquiry-history" element={<InquiryHistory />} />
          {/* <Route path="sell-history" element={<TradingOffers />} /> */}
          <Route path="edit-info" element={<AccountSettings />} />
          {/* <Route path="support" element={<Support />} /> */}
        </Route>

        <Route path="/admin" element={<AdminDashboard />}>
          {/* Nested Routes */}
          <Route path="dashboard" element={<div>Dashboard Content</div>} />
          <Route path="transactions" element={<AdminTransactions />} />{" "}
          {/* Embedded in Admin Dashboard */}
          <Route path="transaction/:id" element={<TransactionDetails />} />
          {/* <Route path="users" element={<AdminUsers />} />{" "} */}
          {/* User Registration page */}
          <Route path="user" element={<AllUsers />}>
            <Route path=":userId" element={<UserDetails />} />
          </Route>
          <Route path="alerts" element={<SystemAlert />} />{" "}
          {/* You can customize this */}
        </Route>
      </Routes>

      <Footers />
    </div>
  );
}

export default App;
