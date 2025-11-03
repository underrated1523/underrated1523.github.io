<script setup>
import { ref } from 'vue'

import TierList from './components/TierList.vue'
import AnimeSearch from './components/AnimeSearch.vue';
import LoginForm from './components/LoginForm.vue';
import SignupForm from './components/SignupForm.vue';

const selectedAnime = ref([]);
const isLoggedIn = ref(false);
const isLoginMode = ref(true);

function handleLoginSuccess() {
  isLoggedIn.value = true;
}

</script>

<template>
  <LoginForm v-if="!isLoggedIn && isLoginMode" 
  @login-success="handleLoginSuccess"
  @switch-mode="isLoginMode = false"/>

  <SignupForm v-else-if="!isLoggedIn && !isLoginMode" 
  @login-success="handleLoginSuccess" 
  @switch-mode="isLoginMode = true"/>

  <TierList v-else class="tierlist-container" />
</template>

<style>
.tierlist-container {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  text-align: left;
}
</style>