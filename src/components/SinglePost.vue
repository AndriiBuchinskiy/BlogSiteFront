<template >
    <div class="container">
        <h1 class="display-4 my-4">Пости</h1>
        <div class="row">
            <div class="col-md-3">
                <form @submit.prevent="onSubmit">
                    <div class="form-group">
                        <label for="search">Пошук</label>
                        <input type="text" class="form-control" id="search" v-model="search">
                    </div>
                    <div class="form-group">
                        <label for="category">Категорія</label>
                        <select class="form-control" id="category" v-model="category">
                            <option value="">Усі</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tags">Теги</label>
                        <select multiple class="form-control" id="tags" v-model="selectedTags">
                            <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                                {{ tag.name }}
                            </option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Знайти</button>
                    <button class="btn btn-secondary" @click="clearSearch()">Очистити пошук</button>
                </form>
            </div>
            <div v-if="!searchResults" class="col-md-9">
                <div class="row">
                    <div class="col-md-4" v-for="post in posts" :key="post.id">
                        <div class="card mb-4">
                            <div class="card-body">
                                <h5 class="card-title">{{ post.title }}</h5>
                                <p class="card-text">{{ post.content }}</p>
                                <router-link :to="{ name: 'PostView', params: { id: post.id } }" class="btn btn-danger">Детальніше</router-link>
                            </div>
                        </div>
                    </div>

                </div>
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <a class="page-link" href="#" aria-label="Previous" @click.prevent="goToPreviousPage()">
                                <span aria-hidden="true">&laquo;</span>
                                <span class="sr-only">Попередня</span>
                            </a>
                        </li>
                        <li class="page-item" v-for="page in lastPage" :key="page" :class="{ active: currentPage === page }">
                            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === lastPage }">
                            <a class="page-link" href="#" aria-label="Next" @click.prevent="goToNextPage()">
                                <span aria-hidden="true">&raquo;</span>
                                <span class="sr-only">Наступна</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
                <div v-else class="col-md-9">
                    <div class="row" v-if="searchResults.length > 0">
                        <div class="col-md-4" v-for="post in searchResults" :key="post.id">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h5 class="card-title">{{ post.title }}</h5>
                                    <p class="card-text">{{ post.content }}</p>
                                    <router-link :to="{ name: 'PostView', params: { id: post.id } }" class="btn btn-danger">Детальніше</router-link>
                                </div>
                            </div>
                        </div>
                        <nav aria-label="Page navigation example">
                            <ul class="pagination">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <a class="page-link" href="#" aria-label="Previous" @click.prevent="goToPreviousPage()">
                                        <span aria-hidden="true">&laquo;</span>
                                        <span class="sr-only">Попередня</span>
                                    </a>
                                </li>
                                <li class="page-item" v-for="page in lastPage" :key="page" :class="{ active: currentPage === page }">
                                    <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                                </li>
                                <li class="page-item" :class="{ disabled: currentPage === lastPage }">
                                    <a class="page-link" href="#" aria-label="Next" @click.prevent="goToNextPage()">
                                        <span aria-hidden="true">&raquo;</span>
                                        <span class="sr-only">Наступна</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div v-else>
                        <p>По цьому запиту нічого не знайдено</p>
                    </div>
                    </div>
                </div>
                </div>

</template>


<script>
import AxiosInstance from "@/services/AxiosInstance";



export default {
    name: "SinglePost",
    data() {
        return {
            posts: [],
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total: 0,
            categories: [],
            tags: [],
            search: "",
            category: [],
            selectedTags: [],
            searchResults: null,
        };
    },
    created() {
        if (localStorage.getItem('searchResults')) {
            let searchResults = JSON.parse(localStorage.getItem('searchResults'));

            this.searchResults = searchResults;
            this.currentPage = searchResults.current_page;
            this.lastPage = searchResults.last_page;
            this.totalPages = searchResults.last_page;
            this.perPage = searchResults.per_page;
            this.total = searchResults.total;
            this.posts = searchResults.data; // Update posts with saved search results
        } else {
            this.fetchPosts(); // Load all posts
        }
    },
    mounted() {
        this.fetchPosts();
        this.fetchCategories();
        this.fetchTags();
        this.goToNextPage();
        this.goToPreviousPage();
        this.clearSearch();


    },

    methods: {
        fetchPosts() {
            let params = {
                page: this.currentPage,
                perPage: this.perPage
            };
            if (this.category) {
                params.category = this.category;
            }
            if (this.selectedTags.length > 0) {
                params.tags = this.selectedTags;
            }
            AxiosInstance.get('/posts', { params })
                .then(response => {
                    if (this.searchResults == null) { // Only update posts if there are no search results
                        this.posts = response.data.data;
                    }
                    this.currentPage = response.data.current_page;
                    this.lastPage = response.data.last_page;
                    this.totalPages = response.data.last_page;
                    this.perPage = response.data.per_page;
                    this.total = response.data.total;
                })

                .catch(error => {
                    console.log(error);
                });
        },
        fetchCategories() {
            AxiosInstance.get("/categories")
                .then((response) => {
                    this.categories = response.data.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        fetchTags() {
            AxiosInstance.get("/tags")
                .then((response) => {
                    this.tags = response.data.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        goToNextPage() {

            if (this.currentPage < this.lastPage) {

                this.currentPage++;


                this.fetchPosts();
            }
        },

        goToPreviousPage() {

            if (this.currentPage > 1) {
                this.currentPage--;
                this.fetchPosts();
            }
        },
        goToPage(page) {
            if (page < 1 || page > this.lastPage) {
                return;
            }
            this.currentPage = page;
            this.fetchPosts();
        },
        onSubmit() {
            let params = {
                search: this.search
            };
            if (this.category) {
                params.category = this.category;
            }
            if (this.selectedTags.length > 0) {
                params.tags = this.selectedTags;
            }
            // фільтри зберегти в локалсторідж і вивести при переході.
            AxiosInstance.get("/posts/search", { params })
                .then((response) => {
                    this.searchResults = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.lastPage = response.data.last_page;
                    this.totalPages = response.data.last_page;
                    this.perPage = response.data.per_page;
                    this.total = response.data.total;
                    this.posts = response.data.data; // Update posts with search results

                    // Save search results to local storage
                    localStorage.setItem('searchResults', JSON.stringify(this.searchResults));
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        clearSearch() {
            this.search = '';
            this.category = null;
            this.selectedTags = [];
            if (this.searchResults) {
                this.posts = this.searchResults.data; // Restore posts to the search results
                this.currentPage = this.searchResults.current_page;
                this.lastPage = this.searchResults.last_page;
                this.totalPages = this.searchResults.last_page;
                this.perPage = this.searchResults.per_page;
                this.total = this.searchResults.total;
                this.searchResults = null;

                // Remove search results from local storage
                localStorage.removeItem('searchResults');
            } else {
                this.fetchPosts(); // Reload all posts
            }
        },


    }
};
</script>
<style scoped>
</style>
