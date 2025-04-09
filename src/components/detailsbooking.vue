<template>
  <div class="form-container-details">
    <div class="form-card">
      <!-- Success Message -->
      <div v-if="bookingSuccess" class="booking-success-message">
        Booking Sent and it is request.
      </div>
      <!-- Header -->
      <div class="form-header">
        <h2>Booking Details</h2>
      </div>
      <!-- Form Body -->
      <div class="form-body">
        <div class="form-row">
          <span class="label">Date:</span>
          <span>{{ date }}</span>
        </div>
        <div class="form-row">
          <span class="label">Service:</span>
          <span>{{ service }}</span>
        </div>
        <div class="form-row">
          <span class="label">Brand:</span>
          <span>{{ brand }}</span>
        </div>
        <div class="form-row">
          <span class="label">Model:</span>
          <span>{{ model }}</span>
        </div>
        <div class="form-row">
          <span class="label">Plate Number:</span>
          <span>{{ plate_number }}</span>
        </div>
        <div class="form-row">
          <span class="label">Location:</span>
          <span>{{ location }}</span>
        </div>
        <div class="form-row">
          <span class="label">Note:</span>
          <span>{{ note }}</span>
        </div>
        <hr />
        <div class="form-row">
          <span class="label">Your Name:</span>
          <span>{{ name }}</span>
        </div>
        <div class="form-row">
          <span class="label">Phone Number:</span>
          <span>{{ phone }}</span>
        </div>
      </div>
      <!-- Footer with Button -->
      <div class="form-footer">
        <button @click="handleFinish" :disabled="isButtonDisabled">
          FINISH
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Endpoint } from "../common/endpoint.js";
import axios from "axios";

export default {
  name: "ServiceForm",
  data() {
    return {
      brand: "",
      model: "",
      location: "",
      service: "",
      date: "",
      note: "",
      name: "",
      phone: "",
      token: "",
      plate_number: "",
      location_id: "",
      device_id: "",
      service_id: "",
      bookingSuccess: false,
      isButtonDisabled: false,
    };
  },
  methods: {
    async handleFinish() {
      try {
        this.token = localStorage.getItem("authToken");
        const apiUrl = `${Endpoint.addBooking}`;

        const response = await axios.post(apiUrl, null, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            booking_start: this.date,
            location_id: this.location_id,
            booking_note: this.note,
            service_id: this.service_id,
            device_id: this.device_id,
          },
        });

        const data = response.data;
        console.log("Booking response:", data);

        this.bookingSuccess = true;
        this.isButtonDisabled = true;
        // Optionally handle navigation or show success message
      } catch (error) {
        console.error("Booking error:", error);
        this.bookingSuccess = false;
        this.isButtonDisabled = false;

        // Optionally show an error message to the user
        this.errorMessage =
          error.response?.data?.message || "Something went wrong!";
      }
    },
  },
  mounted() {
    this.brand = localStorage.getItem("Brand");
    this.model = localStorage.getItem("Model");
    this.location = localStorage.getItem("Location");
    this.service = localStorage.getItem("Service");
    this.date = localStorage.getItem("Date");
    this.note = localStorage.getItem("Note");
    this.phone = localStorage.getItem("phoneNumber");
    this.name = localStorage.getItem("name");
    this.location_id = localStorage.getItem("location_id");
    this.device_id = localStorage.getItem("device_id");
    this.service_id = localStorage.getItem("service_id");
    this.plate_number = localStorage.getItem("plate_number");
  },
};
</script>

<style scoped>
.form-container-details {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.form-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-header {
  background-color: #16a34a;
  color: white;
  padding: 1rem;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.form-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.form-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.form-row .label {
  font-weight: 500;
}

.form-footer {
  padding: 1rem;
}

.form-footer button {
  width: 100%;
  background-color: #16a34a;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.form-footer button:hover:not(:disabled) {
  /* Only apply hover when not disabled */
  background-color: rgb(16, 117, 53);
}

.form-footer button:disabled {
  /* Style for disabled state */
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
}

hr {
  border: none;
  height: 1px;
  background-color: #d1d5db;
  margin: 0.5rem 0;
}
</style>
