<template>
    <div class="category-list">
        <h2>Категорії постів</h2>
        <ul>
            <li v-for="category in categories" :key="category.id">
                <a>{{ category.name }}</a> //тут должен быть клик на функцию
            </li>
        </ul>
    </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance";
export default {
    name: "CategoryView",
    data() {
        return {
            categories: [],
        };
    },
    mounted() {
        this.getCategories();

    },
    methods: {
// Отримати список категорій з ресурсного контролера Laravel
        async getCategories() {
            try {
                const response = await AxiosInstance.get('/categories');
                this.categories = response.data.data;
                console.log(response.data.data);
            } catch (error) {
                console.log(error);
            }
        },

    },


}
</script>

<style scoped>
.category-list {
    left: 0;
    margin-bottom: 20px;
}
.category-list ul {
    left: 0;
    list-style: none;
    padding: 0;
    margin: 0;
}
.category-list ul li {
    left: 0;
    margin-bottom: 5px;
}
.category-list ul li a {
    left: 0;
    text-decoration: none;
    color: #000;
    cursor: pointer;
}
</style>