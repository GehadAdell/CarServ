<template>
  <div class="booking-container">
    <!-- <font-awesome-icon icon="coffee" /> -->
    <!-- Success Message -->
    <div v-if="bookingSuccess" class="booking-success-message">
      Booking Sent and it is waiting.
    </div>

    <!-- Greeting -->
    <header class="header">
      <div class="header-content">
        <div class="greeting-section">
          <h2>HI, {{ name }}</h2>
          <a @click="moveToJoborder" style="font-size: 15px">
            <font-awesome-icon :icon="['fass', 'key']" class="joborder-icon" />
          </a>
          <a @click="moveToNotification" style="font-size: 15px">
            <font-awesome-icon
              :icon="['fasr', 'bell']"
              class="notification-icon"
            />
          </a>
        </div>
        <div class="info-container">
          <p class="datacar">Selected Car: {{ brand }} {{ model }}</p>
          <a @click="moveToNextCar" style="font-size: 15px">
            <font-awesome-icon :icon="['fas', 'right-left']" class="swap" />
          </a>
        </div>
      </div>
    </header>

    <!-- Branch Selection -->
    <div class="select-wrapper relative">
      <select
        v-model="car.branch"
        style="margin-top: -25px"
        class="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-[17.5rem] mb-4 text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
        @change="onBranchChange"
      >
        <option value="" disabled selected>Select Branch</option>
        <option v-for="branch in branchs" :key="branch.id" :value="branch.id">
          {{ branch.name }}
        </option>
      </select>
    </div>

    <!-- Service Selection -->
    <h3>Choose Service</h3>
    <div class="service-buttons-container">
      <div class="service-buttons">
        <button
          v-for="service in services"
          :key="service.id"
          class="service-btn"
          :class="{ selected: selectedService === service.id }"
          @click="selectService(service.id)"
        >
          {{ service.name }}
        </button>
      </div>
    </div>

    <!-- Date and Time Picker -->
    <h3>Pick date and time</h3>
    <div class="form-group">
      <div class="date-inputs">
        <input
          type="datetime-local"
          v-model="startDateTime"
          class="date-input"
          @change="updateFormattedStartDate"
        />
      </div>
    </div>

    <!-- Problem Description -->
    <div class="form-group">
      <textarea
        v-model="problemDescription"
        placeholder="Tell us what is your problem"
        class="problem-input"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <button class="submit-btn" @click="submitBooking">
      Send Booking Request
    </button>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Endpoint } from "../common/endpoint.js";
import axios from "axios";
library.add(fas);

export default {
  name: "BookingForm",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      car: {
        branch: "",
      },
      currentCarIndex: "",
      model: "",
      name: "",
      cars: [],
      brand: "",
      carid: "",
      startDateTime: new Date().toISOString().slice(0, 16), // Includes date and time
      formattedStartDate: "",
      services: [],
      info: [],
      selectedService: null,
      branchs: [],
      token: "",
      problemDescription: "",
      bookingSuccess: false, // Add this line to manage success state
    };
  },
  methods: {
    async fetchCars() {
      try {
        this.token = localStorage.getItem("authToken");
        if (!this.token) {
          throw new Error("Authentication required. Please log in.");
        }

        const response = await fetch(`${Endpoint.getInfoCustomer}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch cars: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("name", data.data.name);
        this.cars = Array.isArray(data) ? data : data.data?.cars || [];
        this.updateCarDetails();
      } catch (error) {
        console.error("Error fetching cars:", error);
        this.$emit("error", error.message || "Failed to load cars");
      }
    },
    updateCarDetails() {
      if (this.cars.length > 0) {
        const car = this.cars[this.currentCarIndex];
        this.brand = car.device;
        this.model = car.model;
      }
    },
    moveToNextCar() {
      if (this.cars.length > 0) {
        this.currentCarIndex = (this.currentCarIndex + 1) % this.cars.length; // Move to the next car (circular)
        this.updateCarDetails(); // Update the selected car's details
      }
    },
    async fetchBranchs() {
      try {
        this.token = localStorage.getItem("authToken") || "";
        if (!this.token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`${Endpoint.branches}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = response.data;

        this.branchs = Array.isArray(data) ? data : data.data || [];
      } catch (error) {
        console.error("Error fetching branches:", error);
        alert("Failed to load branches. Please try again.");
      }
    },
    updateFormattedStartDate() {
      const date = new Date(this.startDateTime);
      // Format to include date, hour, and minute
      this.formattedStartDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    },
    async fetchInfo() {
      try {
        this.token = localStorage.getItem("authToken") || "";
        const response = await axios.get(`${Endpoint.infoCar}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        this.info = data;
      } catch (error) {
        console.error("Error fetching info:", error);
      }
    },
    async fetchServices() {
      try {
        this.token = localStorage.getItem("authToken") || "";
        const response = await axios.get(`${Endpoint.services}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        });
        const data = response.data;

        this.services = Array.isArray(data) ? data : data.data || [];
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },
    selectService(serviceId) {
      this.selectedService = serviceId;
    },
    onBranchChange() {
      console.log("Selected branch:", this.car.branch);
    },
    async submitBooking() {
      try {
        // Use the full ISO string (date and time) from startDateTime
        const fullDateTime = this.startDateTime; // e.g., "2025-03-25T14:30"
        const apiUrl = `${Endpoint.addBooking}`;

        const response = await axios.post(apiUrl, null, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            booking_start: fullDateTime,
            location_id: this.car.branch,
            booking_note: this.problemDescription,
            service_id: this.selectedService,
            device_id: this.carid,
          },
        });

        const data = response.data;
        console.log("Booking response:", data);

        // Set booking success state to true
        this.bookingSuccess = true;

        // Reset form
        this.car.branch = "";
        this.selectedService = null;
        this.problemDescription = "";
        this.startDateTime = new Date().toISOString().slice(0, 16);
        this.updateFormattedStartDate();
      } catch (error) {
        console.error("Error submitting booking:", error);
        alert("Failed to submit booking. Please try again.");
      }
    },
    moveToJoborder() {
      // Navigate to the next page
      this.$router.push("/joborder");
    },
    moveToNotification() {
      // Navigate to the next page
      this.$router.push("/notification");
    },
  },
  mounted() {
    this.fetchCars();
    this.currentCarIndex = localStorage.getItem("carid") || 0;
    this.model = localStorage.getItem("selectedCarModel") || "";
    this.brand = localStorage.getItem("selectedCarDevice") || "";
    this.name = localStorage.getItem("name") || "";
    this.carid = localStorage.getItem("selectedCarId") || "";

    this.fetchBranchs();
    this.fetchServices();
    this.fetchInfo().then(() => {
      if (this.info && Object.keys(this.info).length > 0) {
        this.model =
          this.model === "" ? this.info.model || "Model not set" : this.model;
        this.brand =
          this.brand === "" ? this.info.device || "Device not set" : this.brand;
        this.carid =
          this.carid === "" ? this.info.id || "ID not set" : this.carid;
      }
    });
    this.updateFormattedStartDate();
  },
};
</script>

<style scoped>
@import "../../public/css/style.css";
</style>
