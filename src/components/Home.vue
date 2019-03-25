<template>
  <div class="home">
    <br /><br />
    <div class="row">
      <div class="col-md-6  mx-auto">
        <div class="form-group row">
          <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">Letter Format: </label>
          <div class="col-md-9">
            <select v-on:change="onChange()" v-model="selectedFormat" name="type" class="form-control form-control-sm">
              <option value="" disabled selected>Select Letter Format</option>
              <option v-for="format in dataFormat" :value="format.id">{{format.name}}</option>
            </select>
          </div>
        </div>
        <form id="form-input">
        <div class="form-group row" v-for="input in inputForm">
          <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">{{input.name}}</label>
          <div class="col-md-9">
            <div v-html="input.html_basic"></div>
          </div>
        </div>
        </form>
        <div class="form-group row">
          <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm"></label>
          <div class="col-md-9">
            <button v-on:click="submit()" v-if="selectedFormat != ''" class="btn btn-primary">Submit</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data(){
    return {
      dataFormat: [],
      selectedFormat: '',
      inputForm: [],
      input:[],
      dataInput:[],
    }
  },

  mounted(){
    this.init()
  },

  methods: {
    init(){
      this.loadFormat()
    },

    submit(){
      this.dataInput = JSON.parse(JSON.stringify(jQuery('#form-input').serializeArray()))
      
      const newComponent = new URLSearchParams()
      newComponent.append('output', this.inputForm[0].output_template)
      for (var i = 0; i < this.dataInput.length; i++) {
        newComponent.append(this.dataInput[i].name, this.dataInput[i].value)
      }

      axios.post('http://127.0.0.1/e-letter/format/submit', newComponent)
      .then((response) => {
        console.log(response.data)

      })
      .catch((e) => {
        console.log(e)
      })

    },

    async loadFormat(){
      const response = await axios.get('http://127.0.0.1/e-letter/format/letterFormat')
      this.dataFormat = response.data

    },

    async onChange(){
      const response = await axios.get('http://127.0.0.1/e-letter/format/formInput/'+this.selectedFormat)
      this.inputForm = response.data
    }
  },

}
</script>
