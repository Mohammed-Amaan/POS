import Header from "../components/header/Header";
import { Table, Button, Input, Space, Spin } from "antd";
import { useEffect, useState, useRef } from "react";
import PrintInvoice from "../components/invoice/PrintInvoice";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal } from "antd";

const InvoicePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalnowOpen, setIsModalnowOpen] = useState(false);
  const [invoices, setInvoices] = useState();
  const [printData, setPrintData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    console.log(
      process.env.REACT_APP_SERVER_URL || "http://3.108.171.138:4000"
    );
    const getInvoices = async () => {
      try {
        const res = await fetch(
          process.env.REACT_APP_SERVER_URL + "/api/invoices/get-all"
        );
        const data = await res.json();
        const newData = data.map((item) => {
          return { ...item, key: item._id };
        });
        setInvoices(newData);
      } catch (error) {
        console.log(error);
      }
    };

    getInvoices();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleOk = () => {
    setIsModalnowOpen(false);
  };
  const handleCancel = () => {
    setIsModalnowOpen(false);
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "Phone Number",
      dataIndex: "customerPhoneNumber",
      key: "customerPhoneNumber",
      ...getColumnSearchProps("customerPhoneNumber"),
    },
    {
      title: "Creation Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => {
        return <span>{text.substring(0, 10)}</span>;
      },
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMode",
      key: "paymentMode",
    },
    {
      title: "Total Price",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text, record) => {
        return <span>{text} AED</span>;
      },
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "100px",
      render: (text, record) => {
        return (
          <>
            <Button
              size="small"
              type="primary"
              className="mr-2"
              onClick={() => {
                setIsModalOpen(true);
                setPrintData(record);
              }}
            >
              Print
            </Button>
            <Button
              size="small"
              type="primary"
              style={{
                backgroundColor: "#00AA00",
                borderColor: "#00AA00",
                color: "#FFFFFF",
              }}
              onClick={async () => {
                const { cartItems, paymentMode, subTotal, tax, totalAmount } =
                  record;
                console.log(cartItems);
                const productBody = cartItems.map((cartItem) => ({
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

                const truklipIds = cartItems.map((cartItem) => {
                  if (
                    cartItem.category === "Chocolates" ||
                    cartItem.category === "Fruits"
                  )
                    return undefined;
                  else return cartItem.truklipId;
                });
                const truklipProducts = truklipIds.filter(
                  (item) => item !== undefined
                );
                //console.log(truklipProducts);
                try {
                  const result = await axios.post(
                    process.env.REACT_APP_SERVER_URL + "/nft/bulk",
                    {
                      address: "0x500f326D72413B580C6ae95A92FfCA3681BC8c8C",
                      klipitId: "1234",
                      truklipIds: truklipProducts,
                    }
                  );
                  alert(result.data.success);
                } catch (error) {
                  console.log(error);
                }
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
                            noOfItems: cartItems.length,
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
                            localeValue:
                              "الأحد - الخميس 09:30 صباحًا إلى 11:30 مساءً",
                          },
                          termsInfo: {
                            desc: "Keep the bill for exchange within 7 days, valid only at issued store. T&C* applied. ",
                            locale:
                              "احتفظ بفاتورة الصرف في غضون 7 أيام ، صالحة فقط في المتجر الصادر. تم تطبيق T & C *.",
                          },
                          rightsInfo: {
                            desc: "Be Right Know Your Consumer Rights",
                            locale:
                              "كن على حق في معرفة حقوق المستهلك الخاصة بك",
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
                  alert(data.message);
                  setIsModalnowOpen(true);
                  <Modal
                    title="Basic Modal"
                    open={isModalnowOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    {data.message}
                  </Modal>;
                } catch (error) {
                  console.log(error);
                  alert(error.message);
                }
              }}
            >
              Klipit
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Header />
      {invoices ? (
        <div className="px-6 min-h-[550px]">
          <h1 className="text-4xl text-center font-bold mb-4">Invoices</h1>
          <Table
            dataSource={invoices}
            columns={columns}
            bordered
            pagination={true}
            scroll={{ x: 1200, y: 300 }}
            rowKey="_id"
          />
        </div>
      ) : (
        <Spin size="large" className="absolute left-1/2 top-1/2" />
      )}
      <PrintInvoice
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        printData={printData}
      />
    </>
  );
};

export default InvoicePage;
