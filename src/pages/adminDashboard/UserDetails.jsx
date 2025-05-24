import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserDetail from "../../components/UserDetail";


const transactionsData = {
  "1": [
    {
      id: "TX12345",
      amount: "350 USDT",
      status: "Completed",
      date: "2025-05-09",
    },
    {
      id: "TX12346",
      amount: "500,000 KRW",
      status: "Pending",
      date: "2025-05-08",
    },
  ],
  "2": [
    {
      id: "TX22345",
      amount: "1000 USDT",
      status: "Completed",
      date: "2025-05-07",
    },
  ],
};



const UserDetails = () => {
  const { userId } = useParams();
  console.log("🚀 ~ UserDetails ~ userId:", userId)
  const [users, setUsers] = useState()
  const user = users?.find((u) => u._id === userId);
  const transactions = transactionsData[userId] || [];

   useEffect(() => {
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
          setUsers(data); // return parsed user data
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      allUser()
    }, []);

  return <UserDetail user={user} transactions={transactions} />;
};

export default UserDetails;
