<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-white px-6"
  >
    <!-- Form Container -->
    <div class="form-container">
      <!-- Title -->
      <h1 class="text-2xl font-bold mb-8 text-gray-800 uppercase">
        Add Your Car
      </h1>

      <!-- VIN Number Input with Button -->
      <div class="w-full max-w-[17.5rem] mb-4 relative">
        <input
          type="text"
          placeholder="VIN Number"
          v-model="car.vin"
          class="border border-gray-300 rounded-lg px-4 py-3 w-full text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
          maxlength="17"
        />
        <a
          href="#"
          @click.prevent="showVinModal = true"
          class="text-xs text-gray-500 underline"
          >Where can I find the VIN number?</a
        >
      </div>

      <!-- Rest of the form remains the same -->
      <div class="select-wrapper relative">
        <select
          v-model="car.brand"
          @change="fetchModels"
          class="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-[17.5rem] mb-4 text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
        >
          <option value="" disabled selected>Brand</option>
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">
            {{ brand.name }}
          </option>
        </select>
      </div>

      <div class="select-wrapper relative">
        <select
          v-model="car.model"
          class="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-[17.5rem] mb-4 text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
          :disabled="!car.brand"
        >
          <option value="" disabled selected>Model</option>
          <option v-for="model in models" :key="model.id" :value="model.id">
            {{ model.name }}
          </option>
        </select>
      </div>

      <div class="select-wrapper relative">
        <select
          v-model="car.years"
          class="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-[17.5rem] mb-4 text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
        >
          <option value="" disabled selected>Years</option>
          <option v-for="year in yearsList" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Color"
        v-model="car.color"
        class="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-[17.5rem] mb-4 text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
      />

      <input
        type="text"
        placeholder="Platnumber"
        v-model="car.platnumber"
        class="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-[17.5rem] mb-6 text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
      />

      <div class="select-wrapper relative">
        <select
          v-model="car.car_type"
          class="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-[17.5rem] mb-4 text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
        >
          <option value="" disabled selected>Car Type</option>
          <option value="ملاكي">ملاكي</option>
          <option value="أجرة">أجرة</option>
          <option value="نقل ثقيل">نقل ثقيل</option>
          <option value="نقل">نقل</option>
        </select>
      </div>

      <button
        @click="addCar"
        class="add-button bg-green-600 text-white px-6 py-4 rounded-xl font-bold shadow-md w-full max-w-[17.5rem] uppercase"
      >
        Add
      </button>
    </div>

    <!-- Modal for VIN Number Location -->
    <div
      v-if="showVinModal"
      class="modal-overlay"
      @click="showVinModal = false"
    >
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="showVinModal = false">
          &times;
        </button>
        <img :src="vinimage" alt="VIN Number Location" class="modal-image" />
      </div>
    </div>
  </div>
</template>

<script>
import { Endpoint } from "../common/endpoint.js";
import axios from "axios";
import { Image } from "../common/image.js";

export default {
  name: "AddCar",
  data() {
    return {
      vinimage: Image.vin,
      car: {
        vin: "",
        brand: "",
        model: "",
        years: "",
        color: "",
        platnumber: "",
        car_type: "",
      },
      brands: [],
      models: [],
      token: "",
      yearsList: [],
      showVinModal: false, // Add this to control the modal visibility
    };
  },
  mounted() {
    this.fetchBrands();
    this.generateYearsList();
  },
  watch: {
    "car.vin"(newVin) {
      if (newVin.length === 17) {
        this.lookupChassis();
      } else {
        this.car.brand = "";
        this.car.model = "";
        this.car.years = "";
      }
    },
  },
  methods: {
    // Your existing methods (fetchBrands, fetchModels, etc.) remain unchanged
    async fetchBrands() {
      try {
        this.token = localStorage.getItem("authToken") || "";
        const response = await axios.get(`${Endpoint.getBrands}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = response.data;
        this.brands = data;
      } catch (error) {
        console.error("Error fetching brands:", error);
        alert("Failed to load brands. Please try again.");
      }
    },

    async fetchModels() {
      if (!this.car.brand) {
        this.models = [];
        this.car.model = "";
        return;
      }

      try {
        const response = await axios.get(
          `${Endpoint.getModels}${this.car.brand}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const data = response.data;
        this.models = data;
      } catch (error) {
        console.error("Error fetching models:", error);
        alert("Failed to load models. Please try again.");
        this.models = [];
        this.car.model = "";
      }
    },

    async lookupChassis() {
      if (!this.car.vin || this.car.vin.length !== 17) {
        if (this.car.vin.length > 0) {
          alert("Please enter a valid 17-digit VIN number");
        }
        return;
      }

      try {
        const response = await fetch(`${Endpoint.lookupChassis}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            chassis_number: this.car.vin,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to lookup chassis");
        }

        const data = await response.json();
        if (data.success) {
          this.car.brand = data.data.brand_id;
          await this.fetchModels();
          this.car.model = data.data.model_id;
          this.car.years = data.data.year;
        }
      } catch (error) {
        console.error("Error looking up chassis:", error);
        alert("Failed to lookup VIN. Please try again.");
      }
    },

    generateYearsList() {
      const currentYear = new Date().getFullYear();
      for (let year = 1980; year <= currentYear; year++) {
        this.yearsList.push(year);
      }
    },

    async addCar() {
      if (
        !this.car.brand ||
        !this.car.model ||
        !this.car.years ||
        !this.car.color ||
        !this.car.car_type ||
        !this.car.platnumber
      ) {
        alert("Please fill in all required fields");
        return;
      }

      const params = {
        brand_id: this.car.brand,
        model_id: this.car.model,
        color: this.car.color,
        chassis_number: this.car.vin,
        plate_number: this.car.platnumber,
        manufacturing_year: this.car.years,
        car_type: this.car.car_type,
      };

      try {
        let apiUrl = `${Endpoint.addcar}`;

        const response = await axios.post(apiUrl, null, {
          params,
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = response.data;
        if (data.data === "Adding Car successfully") {
          console.log("Car added successfully:", data);
          localStorage.setItem("selectedCarId", "");
          localStorage.setItem("selectedCarModel", "");
          localStorage.setItem("selectedCarDevice", "");
          this.$router.push("/booking");
        } else {
          throw new Error("Unexpected response from server");
        }
      } catch (error) {
        console.error("Error adding car:", error);
        alert("Failed to add car. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
@import "../../public/css/style.css";
</style>
