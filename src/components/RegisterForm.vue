<template>
  <form @submit.prevent="register">
    <div>
      <label for="name">Name</label>
      <input type="text" name="name" v-model="name" required>
    </div>
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" v-model="email" required>
    </div>
    <div>
      <label for="password">Password</label>
      <input type="password" name="password" v-model="password" required>
    </div>
    <button type="submit">Register</button>
  </form>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
    }
  },
  methods: {
    async register() {
      const response = await axios.post('https://localhost/api/register', {
        name: this.name,
        email: this.email,
        password: this.password,
      })

      const token = response.data.token
      localStorage.setItem('token', token)

      this.$router.push('/')
    }
  }
}
</script>
