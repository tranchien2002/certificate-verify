<template>
  <div class="container login-container">
    <div class="row justify-content-center">
      <div class="col-md-6 login-form-2">
        <h3>Sign Up</h3>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group id="input-group-0" label-for="input-0" class>
            <b-form-input
              id="input-0"
              v-model="form.name"
              type="text"
              required
              placeholder="Name *"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-1" label-for="input-1" class>
            <b-form-input
              id="input-1"
              v-model="form.email"
              type="email"
              required
              placeholder="Email *"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="form.password"
              required
              placeholder="Password *"
              type="password"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label-for="input-3">
            <b-form-input
              id="input-3"
              v-model="form.repassword"
              required
              placeholder="Re Enter Password *"
              type="password"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4">
            <b-form-checkbox-group id="checkboxes-4">
              <div class="form-group"></div>
            </b-form-checkbox-group>
            <button type="submit" class="col-6 btnSubmit">Create account</button>
          </b-form-group>
        </b-form>
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
export default {
  name: "login",
  data() {
    return {
      form: { name, email: "", password: "", repassword: "" },
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
      this.form.repassword = "";
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>
