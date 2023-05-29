<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <img src="@/components/icons/bluetext.png" id="log">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation" @click="toggleMobileMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" :class="{ 'show': isMobileMenuOpen }" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <RouterLink to="/" class="nav-link" @click="closeMobileMenu">Home</RouterLink>
          <RouterLink to="/account" class="nav-link" @click="closeMobileMenu">Account</RouterLink>
        </div>
      </div>
    </div>
  </nav>
<div v-cloak>
  <RouterView/>
</div>


</template>

<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
  components: {
    RouterLink,
    RouterView
  },
  data() {
    return {
      isMobileMenuOpen: false
    };
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    handleResize() {
      if (window.innerWidth > 777) {
        this.closeMobileMenu();
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>

<style>
@import url('/public/font.css');

[v-cloak] {
  display: none;
}

#log {
  width: 150px;
  height: auto;
  margin: 20px;
}

#center {
  margin: 20px;
}

.navbar-nav a{
    font-family: 'Inter-ExtraBold';
    text-decoration: none;
    color: black;
}

.navbar-nav a:hover{
  color:#13386b
}

.navbar-nav a:active{
  color:#13386b
}

@media (max-width: 777px) {
  .navbar-nav a{
    margin-left: 4%;
  }
}
</style>
