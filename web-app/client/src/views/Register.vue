<template>
  <div class="container login-container">
    <div class="row justify-content-center">
      <div class="col-md-6 login-form-2">
        <h3>Sign Up</h3>
        <ValidationObserver ref="observer" v-slot="{ passes }">
          <b-form @submit.prevent="passes(onSubmit);" @reset="onReset">
            <div v-if="alert.message" :class="`text-center alert ${alert.type}`">{{alert.message}}</div>
            <ValidationProvider rules="required" name="Name" v-slot="{ valid, errors }">
              <b-form-group label="Name:" label-for="Name">
                <b-form-input
                  type="text"
                  v-model="form.name"
                  :state="errors[0] ? false : (valid ? true : null)"
                  placeholder="Enter Name"
                ></b-form-input>
                <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <ValidationProvider rules="required" name="Username" v-slot="{ valid, errors }">
              <b-form-group label="Username:" label-for="Username">
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
              <b-form-group label="Password:" label-for="password">
                <b-form-input
                  type="password"
                  v-model="form.password"
                  :state="errors[0] ? false : (valid ? true : null)"
                  placeholder="Enter password"
                ></b-form-input>
                <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <ValidationProvider
              rules="required|confirmed:password|min:6"
              name="Password confirmation"
              v-slot="{ valid, errors }"
            >
              <b-form-group label="Confirm Password:" label-for="repassword">
                <b-form-input
                  type="password"
                  v-model="form.repassword"
                  :state="errors[0] ? false : (valid ? true : null)"
                  placeholder="Confirm Password"
                ></b-form-input>
                <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>
            <hr />

            <button type="submit" class="col-6 btnSubmit">Create account</button>
            <b-button type="reset" variant="danger" class="ml-4 border-radius-20">Reset</b-button>
          </b-form>
        </ValidationObserver>
      </div>
    </div>
    <div class="row justify-content-center mt-2">
      <div class="col-md-6 row">
        <div class="col-6"></div>
        <div class="col-6">
          <router-link to="/login" tag="a" class="float-right">Sign In</router-link>
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
      form: { name, username: "", password: "", repassword: "" }
    };
  },
  computed: {
    ...mapState("account", ["status"]),
    ...mapState({
      alert: state => state.alert
    })
  },
  methods: {
    ...mapActions("account", ["register"]),
    onSubmit() {
      this.register(this.form);
    },
    onReset() {
      this.form.name = "";
      this.form.username = "";
      this.form.password = "";
      this.form.repassword = "";
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    }
  }
};
</script>
<style>
.border-radius-20 {
  border-radius: 20px;
}
</style>
