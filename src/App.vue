<template>
    <v-app>
        <v-main>
            <HeaderApp/>
            <router-view/>
        </v-main>
    </v-app>
</template>

<script>
//import LoginForm from "@/components/LoginForm.vue";
//import RegisterForm from "@/components/RegisterForm.vue";
import HeaderApp from "@/HeaderApp.vue";

//import SinglePost from "@/components/PostsView.vue";
//import SinglePost from "@/components/PostsView.vue";
//import PostsView from "@/components/PostsView.vue";

export default {
  name: 'App',
  components: {
    HeaderApp,

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
header {
    background-color: #333;
    color: #fff;
    padding: 1rem;
}

nav {
    background-color: #eee;
    padding: 1rem;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    margin-bottom: 0.5rem;
}

a {
    color: #333;
    text-decoration: none;
}

a:hover {
    color: #000;
}
</style>
