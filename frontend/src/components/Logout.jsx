/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
    localStorage.removeItem("user");

  const handleFunc = async () => {
    localStorage.removeItem("user");
    navigate("/");
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    if (res.status === 200 || res.status === 400) {
      console.log("Logged out successfully");
    }
  };

  useEffect(() => {
    handleFunc();
  }, []);
  return <div>Loggin Out....</div>;
};

export default Logout;
