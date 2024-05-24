import React, { useState } from "react";
import useScanDetection from "use-scan-detection";
import { Modal, Button } from "antd";

function BarcodeScan({ barcodeModal, setBarcodeModal }) {
  const [barcodeScan, setBarcodeScan] = useState("No barcode scanned");
  console.log(barcodeScan);

  useScanDetection({
    onComplete: (code) => setBarcodeScan(code),
    minLength: 3,
  });

  const handleAddProducts = () => {
    console.log("Product added with barcode:", barcodeScan);
    //send data to db and fetch product details and add to cart.
  };

  return (
    <div>
      <Modal
        title="Scan Product Barcode"
        open={barcodeModal}
        onCancel={() => setBarcodeModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setBarcodeModal(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddProducts}>
            Add Product
          </Button>,
        ]}
      >
        <p>Barcode: {barcodeScan}</p>
      </Modal>
    </div>
  );
}

export default BarcodeScan;
