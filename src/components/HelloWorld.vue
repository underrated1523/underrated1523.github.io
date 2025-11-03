<script setup>
import { ref } from 'vue'
import { db } from "../firestore";
import { registAnimeTier, usertest } from "../firestore.js";

defineProps({
  msg: String,
})

function handleClick() {
  registAnimeTier();
  usertest();
}

</script>

<template>
  <h1>{{ msg }}</h1>

  <div>
    <button @click="handleClick">
      Firestoreに評価を追加
    </button>
  </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
