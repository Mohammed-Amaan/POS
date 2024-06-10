import Header from "../components/header/Header";
import { Table, Card, Button, message, Popconfirm, Input, Space } from "antd";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateInvoice from "../components/cart/CreateInvoice";
import { useDispatch, useSelector } from "react-redux";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { increase, decrease, deleteProduct, reset } from "../redux/cartSlice";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";

const CartPage = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch(increase);
  //
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
            Close
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
      title: "Product Image",
      dataIndex: "img",
      key: `${Math.random()}`,
      width: "120px",
      render: (text) => {
        return <img src={text} alt="" className="w-full h-20 object-cover" />;
      },
    },
    {
      title: "Product Name",
      dataIndex: "title",
      key: `${Math.random()}`,
      ...getColumnSearchProps("title"),
    },
    {
      title: "Truklip ID",
      dataIndex: "truklipId",
      key: `${Math.random()}`,
      ...getColumnSearchProps("truklipId"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: `${Math.random()}`,
      render: (text) => {
        return <span>{text.toFixed(2)} AED</span>;
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: `${Math.random()}`,
      render: (text, record) => {
        return (
          <div className="flex items-center">
            <Button
              type="primary"
              size="small"
              className="w-full flex items-center justify-center !rounded-full"
              icon={<PlusCircleOutlined />}
              onClick={() => dispatch(increase(record))}
            />
            <span className="font-bold w-6 inline-block text-center">
              {record.quantity}
            </span>
            <Button
              type="primary"
              size="small"
              className="w-full flex items-center justify-center !rounded-full"
              icon={<MinusCircleOutlined />}
              onClick={() => {
                if (record.quantity === 1) {
                  if (window.confirm("Delete Product?")) {
                    dispatch(decrease(record));
                    message.info("Product Successfully Deleted from Cart.");
                  }
                }
                if (record.quantity > 1) {
                  dispatch(decrease(record));
                }
              }}
            />
          </div>
        );
      },
    },
    {
      title: "Total Price",
      dataIndex: "Total Price",
      key: `${Math.random()}`,
      render: (text, record) => {
        return <span>{(record.quantity * record.price).toFixed(2)} AED</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: `${Math.random()}`,
      width: "100px",
      render: (text, record) => {
        return (
          <Popconfirm
            title="Product Deletion "
            description="Are you sure you want to delete the product?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => dispatch(deleteProduct(record))}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <div
        className="px-6"
        style={{ overflowY: "auto", height: "calc(100vh - 64px)" }}
      >
        <Table
          dataSource={cart.cartItems}
          columns={columns}
          bordered
          pagination={false}
          scroll={{ x: 1200, y: 400 }}
        />
        <Button type="primary" className="my-1" onClick={() => navigate("/")}>
          Add Products
        </Button>
        <div className="flex justify-end mt-4 mb-16">
          <Card className="w-72">
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
                  : 0}{" "}
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
            <Button
              size="large"
              type="primary"
              className="mt-4 w-full"
              onClick={() => setIsModalOpen(true)}
              disabled={cart.cartItems.length > 0 ? false : true}
            >
              Create Order
            </Button>
            <Popconfirm
              title="Delete All Items"
              description="Are you sure you want to delete all items?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => dispatch(reset())}
              className="w-full mt-2 flex items-center justify-center"
            >
              {cart.cartItems.length > 0 ? (
                <Button
                  type="primary"
                  size="large"
                  className="w-full mt-2 flex items-center justify-center"
                  icon={<ClearOutlined />}
                  danger
                  disabled={cart.cartItems.length > 0 ? false : true}
                >
                  Delete All
                </Button>
              ) : (
                ""
              )}
            </Popconfirm>
          </Card>
        </div>
      </div>
      <CreateInvoice
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default CartPage;
