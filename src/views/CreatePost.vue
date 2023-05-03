<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <form @submit.prevent="createPost" enctype="multipart/form-data">
                    <div class="error" v-if="error">{{ error }}</div>

                    <div class="form-group">
                        <label for="title">Назва:</label>
                        <input type="text" class="form-control" id="title" v-model="post.title" required>
                        <div v-if="errors.title" class="mt-2 alert alert-danger">{{ errors.title[0] }}</div>
                    </div>
                    <div class="form-group">
                        <label for="content">Контент:</label>
                        <textarea class="form-control" id="content" v-model="post.content" required></textarea>
                        <div v-if="errors.content" class="mt-2 alert alert-danger">{{ errors.content[0] }}</div>
                    </div>
                    <div class="form-group">
                        <label for="category">Категорія:</label>
                        <select class="form-control" id="category" v-model="post.category">
                            <option disabled value="">Please select one</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                        </select>
                        <div v-if="errors.category" class="mt-2 alert alert-danger">{{ errors.category[0] }}</div>
                    </div>
                    <div class="form-group">
                        <label for="tags">Теги:</label>
                        <select class="form-control" id="tags" v-model="post.tags" multiple>
                            <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                        </select>
                        <div v-if="errors.tags" class="mt-2 alert alert-danger">{{ errors.tags[0] }}</div>
                    </div>

                    <div class="form-group" >
                        <label for="image">Зображення:</label>
                        <input type="file" id="image" @change="handleImageChange">
                        <div v-if="errors.image" class="mt-2 alert alert-danger">{{ errors.image[0] }}</div>
                    </div>
                    <button type="submit" class="btn btn-primary">Створити пост</button>
                </form>
            </div>
        </div>
    </div>
</template>


<script>
import AxiosInstance from "@/services/AxiosInstance";
import {mapState} from "pinia";
import {useAuthStore} from "@/stores/auth";


export default {
    name: "CreatePost",
    data() {
        return {
            post: {
                title: '',
                content: '',
                category: '',
                tags: [],
                user_id: '',
                img_path: '',

            },
            categories: [],
            tags: [],
            errors: [],
            error:''

        }
    },

    computed: {
        ...mapState(useAuthStore, ["user"])
    },

    mounted() {

        AxiosInstance.get('/categories')
            .then(response => {
                this.categories = response.data.data
            })
            .catch(error => {
                console.log(error)
            })


        AxiosInstance.get('/tags')
            .then(response => {
                this.tags = response.data.data
            })
            .catch(error => {
                console.log(error)
            })
    },
    methods: {
        handleImageChange(event) {
            this.post.img_path = event.target.files[0];
        },
        async createPost() {
            const formData = new FormData();
            formData.append('title', this.post.title);
            formData.append('content', this.post.content);
            formData.append('category', this.post.category);
            formData.append('tags', JSON.stringify(this.post.tags));
            formData.append('user_id', this.user.id);
            formData.append('img_path', this.post.img_path);

            try {
                const response = await AxiosInstance.post('/posts', formData);
                console.log(response.data);
                this.$router.push({name: 'Home'});
            } catch (error) {
                console.log(error);
                if (error.response) {
                    const errors = error.response.data.errors;
                    if (errors) {
                        this.errors = errors;
                    } else {
                        this.error = error.response.data.message;
                    }
                } else {
                    this.error = 'An error occurred while creating the post.';
                }

                if (error.response && error.response.status === 403) {
                    this.error = 'Ви не маєте прав для створення поста.';
                }
            }

        },
    },
}
</script>

<style scoped>

</style>