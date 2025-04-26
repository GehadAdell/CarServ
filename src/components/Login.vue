<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-white px-6"
  >
    <!-- Logo Section -->
    <div class="container">
      <div class="mb-12">
        <img :src="logo" alt="Car Service Logo" class="h-24" />
      </div>
    </div>

    <p>{{ $t("infolog", { name: name }) }}</p>

    <!-- Password Input -->
    <div class="password-container">
      <input
        type="password"
        :placeholder="$t('enterpass')"
        v-model="password"
        class="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-[17.5rem] mb-6 text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>

    <!-- Login Button -->
    <div class="button-container">
      <button
        @click="login"
        class="spacebtn bg-black text-white px-6 py-4 rounded-xl font-bold shadow-md w-full max-w-[17.5rem]"
      >
        {{ $t("loginbtn") }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Endpoint } from "../common/endpoint.js";
import { Image } from "../common/image.js";
import { EventBus } from "../eventBus";

export default {
  name: "LoginPage",
  data() {
    return {
      name: "",
      logo: "",
      phoneNumber: "",
      password: "",
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
    async login() {
      this.phoneNumber = localStorage.getItem("phoneNumber") || "";
      // Validate inputs
      if (!this.phoneNumber || !this.password) {
        alert("Please enter both phone number and password");
        return;
      }

      try {
        // Make API call to the login endpoint
        const response = await axios.post(
          `${Endpoint.login}`,
          {
            mobile: this.phoneNumber,
            password: this.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        // Check if the response contains a token
        if (data.token) {
          // Store the token (e.g., in localStorage or Vuex store for later use)
          localStorage.setItem("authToken", data.token);
          EventBus.$emit("auth-changed");

          // Navigate to the "AddCar" page after successful login
          this.$router.push("/choose-car");
        } else {
          // Handle login failure
          alert("Login failed: " + (data.message || "Invalid credentials"));
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred while logging in. Please try again.");
      }
    },
  },
  mounted() {
    this.logoupload();
    this.name = localStorage.getItem("name") || "";
    localStorage.removeItem("authToken");
  },
};
</script>

<style scoped>
@import "../../public/css/style.css";
</style>
