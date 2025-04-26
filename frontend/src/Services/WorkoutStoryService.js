import axios from "axios";
import { BASE_URL } from "../constants";
import { message } from "antd";

class WorkoutStoryService {
  async createWorkoutStory(workoutStoryData) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Please login to create a workout story");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };

      console.log("Creating workout story:", workoutStoryData);
      const response = await axios.post(
        `${BASE_URL}/workoutStatusUpdates`,
        workoutStoryData,
        config
      );
      console.log("Workout story created successfully:", response.data);
      message.success("Workout story created successfully");
      return response.data;
    } catch (error) {
      console.error("Error creating workout story:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to create workout story");
      throw error;
    }
  }

  async getWorkoutStoriesByUserId(userId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Please login to view workout stories");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      console.log("Fetching workout stories for user:", userId);
      const response = await axios.get(
        `${BASE_URL}/workoutStatusUpdates/${userId}`,
        config
      );
      console.log("Workout stories fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching workout stories:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to fetch workout stories");
      throw error;
    }
  }

  async getAllWorkoutStories() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Please login to view workout stories");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      console.log("Fetching all workout stories");
      const response = await axios.get(
        `${BASE_URL}/workoutStatusUpdates`,
        config
      );
      console.log("All workout stories fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all workout stories:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to fetch workout stories");
      throw error;
    }
  }

  async deleteWorkoutStory(updateId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Please login to delete workout story");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      console.log("Deleting workout story:", updateId);
      await axios.delete(
        `${BASE_URL}/workoutStatusUpdates/${updateId}`,
        config
      );
      console.log("Workout story deleted successfully");
      message.success("Workout story deleted successfully");
    } catch (error) {
      console.error("Error deleting workout story:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to delete workout story");
      throw error;
    }
  }

  async updateWorkoutStory(updateId, workoutStoryData) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Please login to update workout story");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };

      console.log("Updating workout story:", updateId, workoutStoryData);
      const response = await axios.put(
        `${BASE_URL}/workoutStatusUpdates/${updateId}`,
        workoutStoryData,
        config
      );
      console.log("Workout story updated successfully:", response.data);
      message.success("Workout story updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating workout story:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to update workout story");
      throw error;
    }
  }
}

export default new WorkoutStoryService();
