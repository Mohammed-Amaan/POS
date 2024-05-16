import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import Papa from "papaparse";

const AddBulk = ({
  isAddBulkModalOpen,
  setIsAddBulkModalOpen,
  products,
  setProducts,
  categories,
}) => {
  const [csvData, setCSVData] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    try {
      const text = await file.text();
      const result = Papa.parse(text, { header: true });
      setCSVData(result.data);
    } catch (error) {
      console.error("Error parsing CSV file:", error);
      alert("Failed to upload CSV file");
    }
  };

  const handleAddProducts = () => {
    //setIsAddBulkModalOpen(false);
    csvData.map((product) => {
      try {
        fetch(process.env.REACT_APP_SERVER_URL + "/api/products/add-product", {
          method: "POST",
          body: JSON.stringify(product),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        message.success("Product successfully added.");
        setIsAddBulkModalOpen(false);
        setProducts([
          ...products,
          {
            _id: Math.random(),
            title: product.title,
            img: product.img,
            price: Number(product.price),
            category: product.category,
          },
        ]);
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <>
      <Modal
        title="Add Bulk Products"
        open={isAddBulkModalOpen}
        onCancel={() => setIsAddBulkModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsAddBulkModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddProducts}>
            Add Products
          </Button>,
        ]}
      >
        <div>
          <input type="file" accept=".csv" onChange={handleUpload} />
        </div>
      </Modal>
    </>
  );
};

export default AddBulk;
