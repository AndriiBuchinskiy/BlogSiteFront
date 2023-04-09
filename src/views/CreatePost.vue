<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <form @submit.prevent="createPost">
                    <div class="form-group">
                        <label for="title">Title:</label>
                        <input type="text" class="form-control" id="title" v-model="post.title" required>
                    </div>
                    <div class="form-group">
                        <label for="content">Content:</label>
                        <textarea class="form-control" id="content" v-model="post.content" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="category">Category:</label>
                        <select class="form-control" id="category" v-model="post.category">
                            <option disabled value="">Please select one</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tags">Tags:</label>
                        <select class="form-control" id="tags" v-model="post.tags" multiple>
                            <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="created_at">Created At:</label>
                        <input type="date" class="form-control" id="created_at" v-model="post.created_at" required>
                    </div>
                    <div class="form-group">
                        <label for="user_id">User ID:</label>
                        <input type="number" class="form-control" id="user_id" v-model="post.user_id" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Create Post</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance";

export default {
    name: "CreatePost",
    data() {
        return {
            post: {
                title: '',
                content: '',
                category: '',
                tags: [],
                created_at: '',
                user_id: ''
            },
            categories: [], // використовуйте цей масив для відображення списку категорій
            tags: [] // використовуйте цей масив для відображення списку тегів
        }
    },
    methods: {
        createPost() {
            AxiosInstance.post('/posts', this.post)
                .then(response => {
                    console.log(response.data.data)
                    // Очистити поля форми після створення поста
                    this.post.title = ''
                    this.post.content = ''
                    this.post.category = ''
                    this.post.tags = []
                    this.post.created_at = ''
                    this.post.user_id = ''
                })
                .catch(error => {
                    console.log(error)
                })
        }
    },
    mounted() {
        // Отримати список категорій з сервера
        AxiosInstance.get('/categories')
            .then(response => {
                this.categories = response.data.data
            })
            .catch(error => {
                console.log(error)
            })

        // Отримати список тегів з сервера
        AxiosInstance.get('/tags')
            .then(response => {
                this.tags = response.data.data
            })
            .catch(error => {
                console.log(error)
            })
    }
}
</script>

<style scoped>

</style>