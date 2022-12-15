<template>
  <div class="my-12">
    <h2 class="my-10 d-flex justify-center">Login</h2>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <validation-provider
          v-slot="{ errors }"
          name="userName"
          rules="required"
        >
          <v-text-field
            v-model="userName"
            :error-messages="errors"
            label="User Name"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="password"
          rules="required"
        >
          <v-text-field
            v-model="password"
            :error-messages="errors"
            label="Password"
            type="password"
            required
          ></v-text-field>
        </validation-provider>

        <v-btn class="mr-4" type="submit" :disabled="invalid"> submit </v-btn>
        <v-btn @click="clear"> clear </v-btn>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { required } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    userName: "",
    password: "",
  }),

  methods: {
    submit() {
      this.$refs.observer.validate();

      this.$store.commit("login", this.userName);
    },
    clear() {
      this.userName = "";
      this.password = "";
      this.$refs.observer.reset();
    },
  },
};
</script>
