<!-- components/logout.vue -->
<template>
  <a v-if="isAuthenticated" @click="handleLogout" class="logout-btn">Logout</a>
</template>

<script>
import { EventBus } from "../eventBus"; // Adjust path

export default {
  name: "UserLogout",
  data() {
    return {
      authToken: localStorage.getItem("authToken"),
    };
  },
  computed: {
    isAuthenticated() {
      return !!this.authToken;
    },
  },
  methods: {
    handleLogout() {
      localStorage.removeItem("authToken");
      localStorage.clear();
      this.authToken = null;
      EventBus.$emit("auth-changed"); // Emit event
      this.$router.push("/");
    },
    updateAuth() {
      this.authToken = localStorage.getItem("authToken");
    },
  },
  created() {
    EventBus.$on("auth-changed", this.updateAuth);
  },
  beforeDestroy() {
    EventBus.$off("auth-changed", this.updateAuth);
  },
};
</script>
