import { Form, Modal, Input, Select, Card, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateInvoice = ({ isModalOpen, setIsModalOpen }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const totalSalesAmount = (
      cart.total +
      (cart.total * cart.tax) / 100
    ).toFixed(2);
    try {
      const result = await axios.post("http://localhost:3345/stats/invoice", {
        adminId: "787",
        totalAmount: totalSalesAmount * 100,
      });
      message.success(result.data.success);
    } catch (error) {
      console.log(error);
    }
    try {
      var res = await fetch(
        process.env.REACT_APP_SERVER_URL + "/api/invoices/add-invoice",
        {
          method: "POST",
          body: JSON.stringify({
            ...values,
            subTotal: cart?.total?.toFixed(2),
            tax: ((cart.total * cart.tax) / 100).toFixed(2),
            totalAmount: (cart.total + (cart.total * cart.tax) / 100).toFixed(
              2
            ),
            cartItems: cart.cartItems,
          }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );

      if (res.status === 200) {
        message.success("Invoice Created Successfully.");
        setIsModalOpen(false);
        dispatch(reset());
        navigate("/invoices");
      }
    } catch (error) {
      message.error("Operation Failed.");
      console.log(error);
    }
  };

  return (
    <Modal
      title="Create Invoice"
      open={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name={"customerName"}
          label="Customer Name"
          rules={[{ required: true, message: "Please enter a name!" }]}
        >
          <Input placeholder="Enter Customer Name..." />
        </Form.Item>
        <Form.Item
          name={"customerPhoneNumber"}
          label="Phone Number"
          rules={[{ required: true, message: "Please enter a phone number!" }]}
        >
          <Input
            placeholder="Enter Phone Number..."
            maxLength={11}
            type="number"
          />
        </Form.Item>
        <Form.Item
          name={"paymentMode"}
          label="Payment Method"
          rules={[
            { required: true, message: "Please select a payment method!" },
          ]}
        >
          <Select placeholder="Select Payment Method...">
            <Select.Option value="Cash">Cash</Select.Option>
            <Select.Option value="Credit Card">Credit Card</Select.Option>
          </Select>
        </Form.Item>
        <Card className="w-full">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {cart.total.toFixed(2) > 0 ? cart.total.toFixed(2) : 0} AED
            </span>
          </div>
          <div className="flex justify-between my-2">
            <span>Tax %{cart.tax}</span>
            <span className="text-red-600">
              {(cart.total * cart.tax) / 100 > 0
                ? `+${((cart.total * cart.tax) / 100).toFixed(2)}`
                : 0}
              AED
            </span>
          </div>
          <div className="flex justify-between">
            <b>Total</b>
            <b>
              {" "}
              {(cart.total + (cart.total * cart.tax) / 100).toFixed(2) > 0
                ? (cart.total + (cart.total * cart.tax) / 100).toFixed(2)
                : 0}
              AED
            </b>
          </div>
          <div className="flex justify-end">
            <Button
              size="medium"
              type="primary"
              className="mt-4"
              onClick={() => setIsModalOpen(true)}
              htmlType="submit"
            >
              Create Order
            </Button>
          </div>
        </Card>
      </Form>
    </Modal>
  );
};

export default CreateInvoice;
