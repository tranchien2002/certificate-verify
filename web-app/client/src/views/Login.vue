<template>
  <div class="container login-container">
    <div class="row justify-content-center">
      <div class="col-md-6 login-form-2">
        <h3>Sign In</h3>
        <ValidationObserver ref="observer" v-slot="{ passes }">
          <b-form @submit="onSubmit" @reset="onReset">
            <div v-if="alert.message" :class="`text-center alert ${alert.type}`">{{alert.message}}</div>
            <ValidationProvider rules="required" name="Username" v-slot="{ valid, errors }">
              <b-form-group label-for="Username">
                <b-form-input
                  type="text"
                  v-model="form.username"
                  :state="errors[0] ? false : (valid ? true : null)"
                  placeholder="Username"
                ></b-form-input>
                <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>
            <ValidationProvider
              rules="required|min:6"
              name="Password"
              vid="password"
              v-slot="{ valid, errors }"
            >
              <b-form-group label-for="password">
                <b-form-input
                  type="password"
                  v-model="form.password"
                  :state="errors[0] ? false : (valid ? true : null)"
                  placeholder="Password"
                ></b-form-input>
                <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>
            <button type="submit" class="col-6 btnSubmit">Login</button>
          </b-form>
        </ValidationObserver>
      </div>
    </div>
    <div class="row justify-content-center mt-2">
      <div class="col-md-6 row">
        <div class="col-6"></div>
        <div class="col-6">
          <router-link
            to="/register"
            tag="a"
            class="float-right"
            :disabled="status.loggingIn"
          >Sign Up</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  name: "login",
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  computed: {
    ...mapState("account", ["status"]),
    ...mapState({
      alert: state => state.alert
    })
  },
  methods: {
    ...mapActions("account", ["login"]),
    onSubmit(e) {
      e.preventDefault();
      const { username, password } = this.form;
      if (username && password) {
        this.login({ username, password });
      }
    },
    onReset() {
      this.form.username = "";
      this.form.password = "";
    }
  }
};
</script>
