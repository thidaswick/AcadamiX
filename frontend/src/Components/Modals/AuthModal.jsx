import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Divider, Space, Typography } from "antd";
import { InboxOutlined, GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import UploadFileService from "../../Services/UploadFileService";
import AuthService from "../../Services/AuthService";
import UserService from "../../Services/UserService";

const { Title, Text } = Typography;
const uploader = new UploadFileService();

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [signinFocused, setSigninFocused] = useState(true);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const toggleFocus = () => {
    setSigninFocused(!signinFocused);
  };

  const handleFormSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (signinFocused) {
        const response = await AuthService.login(values.username, values.password);
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("accessToken", response.accessToken);
        message.success("Welcome back!");
        if (onSuccess) onSuccess();
        onClose();
        form.resetFields();
      } else {
        const exists = await UserService.checkIfUserExists(values.username);
        if (exists) {
          message.error("Username already taken!");
          return;
        } else {
          const response = await AuthService.register(values.username, values.password);
          localStorage.setItem("userId", response.userId);
          localStorage.setItem("accessToken", response.accessToken);
        }

        let imageUrl = "";
        if (values.file) {
          imageUrl = await uploader.uploadFile(values.file[0].originFileObj, "userImages");
        }
        const body = {
          userId: localStorage.getItem("userId"),
          image: imageUrl,
          email: values.email,
        };
        await UserService.createProfile(body);
        message.success("Account created!");
        if (onSuccess) onSuccess();
        onClose();
        form.resetFields();
      }
    } catch (err) {
      message.error("Error: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
      form.resetFields();
      window.location.reload();
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      footer={null}
      onCancel={onClose}
      className="auth-modal-blur"
      width={480}
      style={{ top: 50 }}
      bodyStyle={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        padding: "40px",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <Title level={3} style={{ color: "#ffffff" }}>
          {signinFocused ? "Welcome Back!" : "Create Your Account"}
        </Title>
        <Text style={{ color: "#d1d1d1" }}>
          {signinFocused
            ? "Sign in to continue to LearnMate."
            : "Sign up and start your journey!"}
        </Text>
      </div>

      <Space direction="vertical" style={{ width: "100%", marginBottom: "24px" }}>
        <Button
          icon={<GoogleOutlined style={{ fontSize: "18px" }} />}
          onClick={() => handleOAuthLogin("google")}
          block
          style={{
            backgroundColor: "#4285F4",
            color: "white",
            height: "45px",
            borderRadius: "10px",
            fontSize: "15px",
          }}
        >
          Continue with Google
        </Button>
        <Button
          icon={<GithubOutlined style={{ fontSize: "18px" }} />}
          onClick={() => handleOAuthLogin("github")}
          block
          style={{
            backgroundColor: "#24292e",
            color: "white",
            height: "45px",
            borderRadius: "10px",
            fontSize: "15px",
          }}
        >
          Continue with GitHub
        </Button>
      </Space>

      <Divider style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.2)" }}>
        OR
      </Divider>

      <Form
        name="authForm"
        form={form}
        initialValues={{ remember: true }}
        onFinish={handleFormSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="username"
          label={<span style={{ color: "#fff", fontSize: "14px" }}>Username</span>}
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input placeholder="Enter your username" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span style={{ color: "#fff", fontSize: "14px" }}>Password</span>}
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Enter your password" size="large" />
        </Form.Item>

        {!signinFocused && (
          <>
            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              label={<span style={{ color: "#fff", fontSize: "14px" }}>Confirm Password</span>}
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
                      new Error("The two passwords that you entered do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" size="large" />
            </Form.Item>

            <Form.Item
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              label={<span style={{ color: "#fff", fontSize: "14px" }}>Profile Picture</span>}
            >
              <Upload.Dragger
                beforeUpload={() => false}
                multiple={false}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px dashed rgba(255,255,255,0.3)",
                  borderRadius: "12px",
                  padding: "20px",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                <p className="ant-upload-drag-icon" style={{ color: "#fff" }}>
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text" style={{ color: "#fff" }}>
                  Click or drag file to upload
                </p>
              </Upload.Dragger>
            </Form.Item>
          </>
        )}

        <Form.Item style={{ marginTop: "24px" }}>
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            block
            style={{
              height: "50px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#1677ff",
              borderColor: "#1677ff",
            }}
          >
            {signinFocused ? "Sign In" : "Sign Up"}
          </Button>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
          <Button
            type="link"
            onClick={toggleFocus}
            style={{ color: "#a1c4ff", fontSize: "14px" }}
          >
            {signinFocused
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AuthModal;
