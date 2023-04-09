<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div v-for="post in posts" :key="post.id" class="card my-3">
          <div class="card-body">
            <h2 class="card-title">{{ post.title }}</h2>
            <p class="card-text">{{ post.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import AxiosInstance from "@/services/AxiosInstance";


export default {

  data() {
    return {
      posts: [],
    };
  },
  mounted() {
   AxiosInstance.get('/posts/').then(response => {
      this.posts = response.data;
    }).catch(error => {
      console.log(error);
    });
  },
};
</script>
<style scoped>
.succmsg {
  display: none;
}
.showmodal {
  display: none !important;
  opacity: 0;
}</style>