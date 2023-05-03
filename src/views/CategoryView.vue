<template>
    <div class="container">
        <div class="category-list">
            <h2>Категорії</h2>
            <ul>
                <li v-for="category in categories" :key="category.id" @click="selectCategory(category)">
                    {{ category.name }}
                </li>
            </ul>
        </div>
        <div class="post-list">
            <h2>Пости</h2>
            <ul>
                <li v-for="post in filteredPosts" :key="post.id">
                    {{ post.title }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance";

export default {
    data() {
        return {
            categories: [],
            posts: [],
            selectedCategory: null,
        };
    },
    mounted() {
        this.getCategories();
        this.getPosts();
    },
    methods: {
        getCategories() {
            AxiosInstance.get('/categories')
                .then(response => {
                    this.categories = response.data.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        getPosts() {
            AxiosInstance.get('/posts')
                .then(response => {
                    this.posts = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        selectCategory(category) {
            this.selectedCategory = category;
        },
    },
    computed: {
        filteredPosts() {
            if (!this.selectedCategory) {
                return this.posts;
            }
            return this.posts.filter(post => post.category_id === this.selectedCategory.id);
        },
    },

};
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
}

.category-list {
    flex: 1;
    margin-right: 20px;
}

.post-list {
    flex: 2;
}
</style>