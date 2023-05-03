<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-body">
                <h2 class="card-title">Назва: {{ post.title }}</h2>
                <p class="card-text">Контент: {{ post.content }}</p>
                <p class="card-text">Автор: {{ post.name ?? 'Невідомий автор' }}</p>
                <p class="card-text">Категорія: {{ post.category_name }}</p>
                <p class="card-text">Теги:</p>
                <ul>
                    <li v-for="tag in post.tag_name" :key="tag">{{ tag }}</li>
                </ul>



                <img v-if="post.img_path" :src="getImageUrl(post.img_path)" alt="Post Image" style="max-width: 500px; max-height: 500px;">


                <div class="d-flex">
                    <button @click="showEditForm = true" class="btn btn-primary mr-1">Edit</button>
                    <button @click="showDeleteConfirmation" class="btn btn-danger">Delete</button>
                </div>
                <p v-if="error" class="text-danger">{{ error }}</p>
                <form v-if="showEditForm" @submit.prevent="updatePost" class="mt-3">
                <div class="form-group">
                    <label for="title">Назва</label>
                    <input type="text" v-model="editedPost.title" id="title" class="form-control">
                    <div v-if="errors.title" class="mt-2 alert alert-danger">{{ errors.title[0] }}</div>
                    <label for="content">Content</label>
                    <textarea v-model="editedPost.content" id="content" class="form-control"></textarea>
                    <div v-if="errors.content" class="mt-2 alert alert-danger">{{ errors.content[0] }}</div>
                </div>
                    <div class="form-group">
                        <label for="category">Категорія:</label>
                        <select class="form-control" id="category" v-model="editedPost.category">
                            <option disabled value="">Виберіть одну категорію</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id" :selected="category.id === editedPost.category">{{ category.name }}</option>
                        </select>
                        <div v-if="errors.category" class="mt-2 alert alert-danger">{{ errors.category[0] }}</div>
                    </div>
                    <div class="form-group">
                        <label for="tags">Теги:</label>
                        <select class="form-control" id="tags" v-model="editedPost.tags" multiple>
                            <option v-for="tag in tagsd" :key="tag.id" :value="tag.id" >{{ tag.name }}</option>
                        </select>
                        <div v-if="errors.tag" class="mt-2 alert alert-danger">{{ errors.tag[0] }}</div>
                    </div>

                    <div class="form-group" >
                        <label for="image">Картинка:</label>
                        <input type="file" id="image" @change="handleImageChange">
                        <div v-if="errors.img_path" class="mt-2 alert alert-danger">{{ errors.img_path[0] }}</div>
                    </div>
                    <button @click="updatePost"  class="btn btn-primary">Зберегти</button>
                    <button @click="hideEditForm" class="btn btn-secondary">Відмінити</button>
                </form>
                <div v-if="showDeleteModal" class="mt-3">
                    <p>Ви впевнені що хочете видалити цей пост?</p>
                    <button @click="deletePost" class="btn btn-danger">Yes</button>
                    <button @click="hideDeleteModal" class="btn btn-secondary">No</button>
                </div>
                <h3 class="mt-3">Додати коментар</h3>
                <form @submit.prevent="addComment">
                    <div class="form-group">
                        <label for="content">Content</label>
                        <textarea id="content" v-model="newComment.content" class="form-control"></textarea>
                        <div v-if="errors.content" class="mt-2 alert alert-danger">{{ errors.content[0] }}</div>
                    </div>
                    <button type="submit" class="btn btn-primary">Додати</button>
                </form>
                <h3 class="mt-3">Comments</h3>
                <ul class="list-group" v-if="comments.length > 0">
                    <li v-for="comment in comments" :key="comment.id" class="list-group-item">
                        <p class="card-text">{{ comment.content }}</p>
                        <p class="card-text">Author: {{ comment.name }}</p>
                        <button @click="deleteComment(comment.id)" class="btn btn-danger">Видалити</button>
                    </li>
                </ul>
                <p v-else>Коментарів немає</p>
            </div>
        </div>
    </div>
</template>

<script>

import AxiosInstance from "@/services/AxiosInstance";
import {tr} from "vuetify/locale";

