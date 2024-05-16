import React from "react";
import Header from "../components/header/Header";
import Edit from "../components/products/Edit";

const ProductPage = () => {
  return (
    <>
      <Header />
      <div
        className="overflow-auto h-screen"
        style={{ overflowY: "auto", height: "calc(100vh - 64px)" }}
      >
        <div className="px-6">
          <h1 className="text-4xl font-bold text-center mb-4">Products</h1>
          <Edit />
        </div>
      </div>
    </>
  );
};

export default ProductPage;
