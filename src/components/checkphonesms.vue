<!-- CheckPhoneSMS.vue -->
<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-white px-6"
  >
    <!-- Logo Section -->
    <div class="container">
      <div class="mb-12">
        <img :src="logo" alt="Car Service Logo" class="h-24" />
      </div>
    </div>
    <p>{{ $t("lastdigit") }}</p>
    <!-- Phone Number Input -->
    <div class="phone-container">
      <input
        type="text"
        :placeholder="$t('last')"
        v-model="phoneNumber"
        class="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-[17.5rem] mb-6 text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>

    <!-- Check Button -->
    <div class="button-container">
      <button
        @click="goToNextPage"
        class="bg-black text-white px-6 py-4 rounded-xl font-bold shadow-md w-full max-w-[17.5rem]"
      >
        {{ $t("checkbutton") }}
      </button>
    </div>
  </div>
</template>

<script>
import { Endpoint } from "../common/endpoint.js";
import { Image } from "../common/image.js";
import axios from "axios";

export default {
  name: "CheckPhoneSMS",
  data() {
    return {
      logo: "",
      phoneNumber: "",
      id: "",
    };
  },
  computed: {
    routeId() {
      return this.$route.params.id; // Access id from route params
    },
  },
  methods: {
    async logoupload() {
      try {
        const payload = this.id ? { id: this.id } : {};
        const response = await axios.post(Endpoint.logo, payload);

        // Construct image URL
        const imagePath = response.data;
        const baseUrl = "https://erp.carserv.pro";
        const imageUrl = `${baseUrl}${
          imagePath.startsWith("/") ? "" : "/"
        }${imagePath}`;

        this.logo = imageUrl;
      } catch (error) {
        console.error("Error fetching logo:", error);
        this.logo = Image.logo; // Fallback to default logo
      }
    },
    async goToNextPage() {
      if (!this.phoneNumber) {
        alert(this.$t("phoneNumberRequired")); // Use i18n for error message
        return;
      }

      try {
        const params = {
          id: this.id,
          phone: this.phoneNumber,
        };
        const apiUrl = Endpoint.smsjobsheet;
        const response = await axios.get(apiUrl, { params });

        const data = response.data;

        if (data.success) {
          localStorage.setItem("authcheck", true);
          localStorage.setItem("jobIdCheck", this.id);
          localStorage.setItem("name", data.dataofcar.name);
          localStorage.setItem("phone", this.phoneNumber);
          this.$router.push("/data/job/order");
        } else {
          alert(data.error || "No matching phone number");
        }
      } catch (error) {
        console.error("Error checking phone number:", error);
        alert(error.response?.data?.error || this.$t("errorOccurred"));
      }
    },
  },
  mounted() {
    this.id = this.routeId; // Set id when component mounts
    this.logoupload();
  },
};
</script>

<style scoped>
@import "../../public/css/style.css";
</style>
