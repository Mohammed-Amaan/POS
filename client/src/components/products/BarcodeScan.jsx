import React, { useState } from "react";
import useScanDetection from "use-scan-detection";
import { Modal, Button } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";
function BarcodeScan({ barcodeModal, setBarcodeModal }) {
  const dispatch = useDispatch();
  const [barcodeScan, setBarcodeScan] = useState("no barcode scanned");
  console.log(barcodeScan);

  useScanDetection({
    onComplete: (code) => setBarcodeScan(code),
    minLength: 3,
  });

  const handleAddProducts = async () => {
    console.log("Product added with barcode:", barcodeScan);
    try {
      const result = await axios.get(
        `http://localhost:4000/api/products/get-one/${barcodeScan}`
      );
      dispatch(
        addProduct({ ...result.data, quantity: 1, key: result.data._id })
      );
      setBarcodeScan(null);
      setBarcodeModal(false);
    } catch (error) {
      console.log(error);
    }
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
