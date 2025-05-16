import axios from "axios";
import { BASE_URL } from "../constants";
import { message } from "antd";

const UserService = {
  async checkIfUserExists(username) {
    try {
      const response = await axios.get(`${BASE_URL}/users/exists/${username}`);
      return response.data;
    } catch (error) {
      console.error("Error checking if user exists:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to check if user exists");
      throw error;
    }
  },

  async createProfile(body) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Please login to create profile");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };

      console.log("Creating user profile:", body);
      const response = await axios.post(
        `${BASE_URL}/userProfiles`,
        body,
        config
      );
      console.log("User profile created successfully:", response.data);
      message.success("Profile created successfully");
      return response.data;
    } catch (error) {
      console.error("Error creating user profile:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to create profile");
      throw error;
    }
  },

  async getProfileById(id) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Please login to view profile");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      console.log("Fetching user profile by ID:", id);
      const response = await axios.get(
        `${BASE_URL}/userProfiles/${id}`,
        config
      );
      console.log("User profile fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to fetch profile");
      throw error;
    }
  },

  async getProfiles() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Please login to view profiles");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      console.log("Fetching all user profiles");
      const response = await axios.get(`${BASE_URL}/userProfiles`, config);
      console.log("User profiles fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profiles:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to fetch profiles");
      throw error;
    }
  },
  async getProfile() {
    try {
      const uid = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");

      if (!uid || !accessToken) {
        message.error("Please login to view your profile");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };














  async getProfile() {
    try {
      const uid = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");

      if (!uid || !accessToken) {
        message.error("Please login to view your profile");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      console.log("Fetching user data for ID:", uid);
      const [userResponse, profileResponse] = await Promise.all([
        axios.get(`${BASE_URL}/users/${uid}`, config),
        axios.get(`${BASE_URL}/userProfiles/user/${uid}`, config)
      ]);

      console.log("User data:", userResponse.data);
      console.log("Profile data:", profileResponse.data);

      if (!userResponse.data) {
        throw new Error("User data not found");
      }

      const userProfile = profileResponse.data && profileResponse.data.length > 0 
        ? profileResponse.data[0] 
        : {};

      const mergedProfile = {
        ...userResponse.data,
        ...userProfile,
        uid: userProfile.id || uid,
      };

      console.log("Merged profile data:", mergedProfile);
      return mergedProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to fetch your profile");
      throw error;
    }
  },

  async updateUserProfile(data) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Please login to update profile");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };

      console.log("Updating user profile:", data);
      const response = await axios.put(
        `${BASE_URL}/userProfiles/${data.uid}`,
        data,
        config
      );
      console.log("User profile updated successfully:", response.data);
      message.success("Profile updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    }
  },

  async deleteUserProfileById(profileId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Please login to delete profile");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      console.log("Deleting user profile:", profileId);
      await axios.delete(`${BASE_URL}/userProfiles/${profileId}`, config);
      console.log("User profile deleted successfully");
      message.success("Profile deleted successfully");
    } catch (error) {
      console.error("Error deleting user profile:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to delete profile");
      throw error;
    }
  },
};

export default UserService;
