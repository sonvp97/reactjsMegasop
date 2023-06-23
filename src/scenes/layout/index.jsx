import { Box, useMediaQuery } from "@mui/material";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { Outlet, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/api.jsx";



function Layout() {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const authToken = JSON.parse(JSON.stringify(localStorage.getItem('token')))
  const [check, setCheck] = useState(true);

  useEffect(() => {
    checkToken()
  })
  const checkToken = async () => {
    try {
      const response = await axios.post(API_BASE_URL + "/expired/",{
        token: authToken
      })
      if (!response.data) {
        setCheck(false)
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      
    }
  };
  if(!check){
    return <Navigate to="/" />;
  }

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        user={{}}
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <Navbar
          user={{}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
