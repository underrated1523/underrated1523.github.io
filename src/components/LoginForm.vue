<template>
    <div class="login">
        <h2>My Anime Tier List</h2>
        <input v-model="username" placeholder="Username" />
        <input v-model="password" type="password" placeholder="Password" />
        <button @click="login">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
        <p>Don't have an account?
        <a @click="$emit('switch-mode')" class="link"> Sign up here.</a>
        </p>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import bcrypt from "bcryptjs";
import { selectUserData } from "../firestore.js";

const username = ref('');
const password = ref('');
const error = ref('');

const emit = defineEmits(['login-success', 'swich-mode']);

async function login() {
    const userData = await selectUserData(username.value)

    if (!userData) {
        error.value = 'User not found';
        return;
    }

    if (userData.userId && await bcrypt.compare(password.value, userData.password)) {
        localStorage.setItem("userId", username.value);
        emit('login-success');
    } else {
        error.value = 'Invalid username or password';
    }
}
</script>