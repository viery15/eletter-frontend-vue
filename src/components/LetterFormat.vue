<template>
  <div>
    <br /><br />
    <button v-on:click="createData()" data-toggle="modal" data-target="#modal-format" class="btn btn-info btn-sm"><font-awesome-icon icon="plus"/> New format</button>
    <br /><br />
    <table class="table table-striped table-bordered" width="50%">
      <Tr>
        <th>Letter Name</th>
        <th>HTML Output</th>
        <th>Action</th>
      </Tr>
      <tr v-for="data in dataFormat">
        <td>{{data.name}}</td>
        <td><button v-on:click="viewData(data.id)" class="btn btn-md btn-info btn-sm" data-toggle="modal" data-target="#modal-view"><font-awesome-icon icon="eye"/></button></td>
        <td style="text-align:center">
          <button v-on:click="editComponent(data.id)" class="btn btn-md btn-warning btn-sm" data-toggle="modal" data-target="#modal-format"><font-awesome-icon icon="pen"/></button>
          <button v-on:click="destroy(data.id)" class="btn btn-md btn-danger btn-sm"><font-awesome-icon icon="trash"/></button>
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
            <div class="form-group">
              <label for="usr">Letter Name: * </label>
              <input v-validate="'required'" name="letter_name" v-model="letterName" autocomplete="off" type="text" class="form-control">
              <span style="color:red">{{ errors.first('letter_name') }}</span>
            </div>
            <div class="checkbox">
              <label><input type="checkbox" value="config" v-model="dataSource"> Generate data from config</label>
            </div>
            <br />
            <label for="usr">Letter Format: * </label><br />
            <span style="color:red">{{ errors.first('letter_format') }}</span>
            <div v-html="formatLetter"></div>
            <br /><br />
            <at :members="variable_name">
              <ckeditor @ready="onReady" name="letter_format" v-validate="'required'" :editor="editor" v-model="formatLetter" :config="editorConfig"></ckeditor>
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
  import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
  import axios from 'axios'
  import At from 'vue-at'

  export default {
    components: { At },
    nam: 'LetterFormat',
    data(){
      return {
        variable_name: [],
        editor: DecoupledEditor,
        formatLetter: '',
        checked: false,
        letterName: '',
        dataFormat: [],
        view_data:[],
        action:'',
        dataSource:'',
        editorConfig: {
            // toolbar: [ 'bold', 'italic', 'bulletedList', 'numberedList', 'list', 'Underline', 'Strike' ],
            height: 600
        }
      }
    },

    mounted(){
      this.init()
    },

    methods: {
      save(){
        this.$validator.validate().then(valid => {
            if (valid) {
              this.$validator.validate().then(valid => {
                  if (valid) {
                    const newComponent = new URLSearchParams()
                    newComponent.append('letter_name', this.letterName)
                    newComponent.append('html_output', this.formatLetter)
                    newComponent.append('data_source', this.dataSource)

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

      init(){
        this.loadVariable()
        this.loadData()
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
        console.log(this.dataFormat)
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
