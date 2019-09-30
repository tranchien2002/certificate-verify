<template>
  <div class="container login-container">
    <div class="row justify-content-center">
      <div class="col-md-6 login-form-2">
        <h3>Sign In</h3>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group id="input-group-1" label-for="input-1" class>
            <b-form-input
              id="input-1"
              v-model="form.email"
              type="email"
              required
              placeholder="Your Email *"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-2" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="form.password"
              required
              placeholder="Your Password *"
              type="password"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-4">
            <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
              <div class="form-group">
                <b-form-checkbox value="me" class="col-6">Remember me</b-form-checkbox>
              </div>
            </b-form-checkbox-group>
            <button type="submit" class="col-6 btnSubmit">Login</button>
          </b-form-group>
        </b-form>
      </div>
    </div>
    <div class="row justify-content-center mt-2">
      <div class="col-md-6 row">
        <div class="col-6">
          <a href="#" class="ForgetPwd" value="Login">Forget Password?</a>
        </div>
        <div class="col-6">
          <router-link to="/register" tag="a" class="float-right">Sign Up</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      form: {
        email: "",
        password: "",
        checked: []
      },
      show: true
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      console.log(JSON.stringify(this.form));
    },
    onReset(evt) {
      evt.preventDefault();
      this.form.email = "";
      this.form.password = "";
      this.form.checked = [];
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>
