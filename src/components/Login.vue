<template>
  <div>
    <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Sign In</h5>
            <form class="form-signin" v-on:submit.prevent="login()">
              <div class="form-label-group">
                <label for="inputEmail">NIK</label>
                <input v-model="nik" type="text" class="form-control" placeholder="NIK" required autofocus>

              </div>
              <br />
              <div class="form-label-group">
                <label for="inputPassword">Password</label>
                <input v-model="password" type="password" class="form-control" placeholder="Password" required>

              </div>
              <br />

              <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign in</button>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import { mapGetters } from 'vuex'
  export default {
    name: 'Login',
    data(){
      return {
        url: 'http://127.0.0.1/e-letter/',
        // url: 'http://hrd.citratubindo.co.id/hr_program/giselle/application/index.php/',
        password: '12345',
        nik:'',
        error:'',
      }
    },

    computed: {
     ...mapGetters({ currentUser: 'currentUser' })
    },

    mounted(){
      this.checkCurrentLogin()
    },

    methods: {
      checkCurrentLogin () {
        if (this.currentUser) {
          this.$router.replace(this.$route.query.redirect || '/')
        }
      },

      login(){
        const newComponent = new URLSearchParams()
        newComponent.append('nik', this.nik)
        newComponent.append('password', this.password)

        axios.post(this.url+'user/login/',newComponent)
        .then(response => {
          this.loginsuccessful(response)
        })
      },

      loginsuccessful(res){
        if(!res.data.token) {
          this.loginFailed()
          return
        }

        localStorage.token = res.data.token
        this.error = false
        this.$store.dispatch('login')
        this.$router.replace(this.$route.query.redirect || '/')
      },

      loginFailed(){
        alert('Invalid Credential')
        this.$store.dispatch('logout')
        delete localStorage.token
      },
    }
  }
</script>
<style>



</style>
