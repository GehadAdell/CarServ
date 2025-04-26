<template>
  <div class="booking-container-selectcar">
    <h2 style="margin-bottom: 10px">{{ $t("bookingifonot") }}</h2>
    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ $t("loading") }}</p>
    </div>
    <div>
      <div v-if="bookings.length > 0" class="joborder_info_div">
        <a
          v-for="booking in bookings"
          :key="booking.id"
          class="joborder_info"
          @click="
            dataOfJobInfo(
              booking.booking_start,
              booking.service,
              booking.brand,
              booking.model,
              booking.plate_number,
              booking.location,
              booking.booking_note
            )
          "
        >
          <span class="car-device" v-if="booking.job_sheet_no">
            {{ $t("jobsheetno") }}: {{ booking.job_sheet_no }}
          </span>
          <span class="car-device">
            {{ $t("model") }}: {{ booking.model }}
          </span>
          <span class="car-device">
            {{ $t("brand") }}: {{ booking.brand }}
          </span>
          <span class="car-device">
            {{ $t("platenumber") }}: {{ booking.plate_number }}
          </span>
          <span class="car-device">
            {{ $t("Bookingstatus") }}: {{ booking.booking_status }}
            <hr />
          </span>
        </a>
      </div>

      <div v-else>
        <p>No bookings available.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Endpoint } from "../common/endpoint.js";

export default {
  name: "BookingForm",
  data() {
    return {
      name: "",
      bookings: [],
      token: "",
      isLoading: false,
    };
  },
  methods: {
    dataOfJobInfo(
      booking_start,
      service,
      brand,
      model,
      plate_number,
      location,
      booking_note
    ) {
      localStorage.setItem("Brand", brand);
      localStorage.setItem("Model", model);
      localStorage.setItem("Location", location);
      localStorage.setItem("Service", service);
      localStorage.setItem("Date", booking_start);
      localStorage.setItem("Note", booking_note);
      localStorage.setItem("plate_number", plate_number);
      localStorage.setItem("location_id", "");
      localStorage.setItem("device_id", "");
      localStorage.setItem("service_id", "");
      localStorage.setItem("isButtonDisabled", true);
      this.$router.push("/details/booking");
    },
    async fetchjoborder() {
      try {
        this.isLoading = true;
        this.token = localStorage.getItem("authToken");
        if (!this.token) {
          throw new Error("Authentication required. Please log in.");
        }

        const response = await fetch(`${Endpoint.notification}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch joborder: ${response.status}`);
        }

        const data = await response.json();
        // Check if data is an array and assign it directly to bookings
        if (Array.isArray(data)) {
          // Add an id to each job order if it doesn't have one (for the :key in v-for)
          this.bookings = data.map((item, index) => ({
            ...item,
            id: item.id || index, // Use index as a fallback if no id is provided
          }));
        } else {
          throw new Error("Expected an array of job orders");
        }
      } catch (error) {
        console.error("Error fetching job orders:", error);
        this.$emit("error", error.message || "Failed to load job orders");
      } finally {
        this.isLoading = false; // Reset loading state
      }
    },
  },
  mounted() {
    this.fetchjoborder();
  },
};
</script>

<style scoped>
@import "../../public/css/style.css";
</style>
