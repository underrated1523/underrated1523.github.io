<template>
    <input v-model="searchTerm" @input="search" placeholder="search title" />
    <button @click="search()">🔍</button>

    <div>
        <ul v-if="result">
            <li v-for="anime in result.Page.media" :key="anime.id" @click="$emit('add', anime)">
                <img :src="anime.coverImage.large" :alt="anime.title.romaji" width="50" />
                {{ anime.title.native }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from "../firestore";
import { registAnimeTier, usertest } from "../firestore.js";
import { useQuery } from "@vue/apollo-composable";
import { gql } from "graphql-tag"; 

function handleClick() {
  registAnimeTier();
  usertest();
}

const searchTerm = ref("");

const GET_ANIME = gql`
    query ($str: String) {
        Page(perPage:3) {
            media(search: $str, type: ANIME) {
                id
                title {
                    romaji
                    english
                    native
                }
                coverImage {
                    large
                }
                siteUrl
            }
        }
    }
`;

const { result, loading, error } = useQuery(GET_ANIME, () => ({
    str: searchTerm.value
}));

function search() {
    refetch({str: searchTerm.value});
    // console.log(result.value);
}

</script>

<style>

</style>