import { Button, Form, Input, Carousel, Checkbox, message } from "antd";
import { Link } from "react-router-dom";
import AuthCarousel from "../../components/auth/AuthCarousel";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      const user = await res.json();

      if (res.status === 200) {
        message.success("Login successful");
        navigate("/");
        setLoading(false);
        localStorage.setItem(
          "postUser",
          JSON.stringify({
            username: user.userName,
            email: user.email,
          })
        );
      } else if (res.status === 403) {
        message.error("Invalid Password!");
      } else if (res.status === 404) {
        message.error("User Not Found!");
      }

      setLoading(false);
    } catch (error) {
      message.error("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex justify-between h-full">
        <div className="xl:w-2/6 min-w-[400px] xl:px-20 px-10 flex flex-col justify-center w-full relative">
          <h1 className="text-center text-5xl font-bold mb-6">
            <Link to="/">
              <span className="text-black">klip</span>
              <span className="text-green-500">it</span>
            </Link>
          </h1>
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ remember: false }}
          >
            <Form.Item
              label="E-mail"
              name={"email"}
              rules={[
                {
                  required: true,
                  message: "Email cannot be empty!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name={"password"}
              rules={[
                {
                  required: true,
                  message: "Password cannot be empty!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item name={"remember"} valuePropName="checked">
              <div className="flex justify-between items-center">
                <Checkbox>Remember me</Checkbox>
                <Link to={"/login"}>Forgot password?</Link>
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
          <div className="absolute bottom-10 left-0 w-full flex items-center justify-center">
            Don't have an account yet?
            <Link to="/register" className="text-blue-600 inline-block p-2">
              Sign up now!
            </Link>
          </div>
        </div>
        <div className="sm:flex hidden xl:w-4/6 min-w-[500px] bg-[#6c63ff]">
          <div className="w-full mt-40">
            <Carousel autoplay>
              <AuthCarousel
                img={"images/responsive.svg"}
                title={"Responsive"}
                desc={"Compatibility with all device sizes"}
              />
              <AuthCarousel
                img={"images/statistic.svg"}
                title={"Statistics"}
                desc={"Wide range of statistics"}
              />
              <AuthCarousel
                img={"images/customer.svg"}
                title={"Customer Satisfaction"}
                desc={"Satisfied customers at the end of the experience"}
              />
              <AuthCarousel
                img={"images/admin.svg"}
                title={"Admin Panel"}
                desc={"Management from a single place"}
              />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
