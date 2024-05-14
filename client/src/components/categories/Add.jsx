import { Button, Form, Input, Modal, message } from "antd";

const Add = ({
  isAddModalOpen,
  setIsAddModalOpen,
  categories,
  setCategories,
}) => {
  const [form] = Form.useForm();

  const onFinish = (value) => {
    try {
      fetch(
        (process.env.REACT_APP_SERVER_URL || "https://3.108.171.138") +
          "/api/categories/add-category",
        {
          method: "POST",
          body: JSON.stringify(value),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );
      message.success("Category successfully added.");
      setIsAddModalOpen(false);
      form.resetFields();
      setCategories([
        ...categories,
        {
          _id: Math.random(),
          title: value.title,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title="Add New Category"
      open={isAddModalOpen}
      onCancel={() => setIsAddModalOpen(false)}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label={"Add Category"}
          name="title"
          rules={[
            {
              required: true,
              message: "This field cannot be empty!",
            },
          ]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>
        <Form.Item className="flex justify-end mb-0">
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Add;