export default {

    computed: {
        tr() {
            return tr;
        },
    },
    data() {
        return {
            post: {},
            comments: [],
            newComment: {
                content: "",
                post_id: this.$route.params.id,
            },
            showEditForm: false,
            showDeleteModal: false,
            editedPost: {},
            tags: [],
            error: '',
            errors: [],
        };
    },
    mounted() {
        const id = this.$route.params.id;
        this.getPost(id)
        this.getComments(id)
        this.fetchTags(id)
        this.fetchTagss()
        this.fetchCategories()

    },

    methods: {
        fetchCategories() {
            AxiosInstance.get("/categories")
                .then((response) => {
                    this.categories = response.data.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        fetchTagss() {
            AxiosInstance.get("/tags")
                .then((response) => {
                    this.tagsd = response.data.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        fetchTags(id) {
            AxiosInstance.get(`/posts/${id}/tags`).then((response) => {
                this.tags = response.data.data;
            });
        },
        getPost(id) {
            AxiosInstance.get(`/posts/${id}`).then((response) => {
                this.post = response.data.data;
                //this.editedPost = { ...this.post };
                this.editedPost.title = this.post.title;
                this.editedPost.content = this.post.content;
                this.editedPost.category = this.post.category_id;
                this.editedPost.tags = this.post.tags;
            })
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        this.error = 'You do not have permission to view this posts.';
                    }
                    if(error.response && error.response.status === 404) {
                        this.error = 'Такого поста не існує.';
                    }
                });
        },
        getImageUrl(path) {
            if (path) {
                return path.replace('storage/app/', '')
            }
        },
        getComments(id)
        {
            AxiosInstance.get(`/posts/${id}/comments`).then((response) => {
                this.comments = response.data.data;
            });
        },
        hideEditForm() {
            this.showEditForm = false;
        },
        updatePost() {
            const id = this.$route.params.id;
            AxiosInstance.put(`/posts/${id}`, this.editedPost, {
                headers: {'Content-Type': 'application/json'}
            }).then((response) => {
                this.post = response.data.data;
                this.editedPost = { ...this.post };
                this.showEditForm = false;
                this.getPost(id);
            }).catch((error) => {
                if (error.response && error.response.status === 403) {
                    this.error = 'Ви не маєте прав для редагування поста.';
                }
                if(error.response && error.response.status === 404) {
                    this.error = 'Такого поста не існує.';
                } else {
                    const errors = error.response.data.errors;
                    if (errors) {
                        this.errors = errors;
                    }
                }
            });
        },
        showDeleteConfirmation() {
            this.showDeleteModal = true;
        },
        hideDeleteModal() {
            this.showDeleteModal = false;
        },
        deletePost() {
                const id = this.$route.params.id;
                AxiosInstance.delete(`/posts/${id}`).then(() => {
                    this.$router.push({name: 'Home'});
                })
                    .catch((error) => {
                        if (error.response && error.response.status === 403) {
                            this.error = 'Ви не маєте прав для видалення поста.';
                        }
                    });
        },
        addComment() {
            AxiosInstance.post(`/addComment`,{
                post_id: this.$route.params.id,
                content: this.newComment.content,
            }).then(() => {
                this.getComments(this.$route.params.id);
                this.newComment.content = '';
            })
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        this.error = 'Ви не маєте прав для додавання коментаря.';
                    } else {
                        const errors = error.response.data.errors;
                        if (errors) {
                            this.errors = errors;
                        }
                    }
                });

        },
        deleteComment(id) {
                AxiosInstance.delete(`/comments/${id}`).then(() => {
                    this.comments = this.comments.filter((comment) => comment.id !== id);
                    this.getComments(this.$route.params.id);
                })
                    .catch((error) => {
                        if (error.response && error.response.status === 403) {
                            this.error = 'Ви не маєте прав для видалення коментаря';
                        }
                    });
        },
    }
}
</script>



<style scoped>
h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

p {
    font-size: 1.2rem;
    line-height: 1.5;
    margin-bottom: 2rem;
}

ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

li {
    margin-bottom: 1rem;
}

button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    cursor: pointer;
    margin-right: 1rem;
}

button:hover {
    background-color: #3e8e41;
}

input[type="text"], textarea {
    font-size: 1.2rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #ccc;
    margin-bottom: 1rem;
    width: 100%;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

form button[type="submit"] {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    cursor: pointer;
}

form button[type="submit"]:hover {
    background-color: #3e8e41;
}

/* Modal styles */
.modal {
    display: block;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
}

.modal-inner {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.5rem;
    width: 50%;
    max-width: 600px;
}

.modal p {
    margin-bottom: 1rem;
}

.modal button {
    background-color: #f44336;
    color: white;
}

.modal button:hover {
    background-color: #ff5252;
}
</style>