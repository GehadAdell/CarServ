<!-- App.vue -->
<template>
  <div id="app" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
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

/* Shared styles using logical properties */
h3,
.joborder_info,
.jobsheet,
.total,
.service-btn-select-car {
  text-align: start;
}

.timeh {
  text-align: center;
}

.swap {
  margin-inline-start: clamp(10px, 2vw, 20px);
}

.joborder-icon {
  margin-inline-start: clamp(50px, 15vw, 110px);
}

.spacebtn {
  margin-inline-end: 30px;
}

[dir="rtl"] {
  #app & button {
    text-align: center;
  }

  #app & select {
    text-align: right;
  }
  h3,
  .joborder_info,
  .jobsheet,
  .total,
  .service-btn-select-car {
    text-align: right;
  }
}

[dir="ltr"] {
  h3,
  .joborder_info,
  .jobsheet,
  .total,
  .service-btn-select-car {
    text-align: left;
  }
}

@media screen and (max-width: 480px) {
  [dir="rtl"] {
    text-align: right;
  }

  [dir="ltr"] {
    text-align: left;
  }
}
</style>
