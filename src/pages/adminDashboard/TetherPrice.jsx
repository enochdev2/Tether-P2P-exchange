import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Bankend_Url, useAuth } from "../../utils/AuthProvider";
import { ErrorToast } from "../../utils/Error";
import { SuccessToast } from "../../utils/Success";

const TetherPrice = () => {
  const { fetchPrice } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tetherPrice, setTetherPrice] = useState(null); // State to store the tether price
  const [inputPrice, setInputPrice] = useState("");

  useEffect(() => {
    const fetchTetherPrice = async () => {
      try {
        const response = await fetch(`${Bankend_Url}/api/v1/tetherprice/get-tether-price`, {
          method: "GET",
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const data = await response.json();
          const errorMsg = data.error || data.message || "Failed to register user";
          if (errorMsg === "Invalid or expired token") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");
            navigate("/signin");
          }
          ErrorToast(errorMsg);
        }

        const data = await response.json();
        fetchPrice();
        setTetherPrice(data.data); // Update state with the fetched price
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchTetherPrice();
  }, []);

  const handleInputChange = (e) => {
    setInputPrice(e.target.value);
  };

  // Handle setting the new tether price
  const handleSetPrice = async () => {
    if (!inputPrice) return ErrorToast("Insert price");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${Bankend_Url}/api/v1/tetherprice/update-tether-price`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tetherPrice: Number(inputPrice), // Make sure it's a number
          // storedLanguage : localStorage.getItem("language")
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
        //  return response;
      }
      fetchPrice();
      SuccessToast("Tether Price successfully set ");

      setTetherPrice(data.data.tetherPrice);

      return data;
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="w-full h-full flex space-y-8">
      <div className="w-full h-full flex -m-20 justify-center space-y-5 flex-col items-center">
        <div>
          {/* Display the fetched tether price */}
          <h1 className="text-lg font-bold">
            {tetherPrice ? `USDT/₩${tetherPrice}` : "Loading..."}
          </h1>
        </div>
        <div className="bg-gray-200 md:w-xl border-slate-400 border rounded-2xl overflow-hidden py-10 items-center space-y-4 px-3  shadow-2xl flex flex-col">
          <h1 className="font-bold text-2xl bg-[#26a17b]/30 px-4 rounded-lg">
            {t("tetherprice.settetherprice")}
          </h1>
          <input
            className="bg-slate-300 w-lg text-center px-2 py-2 rounded-xl"
            type="text"
            value={inputPrice}
            onChange={handleInputChange}
            placeholder="Enter price"
          />
          <button
            className="py-3 bg-[#26a17b] px-3 rounded-xl cursor-pointer text-white"
            onClick={handleSetPrice}
          >
            {t("tetherprice.setprice")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TetherPrice;
