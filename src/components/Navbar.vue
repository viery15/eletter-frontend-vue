<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="#">GISELLE</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" style="color:white">
            <router-link class="nav-link" to="/" style="color:white">Home</router-link>
          </li>
          <li class="nav-item" v-if="currentUser.admin == 'admin'">
            <router-link class="nav-link" to="/component" style="color:white">Component</router-link>
          </li>

          <li class="nav-item" v-if="currentUser.admin == 'admin'">
            <router-link class="nav-link" to="/format" style="color:white">Format</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item pull-right">
            <a style="color:white" class="nav-link">{{currentUser.nik}}</a>
          </li>
          <li class="nav-item pull-right">
            <router-link class="nav-link" to="/logout" v-if="currentUser" style="color:white">Logout</router-link>
          </li>
        </ul>
      </div>
    </nav>

</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    name: 'Navbar',
    computed: {
      ...mapGetters({ currentUser: 'currentUser' })
    }

  }
</script>
