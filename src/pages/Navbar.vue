<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
  <header class="header">
    <RouterLink to="/" class="site-title">GreenLight</RouterLink>
    <nav class="navbar">
      <RouterLink to="/places">Places</RouterLink>
      <RouterLink to="/tokens">Tokens</RouterLink>
    </nav>
  </header>
</template>

<style scoped>

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;

}

.navbar {
  margin-right: 50px;
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
  font-weight: 600;
  margin-right: 15px;
  text-decoration: none;
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


  .header {
padding: 20px 20px;
  }


  .navbar a {
    margin-left: 10px;
    font-size: 20px;

}


</style>
