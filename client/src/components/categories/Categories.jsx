import { useEffect, useState } from "react";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import Add from "./Add";
import Edit from "./Edit";
import "./style.css";

const Categories = ({ categories, setCategories, products, setFiltered }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("All");

  useEffect(() => {
    if (categoryTitle === "All") {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter((product) => product.category === categoryTitle)
      );
    }
  }, [products, setFiltered, categoryTitle]);

  return (
    <ul className="flex gap-4 md:flex-col flex-row text-lg overflow-x-auto">
      {categories.map((item) => (
        <li
          className={`category-item ${
            item.title === categoryTitle && "!bg-pink-700"
          }`}
          key={item._id}
          onClick={() => setCategoryTitle(item.title)}
        >
          <span>{item.title}</span>
        </li>
      ))}

      <li
        className="category-item  !bg-blue-600 hover:opacity-90"
        onClick={() => setIsAddModalOpen(true)}
      >
        <PlusOutlined className="md:text-3xl text-2xl" />
      </li>

      <li
        className="category-item  !bg-fuchsia-600	 hover:opacity-90"
        onClick={() => setIsEditModalOpen(true)}
      >
        <EditOutlined className="md:text-3xl text-2xl" />
      </li>

      <Add
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        categories={categories}
        setCategories={setCategories}
      />

      <Edit
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        categories={categories}
        setCategories={setCategories}
      />
    </ul>
  );
};

export default Categories;
