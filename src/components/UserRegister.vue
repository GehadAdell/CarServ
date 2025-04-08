<template>
  <div class="container">
    <!-- Logo Section -->
    <div class="mb-12">
      <img :src="logo" alt="Car Service Logo" class="h-24" />
    </div>

    <!-- SMS Code Section -->
    <div class="sms-section">
      <h3 style="text-align: center; margin-top: -90px">Enter Code</h3>
      <p>
        We sent SMS with an activation code to your phone
        <strong>{{ phoneNumber }}</strong>
      </p>
      <div class="code-inputs">
        <input
          v-for="(digit, index) in code"
          :key="index"
          v-model="code[index]"
          maxlength="1"
          @input="moveToNext(index, $event)"
        />
      </div>
    </div>

    <!-- Form Section -->
    <div class="form-section">
      <input type="text" v-model="fullName" placeholder="Full name" />
      <div class="password-wrapper">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Enter password"
        />
      </div>
      <button class="enter-btn" @click="submitForm">Enter</button>
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
      phoneNumber: "",
      code: ["", "", "", "", ""], // Array to store 4 digits of the SMS code
      fullName: "",
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
    moveToNext(index, event) {
      const input = event.target;
      if (input.value && index < this.code.length - 1) {
        this.$refs.codeInputs[index + 1].focus();
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    resendCode() {
      this.timer = 20;
      this.startTimer();
    },
    startTimer() {
      const interval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(interval);
        }
      }, 1000);
    },
    async submitForm() {
      // Added 'async' keyword here
      if (!this.fullName || !this.password) {
        alert("Please enter both full name and password");
        return;
      }

      const enteredCode = this.code.join("");
      const storedCode = localStorage.getItem("verificationCode");

      if (enteredCode === storedCode && enteredCode !== "") {
        try {
          const response = await axios.post(`${Endpoint.register}`, null, {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              name: this.fullName,
              password: this.password,
              mobile: this.phoneNumber,
              code: enteredCode,
            },
          });

          if (response.status >= 200 && response.status < 300) {
            this.$router.push("/login");
          } else {
            alert("Registration failed. Please try again.");
          }
        } catch (error) {
          console.error("Error during registration:", error);
          alert("An error occurred. Please try again.");
        }
      } else {
        alert("code is wrong");
        return;
      }
    },
  },
  mounted() {
    this.logoupload();
    this.phoneNumber = localStorage.getItem("phoneNumber") || "Number not set";
    this.startTimer();
  },
};
</script>

<style scoped>
@import "../../public/css/style.css";
</style>
