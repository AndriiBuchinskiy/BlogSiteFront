<template>
  <form @submit.prevent="login">
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" v-model="email" required>
    </div>
    <div>
      <label for="password">Password</label>
      <input type="password" name="password" v-model="password" required>
    </div>
    <button type="submit">Login</button>
  </form>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      const response = await axios.post('https://localhost/api/login', {
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
