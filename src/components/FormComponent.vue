<template>

    <!-- <font-awesome-icon icon="pen"/> -->
    <div>
      <br /><br />
        <button v-on:click="newComponent()" class="btn btn-info btn-sm" data-toggle="modal" data-target="#modal-form">Add New Component</button>
        <br /><br />
        <v-client-table
            :data="components"
            :columns="columns"
            :options="optionsTable">
            <!-- <a slot="action" :href="delete(props.row.id)" slot-scope="props">edit</a> -->
            <div slot="action" slot-scope="props">
              <button style="margin-left:5px" v-on:click="editComponent(props.row.id)" class="btn btn-md btn-warning btn-sm" data-toggle="modal" data-target="#modal-form"><font-awesome-icon icon="pen"/></button>
              <button style="margin-left:5px" v-on:click="destroy(props.row.id)" type="button" class="btn btn-danger btn-sm"><font-awesome-icon icon="trash"/></button>
              <button style="margin-left:5px" v-on:click="view(props.row.id)" class="btn btn-md btn-info btn-sm" data-toggle="modal" data-target="#modal-view"><font-awesome-icon icon="eye"/></button>
            </div>

        </v-client-table>
        <!-- <table class="table table-striped table-bordered">
          <tr>
            <th style="text-align:center" v-for='column in columns'>{{column}}</th>
            <th style="text-align:center">Action</th>
          </tr>
          <tr v-if="component.length !== 0" v-for='component in components'>
            <td width='20%'>{{component.name}}</td>
            <td width='20%'>{{component.variable_name}}</td>
            <td>{{component.html_basic}}</td>
            <td style="text-align:center" width='15%'>
              <button style="margin-left:5px" v-on:click="editComponent(component.id)" class="btn btn-md btn-warning btn-sm" data-toggle="modal" data-target="#modal-form"><font-awesome-icon icon="pen"/></button>
              <button style="margin-left:5px" v-on:click="destroy(component.id)" class="btn btn-md btn-danger btn-sm"><font-awesome-icon icon="trash"/></button>
              <button style="margin-left:5px" v-on:click="view(component.id)" class="btn btn-md btn-info btn-sm" data-toggle="modal" data-target="#modal-view"><font-awesome-icon icon="eye"/></button>
            </td>
          </tr>
        </table> -->

        <div id="modal-form" class="modal fade" role="dialog">
          <div class="modal-dialog modal-lg" style="max-width:900px">
            <!-- Modal content-->
            <div class="modal-content ">
              <div class="modal-header">
                <h5 class="modal-title">{{modal_header}}</h5>
                <button type="button" class="pull-right close" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-6">
                    <h6>Basic Setting</h6><hr />
                    <form id='input-component'>
                    <div class="form-group">
                      <label for="usr">Label: * </label><br />
                      <input name="name" v-validate="'required'" autocomplete="off" v-model="inputComponent.name" type="text" class="form-control">
                      <span style="color:red">{{ errors.first('name') }}</span>
                    </div>
                    <div class="form-group">
                      <div class="checkbox">
                        <label><input type="checkbox" value="config" v-model="fromConfig"> Generate with config variable </label>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="usr">Variable Name: * </label>
                      <input v-if="fromConfig == false" v-validate="'required'" name="variable_name" autocomplete="off" v-model="inputComponent.variable_name" type="text" class="form-control">
                      <select v-if="fromConfig == true" name="variable_name" v-validate="'required'" class="form-control" v-model="inputComponent.variable_name">
                        <option value="" disabled selected>Select NIK</option>
                        <option v-for='data in dataConfig'>{{data}}</option>
                      </select>
                      <span style="color:red">{{ errors.first('variable_name') }}</span>
                    </div>
                    <div class="form-group">
                      <label for="sel1">Input type: * </label>
                      <input readonly v-if="fromConfig == true" v-validate="'required'" name="type" autocomplete="off" v-model="inputComponent.type = 'text'" type="text" class="form-control">
                      <select v-if="fromConfig == false" name="type" v-validate="'required'" v-on:change="onChange($event)" class="form-control" v-model="inputComponent.type">
                        <option value="" disabled selected>Select input type</option>
                        <option v-for='input in inputType'>{{input}}</option>
                      </select>
                      <span style="color:red">{{ errors.first('type') }}</span>
                    </div>
                    </form>

                  </div>
                  <div class="col-md-6">
                    <div v-if="inputComponent.type == 'radio' || inputComponent.type == 'checkbox' || inputComponent.type == 'dropdown'">
                      <h6>Option Setting</h6><hr />
                      <div v-for="(option, index) in options">
                        <div class="form-group">
                          <label for="usr">Option {{option.countOption}}: </label>
                          <div class="row">
                            <div class="col-md-10">
                                <input :name="'option'+option.countOption" v-validate="'required'" :placeholder="'option '+ option.countOption" v-model="option.option" style="width:90%" autocomplete="off" type="text" class="form-control">
                                <span style="color:red">{{ errors.first('option'+option.countOption) }}</span>
                            </div>
                            <div class="col-md-1">
                              <button v-on:click="removeOption(index)" v-if="options.length > 1" class="btn btn-danger btn-sm"><font-awesome-icon icon="window-close"/></button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="text-center">
                        <button v-on:click="addOption()" v-if="inputComponent.type == 'radio' || inputComponent.type == 'checkbox' || inputComponent.type == 'dropdown'" class="btn btn-success btn-sm center"><font-awesome-icon icon="plus"/></button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">


                  <div class="col-md-12">
                    <h6>Attribut Setting</h6><hr />
                    <div class="row" v-for="(attribut, index) in attributs">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="usr">Attribut {{attribut.count}}: </label>
                          <input :placeholder="'attribut ' + attribut.count" v-model="attribut.attribut" autocomplete="off" type="text" class="form-control">
                        </div>
                      </div>
                      <div class="col-md-5">
                        <div class="form-group">
                          <label for="usr">Value {{attribut.count}} :  </label>
                          <input :placeholder="'value ' + attribut.count" v-model="attribut.value" autocomplete="off" type="text" class="form-control">
                        </div>
                      </div>
                      <div class="col-md-1">
                        <div class="form-group">
                          <br />
                          <button v-on:click="removeAttribut(index)" v-if="attributs.length > 1" class="btn btn-danger btn-sm pull-right"><font-awesome-icon icon="window-close"/></button>
                        </div>

                      </div>
                    </div>
                    <div class="text-center">
                      <button v-on:click="addAttribut()" class="btn btn-success btn-sm center"><font-awesome-icon icon="plus"/></button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button v-if="modal_header == 'New Component'" v-on:click="addComponent()" type="button" class="btn btn-save btn-success" >Save</button>
                <button v-if="modal_header == 'Edit Component'" v-on:click="updateComponent(inputComponent.id)" type="button" class="btn btn-save btn-success">Update</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>

          </div>
        </div>

        <!-- MODAL VIEW  -->

        <div id="modal-view" class="modal fade" role="dialog">
          <div class="modal-dialog modal-md">
            <!-- Modal content-->
            <div class="modal-content ">
              <div class="modal-header">
                <h5 class="modal-title" v-html="view_data.name"></h5>
                <button type="button" class="pull-right close" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                <div v-html="view_data.html_basic"></div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
    name: 'FormComponent',

    data: function(){
      return {
        url: 'http://127.0.0.1/e-letter/',
        // url: 'http://hrd.citratubindo.co.id/hr_program/giselle/application/index.php/',


        columns: ['name', 'variable_name', 'html_basic', 'action'],
        optionsTable: {
            headings: {
                name: 'Name',
                variable_name: 'Variable Name',
                html_basic: 'HTML_Basic',
                action: 'Action',
            },
            sortable: ['name', 'variable_name', 'html_basic', 'action'],
            filterable: ['name', 'variable_name']
        },
        inputType: ['text','number','textarea','date','radio','checkbox','dropdown'],
        components: [],
        modal_header: '',
        data_input: [],
        inputComponent: {},
        view_data:[],
        selectedConfig: '',
        variableConfig: [],
        fromConfig: '',
        dataConfig: [],
        alert: false,
        attributs: [{
          attribut: '',
          value: '',
          count: 1
          }
        ],
        count: 1,

        options: [{
          option: '',
          countOption: 1
          }
        ],
        countOptions: 1,
      }
    },

    computed: {
      ...mapGetters({ currentUser: 'currentUser' })
    },

    mounted() {
      this.checkCurrentLogin()
      this.init()
      this.getConfig()
      this.getVarConfig()
    },

    methods: {
      init(){
        axios.get(this.url+'component/index2')
        .then((response) => {
          this.components = response.data
        })
        .catch((e) => {
          console.log(e)
        })
      },

      checkCurrentLogin(){
        if (!this.currentUser || this.currentUser.admin !== 'admin') {
          // this.$router.push('/?redirect=' + this.$route.path)
          this.$router.replace(this.$route.query.redirect || '/login')
        }
      },

      getConfig(){
        axios.get(this.url+'component/config')
        .then((response) => {
          this.dataConfig = response.data
        })
        .catch((e) => {
          console.log(e)
        })
      },

      getVarConfig(){
        axios.get(this.url+'component/allConfigVariable')
        .then((response) => {
          this.variableConfig = response.data
        })
        .catch((e) => {
          console.log(e)
        })
      },

      async newComponent(){
        this.getVarConfig()
        this.getConfig()
        this.fromConfig = false
        this.inputComponent = {}
        this.errors.clear()
        this.modal_header = 'New Component'
        const response = await axios.get(this.url+'component/list_input')
        this.data_input = response.data
        this.count = 1
        this.countOption = 1
        this.attributs = [{
          attribut: '',
          value: '',
          count: 1
          }
        ]
        this.options = [{
          option: '',
          countOption: 1
          }
        ]
      },

      addComponent(){
        this.$validator.validate().then(valid => {
            if (valid) {
              if (this.fromConfig == false) {
                var check = this.variableConfig.find(x => x === this.inputComponent.variable_name)
                if (check !== undefined) {
                    alert(this.inputComponent.variable_name+' is defined in the config. Change variable or check generate with config variable')
                    return;
                }
              }

              const newComponent = new URLSearchParams()
              newComponent.append('name', this.inputComponent.name)
              newComponent.append('variable_name', this.inputComponent.variable_name)
              newComponent.append('type', this.inputComponent.type)
              for (var i = 0; i < this.attributs.length; i++) {
                newComponent.append(this.attributs[i].attribut, this.attributs[i].value)
              }
              for (var i = 0; i < this.options.length; i++) {
                if (this.options[i].option != '') {
                  newComponent.append('option[]', this.options[i].option)
                }
              }

              axios.post(this.url+'component/create', newComponent)
              .then((response) => {

                this.init()
                $('#modal-form').modal('hide');
                this.$swal({
                  position: 'top-end',
                  type: 'success',
                  title: 'Data saved successful',
                  showConfirmButton: false,
                  timer: 1500
                })
              })
              .catch((e) => {
              alert(this.inputComponent.variable_name+' alreay registered')
              })
            }
          })
      },

      deleteComponent(id){
        axios.delete(this.url+'component/delete/' + id)
        .then(response => {
          this.init()
          this.getConfig()
          this.getVarConfig()
        })
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
              this.deleteComponent(id)
              this.$swal({
                position: 'top-end',
                type: 'success',
                title: 'Data deleted successful',
                showConfirmButton: false,
                timer: 1500
              })
            }
          })
      },

      editComponent(id){
        this.errors.clear()

        this.options = [{
          option: '',
          countOption: 1
          }
        ]
        this.attributs = [{
          attribut: '',
          value: '',
          count: 1
          }
        ]
        var option = {}
        var attribut = {}
        this.inputComponent = {}
        this.modal_header = 'Edit Component'
        this.inputComponent.id = id
        this.inputComponent.type = this.components.find(x => x.id === id).attribut.type
        this.inputComponent.name = this.components.find(x => x.id === id).name
        this.inputComponent.variable_name = this.components.find(x => x.id === id).variable_name
        var check = this.variableConfig.find(x => x === this.inputComponent.variable_name)
        if (check !== undefined) {
          this.fromConfig = true
          this.dataConfig.push(this.inputComponent.variable_name)
        }

        if (this.inputComponent.type == 'radio' || this.inputComponent.type == 'checkbox' || this.inputComponent.type == 'dropdown') {
          option = this.components.find(x => x.id === id).option
        }
        attribut = this.components.find(x => x.id === id).attribut

        if (option !== "undefined") {
          for (var i = 0; i < option.length; i++) {
            this.options[i] = {
              option: option[i],
              countOption: i+1
              }
          }
        }

        var j = 0
        for (var key in attribut) {
          if (attribut.hasOwnProperty(key)) {
            if (key != "type") {
              this.attributs[j] = {
                attribut: key,
                value: attribut[key],
                count: j+1
                }
              j++;
            }
           }
        }
      },

      updateComponent(id){
        this.$validator.validate().then(valid => {
            if (valid) {
              if (this.fromConfig == false) {
                console.log(this.fromConfig)
                var check = this.variableConfig.find(x => x === this.inputComponent.variable_name)
                if (check !== undefined) {
                    console.log(check)
                    alert(this.inputComponent.variable_name+' is defined in the config. Change variable or check generate with config variable')
                    return;
                }
              }
              const newComponent = new URLSearchParams()
              newComponent.append('name', this.inputComponent.name)
              newComponent.append('variable_name', this.inputComponent.variable_name)
              newComponent.append('type', this.inputComponent.type)
              for (var i = 0; i < this.attributs.length; i++) {
                newComponent.append(this.attributs[i].attribut, this.attributs[i].value)
              }
              for (var i = 0; i < this.options.length; i++) {
                if (this.options[i].option != '') {
                  newComponent.append('option[]', this.options[i].option)
                }
              }

              axios.post(this.url+'component/update/'+id, newComponent)
              .then((response) => {

                this.init()
                this.getConfig()
                this.getVarConfig()
                $('#modal-form').modal('hide');
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
          })
      },

      onChange(event) {
        this.selected_type = event.target.value
        this.inputComponent.type = event.target.value

      },

      addAttribut() {
        this.count = this.attributs.length

        this.attributs.push({
          attribut: '',
          count: ++this.count
        });
      },

      addOption() {
        this.countOption = this.options.length
        this.options.push({
          option: '',
          countOption: ++this.countOption
        });
      },

      view(id) {
        this.view_data = this.components.find(x => x.id === id)

      },

      removeOption(index) {
        this.options.splice(index, 1)

      },

      removeAttribut(index) {
        this.attributs.splice(index, 1)

      },
    }
  }
</script>
<style>
  .VueTables__sortable  {
    min-width: 150px;
  }
  /* tr td:nth-child(4) {
    min-width: 150px;
  }
  tr td:nth-child(5) {
    min-width: 150px;
  }
  tr td:nth-child(2) {
    min-width: 100px;
    text-align: center;
  }
  tr td:nth-child(1) {
    min-width: 200px;
  } */
</style>
