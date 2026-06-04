import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import NetworkStatus from "@/components/network-status/NetworkStatus";
import AiChat from "@/components/ai-chat/AiChat";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <NetworkStatus />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AiChat />
    </>
  );
};

export default React.memo(Layout);
