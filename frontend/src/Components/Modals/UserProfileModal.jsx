import React, { useState, useEffect } from "react";
import { Modal, Switch, Input, Button, Upload, message, Form, Avatar, Typography, Divider } from "antd";
import { UploadOutlined, LoadingOutlined, UserOutlined, EditOutlined, DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import UserService from "../../Services/UserService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const uploader = new UploadFileService();
const { Item } = Form;




const UserProfileModal = () => {
  const snap = useSnapshot(state);
  const [uploadUserLoading, setUploadUserLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Reset imageChanged state when modal opens
  useEffect(() => {
    if (snap.profileModalOpend) {
      setImageChanged(false);
    }
  }, [snap.profileModalOpend]);

  const handleUpdateProfile = async () => {
    try {
      setUpdateLoading(true);
      const formData = form.getFieldsValue();
      
      // Only handle image upload if it's a File object and has been changed
      if (formData.image instanceof File && imageChanged) {
        formData.image = await handleFileUpload(formData.image);
      }
      
      await UserService.updateUserPrifile({
        ...formData,
        uid: snap.currentUser?.id,
      });

      useEffect(() => {
        if (snap.profileModalOpend) {
          setImageChanged(false);
        }
      }, [snap.profileModalOpend]);
    
      // After successful update, refresh current user data
      const updatedUserData = await UserService.getProfile();
      state.currentUser = updatedUserData; // Update the global state

      state.profileModalOpend = false;
      message.success("Profile updated successfully");
      setImageChanged(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      message.error("Profile updating failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const url = await uploader.uploadFile(file, "userImages");
      return url;
    } catch (error) {
      throw new Error("File upload failed");
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setUploadUserLoading(true);
      setImageChanged(true);
      
      try {
        const imageUrl = await handleFileUpload(info.fileList[0].originFileObj);
        form.setFieldsValue({ image: imageUrl });
        message.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        message.error("Failed to upload image");
        setImageChanged(false);
      } finally {
        setUploadUserLoading(false);
      }
    }
  };

  const handleDeleteProfile = async () => {
    try {
      setDeleteLoading(true);
      await UserService.deleteUserProfileById(snap.currentUser?.uid);
      message.success("Profile deleted successfully");

      // After successful deletion, navigate to the login page or logout
      localStorage.clear();
      navigate("/"); // Redirect to home or login page after deletion
    } catch (error) {
      console.error("Error deleting user:", error.message);
      message.error("Profile deletion failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const hasFormChanged = () => {
    const currentValues = form.getFieldsValue();
    const initialValues = snap.currentUser;
  
    if (!initialValues) return false;
  
    return (
      currentValues.profileVisibility !== initialValues.profileVisibility ||
      imageChanged
    );
  };
  

  return (
    <Modal
      open={snap.profileModalOpend}
      onCancel={() => {
        state.profileModalOpend = false;
      }}
      footer={null}
      width={600}
      centered
      className="profile-modal"
      bodyStyle={{
        padding: "24px",
        borderRadius: "12px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <Avatar
          size={100}
          src={form.getFieldValue("image")}
          icon={<UserOutlined />}
          style={{
            border: "3px solid #2E7D32",
            marginBottom: "16px",
            boxShadow: "0 4px 12px rgba(46, 125, 50, 0.15)",
          }}
        />
        <Title level={3} style={{ margin: 0, color: "#2E7D32" }}>
          {snap.currentUser?.username}
        </Title>
        <Text type="secondary" style={{ fontSize: "14px" }}>
          Edit your profile information
        </Text>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      <Form form={form} initialValues={snap.currentUser} layout="vertical">
        <Item name="username" label="Username">
          <Input 
            disabled 
            prefix={<UserOutlined style={{ color: "#2E7D32" }} />}
            style={{ borderRadius: "8px" }}
          />
        </Item>

        <Item name="image" label="Profile Picture">
          <Upload
            accept="image/*"
            onChange={handleFileChange}
            showUploadList={false}
            beforeUpload={() => false}
            disabled={uploadUserLoading}
          >
            <Button 
              icon={uploadUserLoading ? <LoadingOutlined /> : <UploadOutlined />} 
              disabled={uploadUserLoading}
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "8px",
                borderColor: "#2E7D32",
                color: "#2E7D32",
                background: "#E8F5E9",
              }}
            >
              {uploadUserLoading ? "Uploading..." : "Upload New Image"}
            </Button>
          </Upload>
        </Item>

        <Item
          name="profileVisibility"
          label="Profile Visibility"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Public" 
            unCheckedChildren="Private"
            style={{ backgroundColor: "#2E7D32" }}
            disabled={uploadUserLoading}
          />
        </Item>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginTop: "24px",
          gap: "12px"
        }}>
          <Button
            icon={<EditOutlined />}
            loading={updateLoading}
            type="default"
            onClick={handleUpdateProfile}
            disabled={uploadUserLoading || (!hasFormChanged() && !imageChanged)}
            style={{
              background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
              border: "none",
              borderRadius: "8px",
              flex: 1,
              height: "42px",
              fontSize: "15px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(46, 125, 50, 0.2)",
              color: "white",
              ":hover": {
                background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(46, 125, 50, 0.3)"
              },
              ":disabled": {
                background: "linear-gradient(135deg, #9E9E9E 0%, #757575 100%)",
                color: "white",
                cursor: "not-allowed"
              }
            }}
          >
            Update Profile
          </Button>

          <Button
            icon={<DeleteOutlined />}
            loading={deleteLoading}
            danger
            onClick={handleDeleteProfile}
            disabled={uploadUserLoading || updateLoading}
            style={{
              borderRadius: "8px",
              flex: 1,
              height: "42px",
              fontSize: "15px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(244, 67, 54, 0.2)",
              ":hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(244, 67, 54, 0.3)"
              }
            }}
          >
            Delete Profile
          </Button>

          <Button
            icon={<LogoutOutlined />}
            danger
            type="dashed"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            disabled={uploadUserLoading || updateLoading || deleteLoading}
            style={{
              borderRadius: "8px",
              flex: 1,
              height: "42px",
              fontSize: "15px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.3s ease",
              borderColor: "#f44336",
              color: "#f44336",
              background: "rgba(244, 67, 54, 0.04)",
              ":hover": {
                background: "rgba(244, 67, 54, 0.08)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(244, 67, 54, 0.1)"
              }
            }}
          >
            Logout
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UserProfileModal;
