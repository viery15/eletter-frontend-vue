<template>
  <div>
    <br /><br />
    <button v-on:click="errors.clear()" data-toggle="modal" data-target="#modal-format" class="btn btn-info btn-sm"><font-awesome-icon icon="plus"/> New format</button>
    <br /><br />
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
            <br />
            <label for="usr">Letter Format: * </label><br />
            <span style="color:red">{{ errors.first('letter_format') }}</span>
            <div v-html="formatLetter"></div>
            <br /><br />
            <at :members="variable_name">
              <ckeditor name="letter_format" v-validate="'required'" :editor="editor" v-model="formatLetter" :config="editorConfig"></ckeditor>
            </at>

          </div>
          <div class="modal-footer">
            <button v-on:click="save()" class="btn btn-success">Save</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- END OF MODAL FORM FORMAT LETTER -->
  </div>

</template>

<script>
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
  import axios from 'axios'
  import At from 'vue-at'
  export default {
    components: { At },
    nam: 'LetterFormat',
    data(){
      return {
        variable_name: [],
        editor: ClassicEditor,
        formatLetter: '',
        letterName: '',
        editorConfig: {
            // toolbar: [ 'bold', 'italic', 'bulletedList', 'numberedList', 'list', 'Underline', 'Strike' ],
            height: 800
        }
      }
    },

    mounted(){
      this.loadVariable()
    },

    methods: {
      save(){
        this.$validator.validate().then(valid => {
            if (valid) {

            }
        })
      },

      async loadVariable(){
        const response = await axios.get('http://127.0.0.1/e-letter/component/variableName')
        this.variable_name = response.data
        console.log(this.variable_name)
      },

      resetForm(){
        this.errors.clear()
      }
    }
  }
</script>
