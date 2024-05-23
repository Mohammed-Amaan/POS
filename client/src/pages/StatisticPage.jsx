import Header from "../components/header/Header";
import StatisticCard from "../components/statistic/StatisticCard";
import React, { useState, useEffect } from "react";
import { Area, Bar, Pie } from "@ant-design/plots";
import { Spin, Button } from "antd";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";

const StatisticPage = () => {
  const [allInvoice, setAllInvoice] = useState();
  const [Invoice, setInvoice] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(
          process.env.REACT_APP_SERVER_URL + "/api/products/get-all"
        );
        const datas = await res.json();
        setProducts(datas);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, []);

  const asyncFetch = async () => {
    try {
      const res = await fetch(
        process.env.REACT_APP_SERVER_URL + "/api/invoices/get-all"
      );
      const result = await res.json();
      setAllInvoice(result);
    } catch (error) {
      console.log(error);
    }
  };

  const totalAmount = () => {
    const amount = Invoice.reduce((total, item) => item.totalAmount + total, 0);
    return `${amount.toFixed(2)}  AED`;
  };

  const config = {
    data: Invoice,
    xField: "customerName",
    yField: "subTotal",
    xAxis: {
      range: [0, 1],
    },
  };

  const config2 = {
    appendPadding: 10,
    data: Invoice,
    angleField: "subTotal",
    colorField: "customerName",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "AntV\nG2Plot",
      },
    },
  };

  const localStr = localStorage.getItem("postUser");
  const user = JSON.parse(localStr);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handleSelect = (date) => {
    let filtered = allInvoice.filter((invoice) => {
      let invoiceDate = new Date(invoice["createdAt"]);
      return (
        invoiceDate >= date.selection.startDate &&
        invoiceDate <= date.selection.endDate
      );
    });
    let filterProducts = products.filter((product) => {
      let productDate = new Date(product["createdAt"]);

      return (
        productDate >= date.selection.startDate &&
        productDate <= date.selection.endDate
      );
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setInvoice(filtered);
    setFilteredProducts(filterProducts);
  };
  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };
  const displayDate = () => {
    let start = startDate.toString().substring(0, 16);
    let end = endDate.toString().substring(0, 16);
    return start === end ? `${start}` : `${start}-${end}`;
  };
  return (
    <>
      <Header />
      <div
        className="overflow-auto h-screen"
        style={{ overflowY: "auto", height: "calc(100vh - 64px)" }}
      >
        {Invoice ? (
          <div className="px-6 md:pb-0 pb-20">
            <h1 className="text-4xl text-center font-bold mb-4">Statistics</h1>
            <div>
              <h2 className="text-lg">
                Welcome{" "}
                <span className="text-xl text-green-700 font-bold">
                  {user.username}
                </span>
              </h2>
              <h2 className="text-center font-bold text-xl">{`Statistics of ${displayDate()}`}</h2>

              <div className="statistic-cards grid xl:grid-cols-4 md:grid-cols-2 my-10 md:gap-10 gap-4">
                <StatisticCard
                  title={"Total Customers"}
                  amount={Invoice.length}
                  image={"images/user.png"}
                />
                <StatisticCard
                  title={"Total Revenue"}
                  amount={totalAmount()}
                  image={"images/money.png"}
                />
                <StatisticCard
                  title={"Total Sales"}
                  amount={Invoice.length}
                  image={"images/sale.png"}
                />
                <StatisticCard
                  title={"Total Products"}
                  amount={filteredProducts.length}
                  image={"images/product.png"}
                />
              </div>
              <Button type="primary" onClick={toggleDatePicker}>
                Filter By Date
              </Button>
              {isDatePickerVisible && (
                <DateRangePicker
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                />
              )}
              <div className="flex justify-between gap-10 lg:flex-row flex-col md:p-10 p-4">
                <div className="lg:w-1/2 lg:h-72 h-72">
                  <Bar {...config} />
                </div>
                <div className="lg:w-1/2 lg:h-72 h-72">
                  <Pie {...config2} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Spin size="large" className="absolute left-1/2 top-1/2" />
        )}
      </div>
    </>
  );
};

export default StatisticPage;
