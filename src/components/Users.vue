<template>
  <div>
    <br /><br />
      <button v-on:click="newUser()" class="btn btn-info btn-sm" data-toggle="modal" data-target="#modal-user">Add New User</button>
      <br /><br />
      <table class="table table-striped table-bordered">
        <tr>
          <th style="text-align:center">NIK</th>
          <th style="text-align:center">Name</th>
          <th style="text-align:center">Access</th>
          <th style="text-align:center">Role</th>
          <th style="text-align:center">Action</th>
        </tr>
        <tr v-for="user in listUser">
          <td>{{user.nik}}</td>
          <td>{{user.name}}</td>
          <td>{{user.access}}</td>
          <td>{{user.role}}</td>
          <td style="text-align:center"><button v-on:click="destroy(user.id)" type="button" class="btn btn-danger btn-sm"><font-awesome-icon icon="trash"/></button></td>
        </tr>
      </table>

      <div id="modal-user" class="modal fade" role="dialog">
        <div class="modal-dialog modal-md">
          <div class="modal-content ">
            <div class="modal-header">
              <h5 class="modal-title">{{modal_header}}</h5>
              <button type="button" class="pull-right close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="usr">NIK: * </label><br />
                <multiselect v-model="selectedNik" :options="users" :multiple="false" :close-on-select="true" :clear-on-select="false" :preserve-search="true" placeholder="Select user" label="label" track-by="label" :preselect-first="false">
                  <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>
                </multiselect>
                <!-- <span style="color:red">{{ errors.first('name') }}</span> -->
              </div>

              <div class="form-group">
                <label for="usr">Role: * </label><br />
                <multiselect @input="changeRole()" v-model="selectedRole" :options="roleList" :multiple="false" :close-on-select="true" :clear-on-select="false" :preserve-search="true" placeholder="Select role" label="role" track-by="role" :preselect-first="false">
                  <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>
                </multiselect>
                <!-- <span style="color:red">{{ errors.first('name') }}</span> -->
              </div>

              <div class="form-group" v-if="selectedRole == '' || selectedRole.role == 'user'">
                <label for="usr">Access: * </label><br />
                <multiselect v-model="selectedFormat" :options="formats" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Select format" label="name" track-by="name" :preselect-first="false">
                  <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>
                </multiselect>
                <!-- <span style="color:red">{{ errors.first('name') }}</span> -->
              </div>

            </div>
            <div class="modal-footer">
              <button v-if="modal_header == 'New User'" v-on:click="addUser()" type="button" class="btn btn-save btn-success" >Save</button>
              <button v-if="modal_header == 'Edit User'" v-on:click="updateComponent(inputComponent.id)" type="button" class="btn btn-save btn-success">Update</button>
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>

        </div>
      </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import Multiselect from 'vue-multiselect'

    export default {
      name : 'Users',
      components: {
        Multiselect
      },

      data(){
        return {
          modal_header: '',
          input: [],
          users: [],
          formats: [],
          listUser: [],
          roleList: [
            {
              role: 'admin'
            },
            {
              role: 'user'
            }
          ],
          selectedNik: '',
          selectedFormat: '',
          selectedRole:'',
        }
      },

      computed: {
        ...mapGetters({ currentUser: 'currentUser' })
      },

      mounted(){
        this.init()
      },

      methods: {
        checkCurrentLogin(){
          if (!this.currentUser || this.currentUser.role != 'admin') {
            this.$router.replace(this.$route.query.redirect || '/login')
          }
        },

        init(){
          this.checkCurrentLogin()
          this.resetForm()
          this.getUsers()
          this.getFormats()
          this.dataUser()
        },

        newUser(){
          this.modal_header = 'New User'
        },

        changeRole(){
          if (this.selectedRole.role == 'admin') {
            this.selectedFormat = ''
          }
        },

        destroy(id) {
          this.$swal({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {

              if (result.value) {
                this.deleteUser(id)
              }
            })
        },

        deleteUser(id){
          axios.delete('http://127.0.0.1/e-letter/user/delete/'+id)
          .then((response) => {
            this.init()
            this.$swal({
              position: 'top-end',
              type: 'success',
              title: 'Data deleted successful',
              showConfirmButton: false,
              timer: 1500
            })
          })
          .catch((e) => {
            console.log(e)
          })
        },

        addUser(){
          if (this.selectedNik == '' || this.selectedRole == '') {
            alert('All field cannot empty')
          }
          else if(this.selectedRole.role == 'user' && this.selectedFormat == '') {
            alert('Access field cannot empty')
          }
          else {
            const newUser = new URLSearchParams()
            newUser.append('nik', this.selectedNik.nik)
            newUser.append('role', this.selectedRole.role)
            newUser.append('name', this.selectedNik.nama)

            if (this.selectedFormat != '') {
              for (var i = 0; i < this.selectedFormat.length; i++) {
                newUser.append('access[]', this.selectedFormat[i].id)
              }
            }
            else {
              newUser.append('access', this.selectedFormat)
            }

            axios.post('http://127.0.0.1/e-letter/user/create', newUser)
            .then((response) => {
              this.init()
              $('#modal-user').modal('hide');
              this.$swal({
                position: 'top-end',
                type: 'success',
                title: 'Data saved successful',
                showConfirmButton: false,
                timer: 1500
              })
            })
            .catch((e) => {
              console.log(e)
            })
          }
        },

        getUsers(){
          axios.get('http://127.0.0.1/e-letter/user/configUser')
          .then((response) => {
            this.users = response.data
          })
          .catch((e) => {
            console.log(e)
          })
        },

        getFormats(){
          axios.get('http://127.0.0.1/e-letter/format/letterFormat')
          .then((response) => {
            this.formats = response.data
          })
          .catch((e) => {
            console.log(e)
          })
        },

        dataUser(){
          axios.get('http://127.0.0.1/e-letter/user/')
          .then((response) => {
            this.listUser = response.data
          })
          .catch((e) => {
            console.log(e)
          })
        },

        resetForm(){
          this.selectedNik = ''
          this.selectedRole = ''
          this.selectedFormat = ''
        },

      }


    }

</script>
