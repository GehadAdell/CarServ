<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-white px-6"
    style="color: white"
  >
    <!-- Logo Section -->
    <div class="container">
      <div class="mb-12">
        <img :src="logo" alt="Car Service Logo" class="h-24" />
      </div>
    </div>

    <!-- Tagline -->
    <p class="text-custom-brown font-bold text-xl mb-8 text-center">
      {{ $t("welcomeindex") }}
    </p>

    <!-- Slider Dots -->
    <div class="flex space-x-1.5 mb-12">
      <span
        v-for="dot in 5"
        :key="dot"
        class="h-1.5 w-1.5 rounded-full"
        :class="dot === 3 ? 'bg-black' : 'bg-custom-pink'"
      >
      </span>
    </div>

    <!-- Sign In Button -->
    <div class="button-container">
      <button
        @click="goToNextPage"
        class="bg-black text-white px-6 py-4 rounded-xl font-bold shadow-md w-full max-w-[17.5rem]"
      >
        {{ $t("buttonindex") }}
      </button>
    </div>

    <div class="button-container">
      <button @click="switchLang">{{ $t("switchlang") }}</button>
    </div>
  </div>
</template>

<script>
import { Image } from "../common/image.js";
import { Endpoint } from "../common/endpoint.js";
import axios from "axios";

export default {
  name: "LandingPage",
  data() {
    return {
      logo: "",
      phoneNumber: "",
    };
  },
  methods: {
    switchLang() {
      const newLocale = this.$i18n.locale === "en" ? "ar" : "en";
      this.$i18n.locale = newLocale;
      localStorage.setItem("locale", newLocale);
    },
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
    handleImageError() {
      // If the image fails to load, use the fallback
      this.logo = Image.logo;
      //console.warn("Image failed to load, using fallback logo.");
    },
    goToNextPage() {
      // Navigate to the next page
      this.$router.push("/check-phone");
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
