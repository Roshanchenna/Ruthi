import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:3004'; // You might want to move this to an environment variable

export const saveUserProfileData = async (userId, data) => {
  const token = localStorage.getItem('authToken');
  if (!token || !userId) {
    toast.error('You must be logged in to save your profile.');
    throw new Error('Authentication required');
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/api/user-profile/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Profile data saved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving profile data:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      toast.error(`Failed to save: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      toast.error('Failed to save. No response received from server.');
    } else {
      console.error('Error setting up request:', error.message);
      toast.error('Failed to save. Please try again.');
    }
    throw error;
  }
};
