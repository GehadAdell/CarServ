<template>
  <a v-if="isAuthenticated" @click="handleLogout" class="logout-btn"
    ><font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']"
  /></a>
</template>

<script>
import { EventBus } from "../eventBus"; // Adjust path
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fas);

export default {
  name: "UserLogout",
  components: {
    FontAwesomeIcon,
  },
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
