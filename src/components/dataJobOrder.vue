<template>
  <div class="jobsheet-container-info">
    <h2 style="margin-bottom: 10px">job sheet info</h2>
    <div>
      <div v-if="datajoborders.length > 0" class="joborder_info_div">
        <div v-for="joborder in datajoborders" :key="joborder.id">
          <div class="info-container-jobsheet">
            <div class="info">
              <p class="jobsheet" style="width: 500px">
                <span class="car-device">name: {{ name }}</span>
                <span class="car-device">model: {{ joborder.model }}</span>
                <span class="car-device">brand: {{ joborder.brand }}</span>
                <span class="car-device">color: {{ joborder.color }}</span>
                <span class="car-device">service: {{ joborder.service }}</span>
              </p>
            </div>
            <div class="plate_jobsheet">
              <div class="top_jobsheet">
                <div class="left_jobsheet">EGYPT</div>
                <div class="right_jobsheet">مصر</div>
              </div>
              <div class="bottom_jobsheet">
                <div
                  class="numbers_jobsheet"
                  style="font-family: 'Cairo', sans-serif"
                >
                  <div>{{ getParts(joborder.plate_number)[0] }}</div>
                </div>
                <div class="separator_jobsheet"></div>
                <div
                  class="letters_jobsheet"
                  style="font-family: 'Cairo', sans-serif"
                >
                  <div>{{ getParts(joborder.plate_number)[1] }}</div>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
      <div v-else>
        <p>No job orders available.</p>
      </div>
      <div class="progress-container">
        <div v-if="statuses.length > 0">
          <div v-for="status in statuses" :key="status.id">
            <span class="progress-step">{{ status.name }}</span>
            <div :class="status_id === status.id ? 'step completed' : 'step'">
              <span class="icon">
                <font-awesome-icon
                  :icon="
                    status_id === status.id
                      ? ['fas', 'check']
                      : ['fas', 'hourglass-half']
                  "
                />
              </span>
            </div>
          </div>
        </div>
        <div v-else class="no-cars">
          <h2>No status Found</h2>
        </div>
      </div>
      <hr />
      <div class="title-job">
        <h3>طلب موافقه العميل علي قطع الغيار</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>اسم القطعة</th>
            <th>السعر</th>
            <th>الكمية</th>
            <th>اختيار</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="dataproducts.length > 0">
            <tr v-for="product in dataproducts" :key="product.id">
              <td>{{ product.name }}</td>
              <td class="price">{{ product.price }}</td>
              <td class="quantity">{{ product.quantity }}</td>
              <td>
                <input
                  type="checkbox"
                  class="part-checkbox"
                  :name="`product_ids[${product.product_id}]`"
                  id="approval_status"
                  value="1"
                  :checked="product.client_approval == 1"
                  :disabled="product.client_approval == 1"
                  @change="updateHiddenInput(product.id, $event)"
                />
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="4" style="text-align: center">
              No products available.
            </td>
          </tr>
        </tbody>
      </table>

      <div class="button-container-accept">
        <button @click="saveProduct" :disabled="isLoading" class="accept">
          {{ isLoading ? "جاري الحفظ..." : "الموافقه" }}
        </button>
      </div>
      <hr />

      <div class="total">
        العدد الكلي: <span>{{ totalCount }}</span>
        <div>
          السعر الكلي: <span>{{ totalPrice }}</span> EGP
        </div>
      </div>
      <hr />
      <div class="title-job">
        <h3 id="finish">وقت انتهاء العمل</h3>
      </div>
      <div class="countdown-container">
        <div class="countdown-box">
          <span id="days">00</span>
          يوم
        </div>
        <div class="countdown-box">
          <span id="hours">00</span>
          ساعة
        </div>
        <div class="countdown-box">
          <span id="minutes">00</span>
          دقيقة
        </div>
        <div class="countdown-box">
          <span id="seconds">00</span>
          ثانية
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Endpoint } from "../common/endpoint.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";

library.add(fas);

