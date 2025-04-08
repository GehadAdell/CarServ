<template>
  <div class="booking-container-selectcar">
    <h2 style="margin-bottom: 10px">Booking Info</h2>
    <div>
      <div v-if="bookings.length > 0" class="joborder_info_div">
        <p v-for="booking in bookings" :key="booking.id" class="joborder_info">
          <span class="car-device" v-if="booking.job_sheet_no">
            job_sheet_no: {{ booking.job_sheet_no }}
          </span>

          <span class="car-device">
            Booking Status: {{ booking.booking_status }}
            <hr />
          </span>
        </p>
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
    };
  },
  methods: {
    async fetchjoborder() {
      try {
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
