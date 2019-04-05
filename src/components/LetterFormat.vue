<template>
  <div>
    <br /><br />
    <button v-on:click="createData()" data-toggle="modal" data-target="#modal-format" class="btn btn-info btn-sm"><font-awesome-icon icon="plus"/> New format</button>
    <br /><br />
    <table class="table table-striped table-bordered" width="50%">
      <Tr>
        <th>Letter Name</th>
        <th style="text-align:center">Action</th>
      </Tr>
      <tr v-for="data in dataFormat">
        <td>{{data.name}}</td>

        <td style="text-align:center">
          <button v-on:click="viewData(data.id)" class="btn btn-md btn-info btn-sm" data-toggle="modal" data-target="#modal-view"><font-awesome-icon icon="eye"/></button>
          <button style="margin-left:5px" v-on:click="editComponent(data.id)" class="btn btn-md btn-warning btn-sm" data-toggle="modal" data-target="#modal-format"><font-awesome-icon icon="pen"/></button>
          <button style="margin-left:5px" v-on:click="destroy(data.id)" class="btn btn-md btn-danger btn-sm"><font-awesome-icon icon="trash"/></button>
        </td>
      </tr>

    </table>
    <!-- MODAL FORM FORMAT LETTER -->
    <div id="modal-format" class="modal fade" role="dialog">
      <div class="modal-dialog modal-lg">
        <!-- Modal content-->
        <div class="modal-content ">
          <div class="modal-header">
            <h5 class="modal-title">New Format Letter</h5>
            <button type="button" class="pull-right close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="checkbox">
              <label><input type="checkbox" v-model="parent"> Parent</label>
            </div>
            <div class="form-group" v-if="parent == true">
              <label for="usr">Letter Name: * </label>
              <input v-validate="'required'" name="letter_name" v-model="letterName" autocomplete="off" type="text" class="form-control">
              <span style="color:red">{{ errors.first('letter_name') }}</span>
            </div>
            <div class="form-group" v-if="parent == false">
              <label for="usr">Parent: * </label>
              <select v-model="selectedParent" name="parent" class="form-control form-control-sm">
                <option value="" disabled selected>Select Parent</option>
                <option v-for="parent in parents" :value="parent.id">{{parent.name}}</option>
              </select>
              <span style="color:red">{{ errors.first('parent') }}</span>
            </div>
            <!-- <div class="checkbox">
              <label><input type="checkbox" value="config" v-model="dataSource"> Generate with config variable</label>
            </div> -->

            <div class="form-check-inline">
              <label class="form-check-label">
                <input v-model="dataSource" type="radio" class="form-check-input" name="optradio" value="">Without generate
              </label>
            </div>
            <div class="form-check-inline">
              <label class="form-check-label">
                <input v-model="dataSource" type="radio" class="form-check-input" name="optradio" value="single">Generate with single nik
              </label>
            </div>
            <div class="form-check-inline disabled">
              <label class="form-check-label">
                <input v-model="dataSource" type="radio" class="form-check-input" name="optradio" value="multiple">Generate with multiple nik
              </label>
            </div>

            <br /><br />
            <label for="usr">Letter Format: * </label><br />
            <span style="color:red">{{ errors.first('letter_format') }}</span>
            <!-- <div v-html="formatLetter"></div>
            <br /><br /> -->

            <!--
              <ckeditor @ready="onReady" style="border:1px solid lightgray;margin-top:5px;" name="letter_format" v-validate="'required'" :editor="editor" v-model="formatLetter" :config="editorConfig"></ckeditor>
            <br /><br /> -->
            <at :members="variable_name">
              <froala :tag="'textarea'" :config="config" name="letter_format" v-validate="'required'" v-model="formatLetter">Init text</froala>
            </at>

          </div>
          <div class="modal-footer">
            <button v-if="action==='save'" v-on:click="save()" class="btn btn-success">Save</button>
            <button v-if="action==='update'" v-on:click="update()" class="btn btn-success">Update</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- END OF MODAL FORM FORMAT LETTER -->

    <div id="modal-view" class="modal fade" role="dialog">
      <div class="modal-dialog modal-lg">
        <!-- Modal content-->
        <div class="modal-content ">
          <div class="modal-header">
            <h5 class="modal-title">{{view_data.name}}</h5>
            <button type="button" class="pull-right close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div style="text-align:right">
              <input type="checkbox" id="checkbox" v-model="checked"/> HTML
            </div>
            <br /><br />

            <div v-if="checked===false" v-html="view_data.output_template"></div>
            <div v-if="checked===true">{{view_data.output_template}}</div>

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
  // import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
  import { mapGetters } from 'vuex'
  import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
  import axios from 'axios'
  import At from 'vue-at'

  export default {
    components: { At },
    nam: 'LetterFormat',
    data(){
      return {
        variable_name: [],
        parent: true,
        editor: DecoupledEditor,
        formatLetter: '',
        checked: false,
        letterName: '',
        selectedParent: '',
        dataFormat: [],
        parents: [],
        view_data:[],
        model: '',
        config: {
          placeholderText: 'Edit Your Content Here!',
          charCounterCount: false
        },
        action:'',
        dataSource:'',
        editorConfig: {
            tabSpaces: 4,
            // toolbar: [ 'bold', 'italic', 'bulletedList', 'numberedList', 'list', 'Underline', 'Strike' ],
            height: 600
        }
      }
    },

    mounted(){
      this.checkCurrentLogin()
      this.init()
    },

    computed: {
      ...mapGetters({ currentUser: 'currentUser' })
    },

    methods: {
      save(){
        this.$validator.validate().then(valid => {
            if (valid) {
              this.$validator.validate().then(valid => {
                  if (valid) {
                    const newComponent = new URLSearchParams()
                    if (this.parent == true) {
                        newComponent.append('letter_name', this.letterName)
                    }
                    else if (this.parent == false) {
                      newComponent.append('parent_id', this.selectedParent)
                    }

                    newComponent.append('html_output', this.formatLetter)
                    newComponent.append('data_source', this.dataSource)
                    newComponent.append('parent', this.parent)

                    axios.post('http://127.0.0.1/e-letter/format/create', newComponent)
                    .then((response) => {
                      this.init()
                      $('#modal-format').modal('hide');
                      this.resetForm()
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
                })
            }
        })
      },

      checkCurrentLogin(){
        if (!this.currentUser || this.currentUser.admin !== 'admin') {
          // this.$router.push('/?redirect=' + this.$route.path)
          this.$router.replace(this.$route.query.redirect || '/login')
        }
      },

      init(){
        this.loadVariable()
        this.loadData()
        this.loadParent()
      },

      onReady( editor )  {
          // Insert the toolbar before the editable area.
          editor.ui.getEditableElement().parentElement.insertBefore(
              editor.ui.view.toolbar.element,
              editor.ui.getEditableElement()
          );
      },

      createData(){
        this.errors.clear()
        this.action = 'save'
      },

      deleteComponent(id){
        axios.delete('http://127.0.0.1/e-letter/format/delete/' + id)
        .then(response => {
          this.init()
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
              this.init()
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
        this.action = 'update'
        this.letterName = this.dataFormat.find(x => x.id === id).name
        this.formatLetter = this.dataFormat.find(x => x.id === id).output_template
      },

      update(id){
        this.$validator.validate().then(valid => {
            if (valid) {
              const newComponent = new URLSearchParams()
              newComponent.append('letter_name', this.letterName)
              newComponent.append('html_output', this.formatLetter)

              axios.post('http://127.0.0.1/e-letter/format/update/'+id, newComponent)
              .then((response) => {
                // this.init()
                // $('#modal-form').modal('hide');
                // this.$swal({
                //   position: 'top-end',
                //   type: 'success',
                //   title: 'Data updated successful',
                //   showConfirmButton: false,
                //   timer: 1500
                // })
              })
              .catch((e) => {
                console.log(e)
              })
            }
          })
      },

      async loadVariable(){
        const response = await axios.get('http://127.0.0.1/e-letter/component/variableName')
        this.variable_name = response.data
      },

      async loadData(){
        const response = await axios.get('http://127.0.0.1/e-letter/format')
        this.dataFormat = response.data
      },

      async loadParent(){
        const response = await axios.get('http://127.0.0.1/e-letter/format/parent')
        this.parents = response.data
      },

      viewData(id) {
        this.view_data = this.dataFormat.find(x => x.id === id)
      },

      resetForm(){
        this.errors.clear()
        this.letterName = ''
        this.formatLetter = ''
      }
    }
  }
</script>
