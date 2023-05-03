<template>
    <div class="row">
        <div class="col-md-3">
            <form @submit.prevent="onSubmit">
                <div class="form-group">
                    <label for="search">Search</label>
                    <input type="text" class="form-control" id="search" v-model="search">
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <select class="form-control" id="category" v-model="category">
                        <option value="">All</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="tags">Tags</label>
                    <select multiple class="form-control" id="tags" v-model="selectedTags">
                        <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                            {{ tag.name }}
                        </option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Apply Filters</button>
            </form>
        </div>
        <div class="col-md-9">
            <div class="row">
                <div class="col-md-4" v-for="post in filteredPosts" :key="post.id">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">{{ post.title }}</h5>
                            <p class="card-text">{{ post.content }}</p>
                            <router-link :to="{ name: 'PostView', params: { id: post.id } }" class="btn btn-danger">Read More</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            search: '',
            category: '',
            selectedTags: [],
        };
    },
    computed: {
        filteredPosts() {
            let filtered = this.posts;
            if (this.search) {
                filtered = filtered.filter(post =>
                    post.title.toLowerCase().includes(this.search.toLowerCase()) ||
                    post.content.toLowerCase().includes(this.search.toLowerCase())
                );
            }
            if (this.category) {
                filtered = filtered.filter(post => post.category === this.category);
            }
            if (this.selectedTags.length) {
                filtered = filtered.filter(post =>
                    post.tags.some(tag => this.selectedTags.includes(tag))
                );
            }
            return filtered;
        },
    },
    methods: {
        onSubmit() {
            // You can emit an event with the selected filters to the parent component
            this.$emit('filters-selected', {
                search: this.search,
                category: this.category,
                selectedTags: this.selectedTags,
            });
        },
    },
    props: {
        posts: {
            type: Array,
            required: true,
        },
        categories: {
            type: Array,
            required: true,
        },
        tags: {
            type: Array,
            required: true,
        },
    },
};
</script>
