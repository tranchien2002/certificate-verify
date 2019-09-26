<template>
  <div>
    <!--::header part start::-->
    <header
      class="main_menu home_menu"
      :class="{ 'home_menu menu_fixed animated fadeInDown': scrolled }"
    >
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-12">
            <nav class="navbar navbar-expand-lg navbar-light">
              <a class="navbar-brand" href="#">
                <img id="logo-aa" src="img/AWACA_Logo_sun-02.png" alt="logo" />
              </a>
              <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="menu_icon">
                  <i class="fas fa-bars"></i>
                </span>
              </button>

              <div class="collapse navbar-collapse main-menu-item" id="navbarSupportedContent">
                <ul class="navbar-nav"></ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
    <!-- Header part end-->

    <!-- banner part start-->
    <section class="banner_part">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <div class="banner_text">
              <div class="banner_text_iner">
                <router-link to="/register" class="btn_2 banner_btn_1" tag="a">Sign Up</router-link>
                <router-link to="/login" class="btn_2 banner_btn_2" tag="a">Sign In</router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="banner_img d-none d-lg-block">
              <img src="img/banner_img.png" alt />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scrolled: false
    };
  },
  components: {},
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 50;
    }
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style>
#logo-aa {
  width: 160px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
  .fade-leave-to

  /* .fade-leave-active below version 2.1.8 */
 {
  opacity: 0;
}
</style>
