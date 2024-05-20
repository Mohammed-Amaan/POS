import { Form, Modal, Input, Select, Card, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateInvoice = ({ isModalOpen, setIsModalOpen }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleKlipCustomer = async () => {
    const klipitId = form.getFieldValue("klipitId");
    console.log(klipitId);
    try {
      const result = await axios.post(
        "http://localhost:4000/customer/viewCustomer",
        {
          klipitId: klipitId,
        }
      );
      const name = result.data.customerName;
      const phone = result.data.customerPhoneNumber;
      form.setFieldsValue({
        customerName: name,
        customerPhoneNumber: phone,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onFinish = async (values) => {
    //mint bulk nft API
    const truklipIds = cart.cartItems.map((cartItem) => {
      if (cartItem.category === "Chocolates" || cartItem.category === "Fruits")
        return undefined;
      else return cartItem.truklipId;
    });
    const truklipProducts = truklipIds.filter((item) => item !== undefined);
    //console.log(truklipProducts);
    try {
      const result = await axios.post("http://localhost:3345/nft/bulk", {
        address: "0x500f326D72413B580C6ae95A92FfCA3681BC8c8C",
        klipitId: "1234",
        truklipIds: truklipProducts,
      });
      message.success(result.data.success);
    } catch (error) {
      console.log(error);
    }

    //create bill api
    let floor = Math.floor;
    const paymentMode = form.getFieldValue("paymentMode");
    const subTotal = floor(parseFloat(cart?.total?.toFixed(2)));
    const tax = floor(parseFloat(((cart.total * cart.tax) / 100).toFixed(2)));
    const totalAmount = floor(
      parseFloat((cart.total + (cart.total * cart.tax) / 100).toFixed(2))
    );
    console.log(typeof totalAmount, typeof subTotal, typeof tax);
    const productBody = cart.cartItems.map((cartItem) => ({
      itemCode: `${cartItem.key}`,
      name: `${cartItem.title}`,
      locale: "حقيبة يد",
      serialNo: "35435776548",
      tax: 0.01,
      quantity: cartItem.quantity,
      unitAmt: cartItem.price,
      discAmt: 0,
      taxAmt: 0.01,
      netAmt: cartItem.price,
    }));
    try {
      const { data } = await axios.post(
        "https://devapi.klipit.co/v1/pos/bill/create",
        {
          retailerInfo: {
            id: "660ba1f3050cb652ce0560c3",
            macId: "macid_1243",
          },
          customer: {
            email: "testcustomer@mailinator.com",
            klipId: "klip1683553971c802p",
            phone: 501191361,
            countryCode: "+971",
          },
          billInfo: {
            localized: true,
            header: {
              name: "Nayaab Handi",
              groupName: "Nayaab",
              address: "Dubai Mall",
              email: "nayaab.handi@gmail.com",
              taxRegNo: "345568789600",
              contactNo: "+179 5667898643",
              website: "www.demofashion.ae",
              timestamp: 1716191171142,
              timezone: "Asia/Dubai",
              receiptNo: "#12563",
              tableNo: "T11",
              cashier: "Atif Mian",
              locale: {
                name: "fasion لكن",
                groupName: "شركة ايه بي سي للتجارة ذ",
                address: "الطابق السابع ، الغرفة الذهبية ، دبي",
              },
            },
            body: {
              products: productBody,
              totalAmtInfo: {
                paidVia: paymentMode,
                amtBeforeTax: subTotal,
                discount: 0,
                taxAmt: tax,
                amtInclTax: totalAmount,
                noOfItems: cart.cartItems.length,
              },
              paymentInfo: {
                cash: 1000.0,
                changeBack: 296.6,
                cardType: "Credit Card",
                cardNo: "3121 2455 XXXX 1344",
                expiresOn: "13/09/2023",
                authCode: "1133",
                signature: false,
              },
              membershipInfo: [
                {
                  title: "Shukran Membership",
                  locale: "عضوية شكراً",
                  value: "1890878753456876",
                },
                {
                  title: "Shukran Earned",
                  locale: "شكراً المكتسبة",
                  value: "19.0",
                },
                {
                  title: "Shukran Redeemed",
                  locale: "شكراً مستخدمة",
                  value: "0",
                },
                {
                  title: "Shukran Available",
                  locale: "شكراً متوفرة",
                  value: "167",
                },
              ],
            },
            footer: {
              appQRInfo: {
                errorLevel: "H",
                margin: 1,
                darkColor: "#000000",
                lightColor: "#1d1d2c",
                content: "appDownloadLink",
                desc: "Scan and download the app now",
                locale: "امسح التطبيق وقم بتنزيله الآن",
                img: "https://res.cloudinary.com/djfksvqs8/image/upload/v1680506869/image_1_ubsyvx.png",
              },
              policyInfo: {
                desc: "Please keep this receipt for any refund or exchange Refund & Exchange as per UC Policies.",
                locale:
                  "يرجى الاحتفاظ بهذا الإيصال لأي استرداد أو استبدال استرداد أو استبدال وفقًا لسياسات UC.",
              },
              invoiceBarcodeInfo: {
                bcid: "code128",
                text: "123456789",
                scale: 3,
                height: 10,
                includetext: true,
              },
              storeTimingInfo: {
                title: "Our shop timings:",
                localeTitle: "مواعيد متجرنا:",
                value: "SUN- THU 09:30 AM to 11:30 PM",
                localeValue: "الأحد - الخميس 09:30 صباحًا إلى 11:30 مساءً",
              },
              termsInfo: {
                desc: "Keep the bill for exchange within 7 days, valid only at issued store. T&C* applied. ",
                locale:
                  "احتفظ بفاتورة الصرف في غضون 7 أيام ، صالحة فقط في المتجر الصادر. تم تطبيق T & C *.",
              },
              rightsInfo: {
                desc: "Be Right Know Your Consumer Rights",
                locale: "كن على حق في معرفة حقوق المستهلك الخاصة بك",
                web: "www.consumerrights.ae",
                contact: "+917 600545555",
              },
            },
            other: [
              "Text that you want to display after footer info",
              "Text that you want to display after footer info",
            ],
          },
        },
        {
          headers: {
            "klip-api-key": "6D5A7134743777217A25432A462D4A61",
            "Content-Type": "application/json",
          },
        }
      );
      message.success(data.message);
    } catch (error) {
      console.log(error);
    }
    //add invoice to blockchain for stats
    const totalSalesAmount = (
      cart.total +
      (cart.total * cart.tax) / 100
    ).toFixed(2);

    try {
      const result = await axios.post("http://localhost:3345/stats/invoice", {
        adminId: "988",
        totalAmount: totalSalesAmount * 100,
      });
      message.success(result.data.success);
    } catch (error) {
      console.log(error);
    }
    //add invoice to db
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
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name={"klipitId"}
          label="Klipit ID"
          rules={[
            { required: true, message: "Please enter customer klipit ID!" },
          ]}
        >
          <Input placeholder="Enter klipit ID..." onBlur={handleKlipCustomer} />
        </Form.Item>
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
              Create Order & klipit
            </Button>
          </div>
        </Card>
      </Form>
    </Modal>
  );
};

export default CreateInvoice;
