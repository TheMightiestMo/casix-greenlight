<script setup lang="ts">
import { RouterLink } from 'vue-router';
import PlacesComponent from '@/pages/places/PlacesComponent.vue'

</script>

<template>
  <header class="header">

    <RouterLink to="/" class="site-title">GreenLight</RouterLink>

    <nav class="navbar">
      <RouterLink to="/places">Places</RouterLink>
      <RouterLink to="/registration">Register</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 10%;
  background-color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;

}

.site-title {
  font-size: 32px;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.navbar a {
  position: relative;
  font-size: 18px;
  color: #fff;
  font-weight: 500;
  margin-left: 30px;
}

.navbar a::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 2px;
  background: #fff;
  transition: width 0.4s ease-in-out;
}

.navbar a:hover::before {
  width: 100%;
}

@media (max-width: 768px) {
  .header {
    /* Reduziert den seitlichen Abstand auf kleineren Bildschirmen */
    padding: 20px 20px;
  }

  .site-title {
    /* Verkleinert den Titel, damit er nicht so viel Platz einnimmt */
    font-size: 24px;
  }

  .navbar a {
    /* Verringert den Abstand zwischen den Menüpunkten */
    margin-left: 15px;
    font-size: 16px;
  }
}


</style>
