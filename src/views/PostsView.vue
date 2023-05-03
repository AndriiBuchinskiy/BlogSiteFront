<template>
    <div>
        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>
        <hr>
        <h3>Коментарі:</h3>
        <ul>
            <li v-for="comment in comments" :key="comment.id">
                {{ comment.content }}
                {{ comment.created_at }}
            </li>
        </ul>
    </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance";

export default {
    name: 'SinglePost',
    data() {
        return {
            post: {},
            comments: []
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {

                const postResponse = await AxiosInstance.get(`/posts/${this.post.id}`);
                this.post = postResponse.data.data;


                const commentsResponse = await AxiosInstance.get(`/posts/${this.post.id}/comments`);
                this.comments = commentsResponse.data;
            } catch (error) {
                console.error(error);
            }
        }
    }
}
</script>


<style scoped>

</style>