<template>
    <div class="signup">
        <h2>Sign up</h2>
        <input v-model="username" placeholder="Username" />
        <input v-model="password" type="password" placeholder="Password" />
        <input v-model="confirm" type="password" placeholder="Confirm Password" />
        <button @click="signup">Create Account</button>
        <p v-if="error" class="error">{{ error }}</p>
        <p>Already have an account?
        <a @click="$emit('switch-mode')" class="link"> Log in here.</a>
        </p>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import bcrypt from "bcryptjs";
import UserModel from '../models/userModel';
import { registUser } from "../firestore.js";

const username = ref('');
const password = ref('');
const confirm = ref('');
const error = ref('');

const emit = defineEmits(['login-success', 'switch-mode']);

async function registUserData(username, password) {
    const userModel = new UserModel();
    userModel.userId = username;
    userModel.password = await bcrypt.hash(password, 10);
    await registUser(userModel);
}

function signup() {
    if (password.value !== confirm.value) {
        error.value = 'Passwords do not match'
        return
    }
    registUserData(username.value, password.value);
    emit();
}
</script>