import { useContext, useEffect, useState } from "react";
import ApiCall from "./ApiCall";
import { UserContext } from "../Context/UserContext.jsx";

export const useFectchUser = () => {
  const { userId } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await ApiCall.get("/users/" + userId);
        setUserData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return userData;
};
