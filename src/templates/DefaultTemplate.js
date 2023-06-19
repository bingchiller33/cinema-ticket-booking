import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const DefaultTemplate = ({ children }) => {
  return (
    <div>
      <Header />

      <main>{children}</main>

      <Footer />
    </div>
  );
};
export default DefaultTemplate;
