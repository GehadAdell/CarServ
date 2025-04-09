<template>
  <div class="booking-container-selectcar">
    <h2 style="margin-bottom: 10px">Choose Car to Add Booking</h2>
    <div class="service-buttons-container">
      <div v-if="cars.length > 0" class="service-buttons-select-car">
        <button
          v-for="car in cars"
          :key="car.id"
          class="service-btn-select-car"
          :class="{ selected: selectedService === car.id }"
          @click="selectService(car.id)"
        >
          <span class="car-device">Brand: {{ car.device }}</span>
          <span class="car-model">Model: {{ car.model }}</span>
          <span class="car-color">Color: {{ car.color }}</span>
          <div class="plate">
            <div class="top">
              <div class="left">EGYPT</div>
              <div class="right">مصر</div>
            </div>
            <div class="bottom">
              <div class="numbers" style="font-family: 'Cairo', sans-serif">
                <div>{{ getParts(car.plate_number)[0] }}</div>
              </div>
              <div class="separator"></div>
              <div class="letters" style="font-family: 'Cairo', sans-serif">
                <div>{{ getParts(car.plate_number)[1] }}</div>
              </div>
            </div>
          </div>
          <!-- <span class="plate_number">Plate Number: {{ car.plate_number }}</span> -->
        </button>
        <button class="addcarbtn" @click="addcar">Add Car</button>
      </div>
      <div v-else class="service-buttons-select-car">
        <button class="addcarbtn" @click="addcar">Add Car</button>
      </div>
    </div>

    <!-- <button
      class="submit-btn"
      @click="submitBooking"
      :disabled="!selectedService"
    >
      Confirm
    </button>
    <button class="submit-btn" style="margin-top: 5px" @click="addcar">
      Add Car
    </button> -->
  </div>
</template>

<script>
import { Endpoint } from "../common/endpoint.js";

export default {
  name: "BookingForm",
  data() {
    return {
      name: "",
      selectedService: null,
      cars: [],
      token: "",
    };
  },
  methods: {
    getParts(plateNumber) {
      const regex = /^([\p{L}\s]+)([\u0660-\u0669]+)$/u;
      const match = plateNumber.match(regex);
      console.log("Match result:", match);
      return match ? [match[2], match[1]] : ["", ""];
    },
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
        localStorage.setItem("customerId", data.data.id);
        this.cars = Array.isArray(data) ? data : data.data?.cars || [];
      } catch (error) {
        console.error("Error fetching cars:", error);
        this.$emit("error", error.message || "Failed to load cars");
      }
    },
    selectService(carId) {
      localStorage.setItem("carid", carId);
      this.selectedService = carId;
      const selectedCar = this.cars.find(
        (car) => car.id === this.selectedService
      );
      if (selectedCar) {
        // Store car ID and model in localStorage
        localStorage.setItem("selectedCarId", selectedCar.id);
        localStorage.setItem("selectedCarModel", selectedCar.model);
        localStorage.setItem("selectedCarDevice", selectedCar.device);
        localStorage.setItem("plate_number", selectedCar.plate_number);

        // Redirect to /booking route
        this.$router.push("/booking");
      }
    },
    addcar() {
      this.$router.push("/add-car");
    },
  },
  mounted() {
    this.fetchCars();
  },
};
</script>

<style scoped>
@import "../../public/css/style.css";
</style>
