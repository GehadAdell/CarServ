<template>
  <div class="container">
    <!-- Logo Section -->
    <div class="mb-12">
      <img :src="logo" alt="Car Service Logo" class="h-24" />
    </div>

    <!-- SMS Code Section -->
    <div class="sms-section">
      <p>{{ $t("mobilereg") }}</p>
    </div>

    <!-- Form Section -->
    <div class="form-section">
      <div class="password-wrapper">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          :placeholder="$t('enterpass')"
        />
      </div>
      <button class="enter-btn" @click="submitForm">{{ $t("regbtn") }}</button>
    </div>
  </div>
</template>

<script>
import { Endpoint } from "../common/endpoint.js";
import axios from "axios";
import { Image } from "../common/image.js";

export default {
  data() {
    return {
      logo: "",
      password: "",
      showPassword: false,
      timer: 20, // Timer for resend button
    };
  },
  methods: {
    async logoupload() {
      try {
        // Use POST request to fetch the logo
        const response = await axios.post(`${Endpoint.logo}`, {
          // Add any required payload for the POST request
          // Example: { businessId: "123" }
        });

        // Log the response to debug
        console.log("API Response:", response.data);

        // The API returns a file path like "/public/uploads/business_logos/1744771693_new_logo.png"
        const imagePath = response.data;

        // Construct a proper URL for the browser
        const baseUrl = "https://erp.carserv.pro"; // Replace with your actual domain
        const imageUrl = `${baseUrl}${
          imagePath.startsWith("/") ? "" : "/"
        }${imagePath}`;

        console.error("path:", imageUrl);

        // Set the logo URL
        this.logo = imageUrl;
      } catch (error) {
        console.error("Error fetching logo:", error);
        this.logo = Image.logo; // Fallback to default logo
        //alert("Failed to load the logo. Using default logo instead.");
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async submitForm() {
      // Added 'async' keyword here
      if (!this.password) {
        alert("Please enter password");
        return;
      }

      try {
        const response = await axios.post(`${Endpoint.register}`, null, {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            password: this.password,
            mobile: this.phoneNumber,
          },
        });
        const data = response.data;

        if (response.status >= 200 && response.status < 300) {
          localStorage.setItem("authToken", data.token);
          this.$router.push("/choose-car");
        } else {
          alert("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again.");
      }
    },
  },
  mounted() {
    this.logoupload();
    this.phoneNumber = localStorage.getItem("phoneNumber") || "Number not set";
    localStorage.removeItem("authToken");
  },
};
</script>

<style scoped>
@import "../../public/css/style.css";
</style>
