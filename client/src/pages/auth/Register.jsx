import { Button, Form, Input, Carousel, message } from "antd";
import { Link } from "react-router-dom";
import AuthCarousel from "../../components/auth/AuthCarousel";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await fetch(
        process.env.REACT_APP_SERVER_URL + "/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );
      if (res.status === 200) {
        message.success("Registration successful");
        navigate("/login");
        setLoading(false);
      }
    } catch (error) {
      message.error("Something went wrong!");
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
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Username"
              name={"userName"}
              rules={[
                {
                  required: true,
                  message: "Username cannot be empty!",
                },
              ]}
            >
              <Input />
            </Form.Item>
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
            <Form.Item
              label="Confirm Password"
              name={"passwordAgain"}
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
          <div className="absolute bottom-10 left-0 w-full flex items-center justify-center">
            Already have an account?
            <Link to="/login" className="text-blue-600 inline-block p-2">
              Log in now
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

export default Register;
