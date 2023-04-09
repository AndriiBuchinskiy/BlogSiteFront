<template>
    <div class="container">
        <h1>Posts</h1>
        <ul class="list-group">
            <li v-for="post in posts" :key="post.id" class="list-group-item">
                <h2>{{ post.title }}</h2>
                <p>{{ post.content }}</p>
                <button @click="editPost(post)" class="btn btn-primary">Edit</button>
                <button @click="deletePost(post)" class="btn btn-danger">Delete</button>
            </li>
        </ul>
        <form v-if="editingPost" @submit.prevent="updatePost">
            <div class="form-group">
                <label for="edit-post-title">Title:</label>
                <input type="text" v-model="editingPost.title" id="edit-post-title" class="form-control">
            </div>
            <div class="form-group">
                <label for="edit-post-body">Body:</label>
                <textarea v-model="editingPost.body" id="edit-post-body" class="form-control"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
            <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </form>
        <form v-if="editingComment" @submit.prevent="updateComment">
            <div class="form-group">
                <label for="edit-comment-body">Comment:</label>
                <input type="text" v-model="editingComment.body" id="edit-comment-body" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
            <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </form>
    </div>

</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            posts: [],
            newPost: {
                title: '',
                content: ''
            },
            editingPost: null,
            newComment: '',
            editingComment: null
        }
    },
    mounted() {
        axios.get('http://localhost:86/api/posts')
            .then(response => {
                this.posts = response.data.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    methods: {
        addPost() {
            axios.post('http://localhost:86/api/posts', this.newPost)
                .then(response => {
                    this.posts.push(response.data.data);
                    this.newPost.title = '';
                    this.newPost.body = '';
                })
                .catch(error => {
                    console.log(error);
                });
        },
        editPost(post) {
            this.editingPost = post;
        },
        updatePost() {
            axios.put(`http://localhost:86/api/posts/${this.editingPost.id}`, this.editingPost)
                .then(response => {
                    const index = this.posts.findIndex(post => post.id === response.data.data.id);
                    this.posts.splice(index, 1, response.data.data);
                    this.editingPost = null;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        cancelEdit() {
            this.editingPost = null;
            this.editingComment = null;
        },
        deletePost(post) {
            axios.delete(`http://localhost:86/api/posts/${post.id}`)
                .then(() => {
                    const index = this.posts.findIndex(p => p.id === post.id);
                    this.posts.splice(index, 1);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        addComment(post) {
            const comment = {
                body: this.newComment,
                post_id: post.id
            };
            axios.post('http://localhost:86/api/comments', comment)
                .then(response => {
                    const index = this.posts.findIndex(p => p.id === post.id);
                    this.posts[index].comments.push(response.data.data);
                    this.newComment = '';
                })
                .catch(error => {
                    console.log(error);
                });
        },
        editComment(comment) {
            this.editingComment = comment;
        },
        updateComment() {
            axios.put(`http://localhost:86/api/comments/${this.editingComment.id}`, this.editingComment)
                .then(response => {
                    const postIndex = this.posts.findIndex(post => post.id === response.data.data.post_id);
                    const commentIndex = this.posts[postIndex].comments.findIndex(c => c.id === response.data.data.id);
                    this.posts[postIndex].comments.splice(commentIndex, 1, response.data.data);
                    this.editingComment = null;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        deleteComment(comment) {
            axios.delete(`http://localhost:86/api/comments/${comment.id}`)
                .then(() => {
                    const postIndex = this.posts.findIndex(post => post.id === comment.post_id);
                    const commentIndex = this.posts[postIndex].comments.findIndex(c => c.id === comment.id);
                    this.posts[postIndex].comments.splice(commentIndex, 1);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
}
</script>
