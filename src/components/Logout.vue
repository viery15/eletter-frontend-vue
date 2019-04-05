<script>
  export default {
    name: 'Logout',
    mounted () {
      delete localStorage.token
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
</script>
