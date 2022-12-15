<template>
  <div>
    <div class="d-flex my-5">
      <v-btn @click="isPlayerTag = true">Player</v-btn>
      <v-btn @click="isPlayerTag = false">Team</v-btn>
      <v-spacer />
      <v-btn @click="Logout()">Logout</v-btn>
    </div>
    <Player v-show="isPlayerTag" />
    <Team v-show="!isPlayerTag" />
  </div>
</template>

<script>
export default {
  data: () => ({
    isPlayerTag: true,
  }),

  methods: {
    Logout() {
      this.$store.commit("logout");
    },
  },

  created() {
    this.$store.commit("initialStore");
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
