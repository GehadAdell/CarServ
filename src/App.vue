<!-- App.vue -->
<template>
  <div id="app">
    <nav>
      <Logout />
      <router-view />
    </nav>
  </div>
</template>

<script>
import Logout from "./components/logout.vue";

export default {
  components: {
    Logout,
  },
  computed: {
    showLogout() {
      const hiddenRoutes = ["/login", "/register", "/user/register", "/"];
      return !hiddenRoutes.includes(this.$route.path);
    },
  },
  watch: {
    $route() {
      // Needed to react to route changes
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-align: right;
  font-size: 20px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
