<template>
  <v-app dark>
    <v-main>
      <v-container class="my-5">
        <div
          class="d-flex justify-end align-center"
          v-if="routeName != 'index'"
        >
          <div class="mr-2">{{ userName }}</div>
          <div>
            <img
              src="https://img.icons8.com/parakeet/30/null/test-account.png"
            />
          </div>
        </div>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data: () => ({
    userName: "",
    routeName: "",
  }),

  methods: {
    getUserName() {
      this.userName = localStorage.getItem("userName");
    },
  },

  mounted() {
    this.getUserName();
    this.routeName = this.$route.name;
    if (!this.userName) {
      this.$router.push("/");
    }
  },

  watch: {
    $route(to, from) {
      this.getUserName();
      this.routeName = to.name;
    },
  },
};
</script>
