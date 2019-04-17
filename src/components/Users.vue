<template>
  <div>
    <br /><br />
      <button v-on:click="newUser()" class="btn btn-info btn-sm" data-toggle="modal" data-target="#modal-user">Add New User</button>
      <br /><br />
      <v-client-table
          :data="listUser"
          :columns="columns"
          :options="options">

          <div slot="action" slot-scope="props">
            <button v-on:click="edit(props.row.id)" type="button" class="btn btn-warning btn-sm" data-toggle="modal" data-target="#modal-user"><font-awesome-icon icon="pen"/></button>
            <button style="margin-left:5px;" v-on:click="destroy(props.row.id)" type="button" class="btn btn-danger btn-sm"><font-awesome-icon icon="trash"/></button>
          </div>

          <div slot="access" slot-scope="access">
            <!-- {{access.row.access}} -->
            <h5><span style="margin-left:5px;" v-for="acc in access.row.access" class="badge badge-primary">{{acc}}</span></h5>
          </div>
      </v-client-table>
      <!-- <table class="table table-striped table-bordered">
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
      </table> -->

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
              <button v-if="modal_header == 'Edit User'" v-on:click="updateUser(selectedNik.nik)" type="button" class="btn btn-save btn-success">Update</button>
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>

        </div>
      </div>
      <!-- <img src="logo.png"/> -->
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
          columns: ['name', 'nik', 'access', 'role', 'action'],
          url: 'http://127.0.0.1/e-letter/',
          // url: 'http://hrd.citratubindo.co.id/hr_program/giselle/application/index.php/',


          options: {
              headings: {
                  name: 'Name',
                  access: 'Access',
                  nik: 'NIK',
                  role: 'Role'
              },
              sortable: ['name', 'nik', 'access', 'role', 'action'],
              filterable: ['name', 'nik', 'role'],
          },

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
          selectedFormat: [],
          selectedRole:'',
          selectedId: '',
        }
      },

      computed: {
        ...mapGetters({ currentUser: 'currentUser' })
      },

      mounted(){
        this.checkCurrentLogin()
        this.init()
      },

      methods: {
        checkCurrentLogin(){
          if (!this.currentUser || this.currentUser.admin !== 'admin') {
            // this.$router.push('/?redirect=' + this.$route.path)
            this.$router.replace(this.$route.query.redirect || '/login')
          }
        },

        init(){
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

        edit(id){
          this.modal_header = 'Edit User'
          axios.get(this.url+'user/edit/'+id)
          .then((response) => {
            // console.log(response.data)
            var nik = response.data.nik
            var role = response.data.role
            var access = response.data.access
            this.selectedId = response.data.id
            this.selectedFormat = []
            // console.log(access)
            this.selectedRole = this.roleList.find(x => x.role === role)
            this.selectedNik = this.users.find(x => x.nik === nik)
            for (var i = 0; i < access.length; i++) {
              this.selectedFormat[i] = this.formats.find(x => x.name === access[i])
            }

          })
          .catch((e) => {
            console.log(e)
          })
        },

        deleteUser(id){
          axios.delete(this.url+'user/delete/'+id)
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

        updateUser(nik) {
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

            axios.post(this.url+'user/update/'+this.selectedId, newUser)
            .then((response) => {
              this.init()
              $('#modal-user').modal('hide');
              this.$swal({
                position: 'top-end',
                type: 'success',
                title: 'Data updated successful',
                showConfirmButton: false,
                timer: 1500
              })
            })
            .catch((e) => {
              console.log(e)
            })
          }
        },

        resetForm(){
          this.selectedNik = ''
          this.selectedRole = ''
          this.selectedFormat = []
          this.selectedId = ''
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

            axios.post(this.url+'user/create', newUser)
            .then((response) => {
              this.init()
              this.resetForm()
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
              alert(this.selectedNik.nik+' already registered')
            })
          }
        },

        getUsers(){
          axios.get(this.url+'user/configUser')
          .then((response) => {
            this.users = response.data
          })
          .catch((e) => {
            console.log(e)
          })
        },

        getFormats(){
          axios.get(this.url+'format/getFormat')
          .then((response) => {
            this.formats = response.data
          })
          .catch((e) => {
            console.log(e)
          })
        },

        dataUser(){
          axios.get(this.url+'user/')
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
