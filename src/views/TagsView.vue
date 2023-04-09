<template>
    <div class="tag-list">
        <h2>Tags</h2>
        <ul>
            <li v-for="tag in tags" :key="tag.id">{{ tag.name }}</li>
        </ul>
    </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance";

export default {
    name: "TagsView",
    data() {
        return {

            tags: [],
        };
    },
    mounted() {
        this.getTags();
    },
    methods: {

        async getTags() {
            try {
                const response = await AxiosInstance.get('/tags');
                this.tags = response.data.data;
                console.log(response.data.data);
            } catch (error) {
                console.log(error);
            }
        },

    },
}
</script>

<style scoped>
.tag-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.tag-list ul li {
    margin-bottom: 5px;
}
</style>