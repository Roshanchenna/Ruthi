import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/auth";
console.log("API URL:", API_URL);
// const API_URL = 'https://jobx-32a058281844.herokuapp.com/api/auth';

export const loginUserAPI = async (
  loginState,
  showNotification,
  setToken,
  setUserInfo,
  navigate
) => {
  console.log("Login State: ", loginState);
  try {
    const data = loginState;
    console.log("data:", data);
    const response = await axios.post(`${API_URL}/login`, data);

    if (response.status === 200) {
      setToken(response.data.token);
      console.log("Login successful");
      // Fetch user information
      const userResponse = await axios.get(`${API_URL}/user/info`, {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
        },
      });

      console.log("userResponse:", userResponse);

      if (userResponse.status === 200) {
        const userData = userResponse.data;
        console.log("userData:", userData);
        console.log("isVerified:", userData.isVerified);
        
        try {
          const profileResponse = await axios.get(`${BACKEND_URL}/api/user-profile/${userData._id}`);
          console.log("profileResponse:", profileResponse);
          // If we reach here, it means the profile exists
          navigate("/home");
        } catch (profileError) {
          if (profileError.response && profileError.response.status === 404) {
            // Profile doesn't exist, navigate to upload resume
            navigate("/uploadResume");
          } else {
            // Handle other errors
            console.error("Error checking user profile:", profileError);
            showNotification("Error checking user profile. Please try again.", "error");
          }
        }
      }
      showNotification("Login successful", "success");
    }
  } catch (error) {
    console.log("Login failed", error);
    if (error.response) {
      if (error.response.status === 404) {
        showNotification("User not found. Please check your username.", "error");
      } else if (error.response.status === 401) {
        showNotification("Invalid password. Please check your password.", "error");
      } else {
        showNotification("Network or server error. Please try again later.", "error");
      }
    } else {
      showNotification("An unexpected error occurred. Please try again.", "error");
    }
  }
};

export const registerUserAPI = async (
  signUpState,
  showNotification,
  onSuccess
) => {
  try {
    var data = {
      username: signUpState["username"],
      password: signUpState["password"],
      email: signUpState["email"],
      role: signUpState["role"],
      companyName: signUpState["companyName"],
    };
    console.log("data", data);
    const response = await axios.post(`${API_URL}/register`, data);
    console.log("Status:", response.status);
    console.log("Response:", response.data);

    if (response.status === 201) {
      console.log("Registration successful");
      showNotification("Registration successful", "success");
      onSuccess();
    }
  } catch (error) {
    console.log("Registration failed", error);
    if (error.response.status === 400) {
      console.log("Username is already in use.");
      showNotification("Username is already in use.", "error");
    } else if (error.response.status === 500) {
      console.error("Error during registration:", error);
      showNotification(
        "Network or server error. Please try again later.",
        "error"
      );
    } else {
      console.log("Failed");
      showNotification("Registration failed. Please try again.", "error");
    }
  }
};
