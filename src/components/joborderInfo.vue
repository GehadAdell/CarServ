<template>
  <div class="booking-container-selectcar">
    <h2 style="margin-bottom: 10px">Your Job Sheet</h2>
    <div>
      <div v-if="joborders.length > 0" class="joborder_info_div">
        <a
          v-for="joborder in joborders"
          :key="joborder.id"
          @click="dataOfJobInfo(joborder.id)"
          class="joborder_info { selected: selectedJobOrder === joborder.id }"
        >
          <div class="plate" style="margin-left: 0px">
            <div class="top">
              <div class="left">EGYPT</div>
              <div class="right">مصر</div>
            </div>
            <div class="bottom">
              <div class="numbers" style="font-family: 'Cairo', sans-serif">
                <div>{{ getParts(joborder.plate_number)[0] }}</div>
              </div>
              <div class="separator"></div>
              <div class="letters" style="font-family: 'Cairo', sans-serif">
                <div>{{ getParts(joborder.plate_number)[1] }}</div>
              </div>
            </div>
          </div>
          <span class="car-device"
            >Job_sheet_no: {{ joborder.job_sheet_no }}</span
          >
          <span class="car-device"
            >Location: {{ joborder.location }}
            <hr
          /></span>
        </a>
      </div>
      <div v-else>
        <p>No job orders available.</p>
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
      joborders: [],
      selectedJobOrder: null,
      token: "",
    };
  },
  methods: {
    getParts(plateNumber) {
      const regex = /^([\p{L}\s]+)([\u0660-\u0669]+)$/u;
      const match = plateNumber.match(regex);
      console.log(plateNumber);
      return match ? [match[1], match[2]] : ["", ""];
    },
    dataOfJobInfo(JobId) {
      localStorage.setItem("jobId", JobId);
      console.log("jobid:", JobId);
      this.$router.push("/data/joborder");
    },
    async fetchjoborder() {
      try {
        this.token = localStorage.getItem("authToken");
        if (!this.token) {
          throw new Error("Authentication required. Please log in.");
        }

        const response = await fetch(`${Endpoint.joborder}`, {
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
        // Check if data is an array and assign it directly to joborders
        if (Array.isArray(data)) {
          // Add an id to each job order if it doesn't have one (for the :key in v-for)
          this.joborders = data.map((item, index) => ({
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
