import './style.css'
import { createApp, provide, h } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import App from './App.vue'
import { createHttpLink, InMemoryCache, ApolloClient } from '@apollo/client/core';

const httpLink = createHttpLink({
    uri: 'https://graphql.anilist.co',
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
});

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient);
    },
    render: () => h(App),
});

app.mount('#app');
