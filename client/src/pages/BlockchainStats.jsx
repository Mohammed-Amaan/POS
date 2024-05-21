import Header from "../components/header/Header";
import StatisticCard from "../components/statistic/StatisticCard";
import React, { useState, useEffect } from "react";
import { Area, Pie } from "@ant-design/plots";
import { Spin } from "antd";
import axios from "axios";

const BlockchainStats = () => {
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);

  useEffect(() => {
    asyncFetch();
    getProduct();
    fetchTotalAmount();
    fetchTotalSales();
  }, []);

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

  const asyncFetch = () => {
    fetch(process.env.REACT_APP_SERVER_URL + "/api/invoices/get-all")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };

  const fetchTotalAmount = async () => {
    try {
      const result = await axios.post("http://localhost:3345/stats/amount", {
        adminId: 988,
      });
      setTotalRevenue(result.data.TotalSalesAmount / 100);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalSales = async () => {
    try {
      const sales = await axios.post("http://localhost:3345/stats/sales", {
        adminId: 988,
      });
      setTotalSalesCount(sales.data.TotalSales);
    } catch (error) {
      console.log(error);
    }
  };

  const config = {
    data,
    xField: "customerName",
    yField: "subTotal",
    xAxis: {
      range: [0, 1],
    },
  };

  const config2 = {
    appendPadding: 10,
    data,
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

  return (
    <>
      <Header />
      <div
        className="overflow-auto h-screen"
        style={{ overflowY: "auto", height: "calc(100vh - 64px)" }}
      >
        {data ? (
          <div className="px-6 md:pb-0 pb-20">
            <h1 className="text-4xl text-center font-bold mb-4">Statistics</h1>
            <div>
              <h2 className="text-lg">
                Welcome{" "}
                <span className="text-xl text-green-700 font-bold">
                  {user.username}
                </span>
              </h2>
              <div className="statistic-cards grid xl:grid-cols-4 md:grid-cols-2 my-10 md:gap-10 gap-4">
                <StatisticCard
                  title={"Total Customers"}
                  amount={totalSalesCount}
                  image={"images/user.png"}
                />
                <StatisticCard
                  title={"Total Revenue"}
                  amount={totalRevenue}
                  image={"images/money.png"}
                />
                <StatisticCard
                  title={"Total Sales"}
                  amount={totalSalesCount}
                  image={"images/sale.png"}
                />
                <StatisticCard
                  title={"Total Products"}
                  amount={products.length}
                  image={"images/product.png"}
                />
              </div>
              <div className="flex justify-between gap-10 lg:flex-row flex-col md:p-10 p-4">
                <div className="lg:w-1/2 lg:h-72 h-72 ">
                  <Area {...config} />
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

export default BlockchainStats;