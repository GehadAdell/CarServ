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

    <!-- Phone Number Input -->
    <div class="phone-container">
      <input
        type="text"
        :placeholder="$t('placecheck')"
        v-model="phoneNumber"
        class="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-[17.5rem] mb-6 text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>

    <!-- Check Button -->
    <div class="button-container">
      <button
        @click="goToNextPage"
        style="margin-left: -30px"
        class="bg-black text-white px-6 py-4 rounded-xl font-bold shadow-md w-full max-w-[17.5rem]"
      >
        {{ $t("checkbutton") }}
      </button>
    </div>
  </div>
</template>

<script>
import { Endpoint } from "../common/endpoint.js";
import { Image } from "../common/image.js";
import axios from "axios";

export default {
  name: "PhoneCheckPage",
  data() {
    return {
      logo: "",
      phoneNumber: "",
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
    async goToNextPage() {
      console.log("baseurl", Endpoint.baseurl);

      // Validate phone number (basic check)
      if (!this.phoneNumber) {
        alert("Please enter a phone number");
        return;
      }

      localStorage.setItem("phoneNumber", this.phoneNumber);

      try {
        // Make API call to check phone number
        const response = await axios.get(
          `${Endpoint.check_phone}${this.phoneNumber}`
        );

        const data = response.data;

        // Check the response
        if (data.data && data.data.result === "user found") {
          localStorage.setItem("name", data.data.name);
          this.$router.push("/login");
        } else if (data.data && data.data.result === "mobile number found") {
          this.$router.push("/user/register");
        } else {
          localStorage.setItem("verificationCode", data.data.code);
          this.$router.push("/register");
        }
      } catch (error) {
        console.error("Error checking phone number:", error);
        alert("An error occurred. Please try again.");
      }
    },
  },
  mounted() {
    this.logoupload();
  },
};
</script>

<style scoped>
@import "../../public/css/style.css";
</style>