export default {
  data() {
    return {
      name: "",
      jobId: "",
      statuses: [],
      datajoborders: [],
      dataproducts: [],
      status_id: "",
      selectedJobOrder: null,
      token: "",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      countdownInterval: null,
      selectedProductIds: [],
      totalCount: 0,
      totalPrice: 0,
      isLoading: false,
    };
  },
  methods: {
    async saveProduct() {
      if (this.selectedProductIds.length === 0) {
        this.$emit("error", "Please select at least one product to save.");
        return;
      }

      try {
        this.isLoading = true;
        this.token = localStorage.getItem("authToken");
        console.log("Auth Token:", this.token);
        if (!this.token) throw new Error("Authentication token not found.");

        const params = {
          job_order_id: this.jobId,
          product_ids: this.selectedProductIds,
        };

        console.log("Sending GET request with params:", params);

        const apiUrl = `${Endpoint.saveProduct}`;
        const response = await axios.get(apiUrl, {
          params,
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        console.log("Response:", response.data);

        this.$emit("success", "Products saved successfully!");
        this.selectedProductIds = []; // Reset selected products
        this.updateTotal(); // Update totals

        // Refresh data without navigating
        await this.fetchdatajoborder();
      } catch (error) {
        console.error("Error saving product:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to save selected products";
        this.$emit("error", errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    getParts(plateNumber) {
      const regex = /^([\p{L}\s]+)([\u0660-\u0669]+)$/u;
      const match = plateNumber.match(regex);
      return match ? [match[1], match[2]] : ["", ""];
    },

    async productname(orderid) {
      try {
        this.token = localStorage.getItem("authToken");
        const response = await fetch(`${Endpoint.productName}${orderid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        if (!response.ok)
          throw new Error(`Failed to fetch product: ${response.status}`);
        const data = await response.json();
        return data.name; // Return the name directly
      } catch (error) {
        console.error("Error fetching product:", error);
        this.$emit("error", error.message || "Failed to load product");
        return "Unknown Product"; // Fallback value
      }
    },

    async fetchdatajoborder() {
      try {
        this.token = localStorage.getItem("authToken");
        this.jobId = localStorage.getItem("jobId");
        this.name = localStorage.getItem("name");
        if (!this.token)
          throw new Error("Authentication required. Please log in.");

        const response = await fetch(`${Endpoint.datajoborder}${this.jobId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        if (!response.ok)
          throw new Error(`Failed to fetch joborder: ${response.status}`);

        const data = await response.json();
        this.status_id = data.status_id;
        this.datajoborders = [data.dataofcar];
        this.dataproducts = data.job_order; // Initial product data
        this.days = data.days;
        this.hours = data.hours;
        this.minutes = data.minutes;
        this.seconds = data.seconds;
        localStorage.setItem("status_id", data.status_id);

        // Fetch product names for all products and add them to dataproducts
        await Promise.all(
          this.dataproducts.map(async (product) => {
            const productName = await this.productname(product.product_id);
            product.name = productName; // Add the name to the product object
          })
        );

        this.updateTotal();
        this.startCountdown();
      } catch (error) {
        console.error("Error fetching job orders:", error);
        this.$emit("error", error.message || "Failed to load job orders");
      }
    },

    async status() {
      this.token = localStorage.getItem("authToken");
      const response = await fetch(`${Endpoint.status}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await response.json();
      this.statuses = data.status;
    },

    updateTotal() {
      let totalCount = 0;
      let totalPrice = 0;

      this.dataproducts.forEach((product) => {
        if (
          this.selectedProductIds.includes(String(product.product_id)) ||
          product.client_approval === 1
        ) {
          const price = parseFloat(product.price) || 0;
          const quantity = parseInt(product.quantity) || 0;
          totalCount += quantity;
          totalPrice += price * quantity;
        }
      });

      this.totalCount = totalCount;
      this.totalPrice = totalPrice.toFixed(2);
    },

    updateHiddenInput(productId, event) {
      const product = this.dataproducts.find((p) => p.id === productId);
      if (!product) return;

      const productIdStr = String(product.product_id);

      if (event.target.checked) {
        if (!this.selectedProductIds.includes(productIdStr)) {
          this.selectedProductIds.push(productIdStr);
        }
      } else {
        this.selectedProductIds = this.selectedProductIds.filter(
          (id) => id !== productIdStr
        );
      }
      this.updateTotal();
    },

    startCountdown() {
      if (this.countdownInterval) clearInterval(this.countdownInterval);
      this.countdownInterval = setInterval(() => {
        if (
          this.days === 0 &&
          this.hours === 0 &&
          this.minutes === 0 &&
          this.seconds === 0
        ) {
          document.getElementById("finish").innerText = "تم انتهاء العمل";
          clearInterval(this.countdownInterval);
          return;
        }
        document.getElementById("days").innerText = String(this.days).padStart(
          2,
          "0"
        );
        document.getElementById("hours").innerText = String(
          this.hours
        ).padStart(2, "0");
        document.getElementById("minutes").innerText = String(
          this.minutes
        ).padStart(2, "0");
        document.getElementById("seconds").innerText = String(
          this.seconds
        ).padStart(2, "0");

        if (this.seconds > 0) this.seconds--;
        else if (this.minutes > 0) {
          this.minutes--;
          this.seconds = 59;
        } else if (this.hours > 0) {
          this.hours--;
          this.minutes = 59;
          this.seconds = 59;
        } else if (this.days > 0) {
          this.days--;
          this.hours = 23;
          this.minutes = 59;
          this.seconds = 59;
        }
      }, 1000);
    },
  },
  mounted() {
    this.fetchdatajoborder();
    this.status();
    this.startCountdown();
  },
  beforeDestroy() {
    clearInterval(this.countdownInterval);
  },
  components: {
    FontAwesomeIcon,
  },
};
</script>

<style scoped>
@import "../../public/css/datajoborder.css";
</style>
