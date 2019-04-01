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
          <div v-if="inputNik.label != ''">
            <div class="form-group row" >
              <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">{{inputNik.label}}</label>
              <div class="col-md-9">
                <select v-on:change="changeNik()" v-model="selectedNik" name="type" class="form-control form-control-sm">
                  <option value="" disabled selected>Select NIK</option>
                  <option v-for="(nik, key) in inputNik.nik" >{{nik.nik}}</option>
                </select>
              </div>
            </div>
          </div>

        <div class="form-group row" v-for="input in inputForm">
          <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">{{input.name}}</label>
          <div class="col-md-9">
            <div v-html="input.html_basic"></div>
          </div>
        </div>
        <div class="form-group row" v-if="inputNik.label != ''">
          <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">Date format</label>
          <div class="checkbox">
            <label><input type="checkbox" v-model="dateType"> Indonesian date</label>
          </div>
        </div>

        </form>
        <div class="form-group row">
          <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm"></label>
          <div class="col-md-9">
            <button v-on:click="submit()" v-if="selectedFormat != ''" class="btn btn-primary">Submit</button>
          </div>
        </div>
        <br /><br />
      </div>
    </div>

    <div id="modalss" class="modal fade" role="dialog">
      <div class="modal-dialog modal-lg">
        <!-- Modal content-->
        <div class="modal-content ">
          <div class="modal-header">

            <button type="button" class="pull-right close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div id="output">
              <div v-for="html in html">
                <div v-html="html"></div>
                <div class="html2pdf__page-break"></div>
              </div>
            </div>
            <!-- <div id="output" v-html="html"></div> -->

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
// import jsPDF from 'jspdf'
import html2pdf from 'html2pdf.js'

export default {
  name: 'Home',
  data(){
    return {
      dataFormat: [],
      selectedFormat: '',
      inputForm: [],
      input:[],
      dataInput:[],
      html: '',
      selectedNik:'',
      inputNik:[],
      dataNik:[],
      dateType: true,
    }
  },

  mounted(){
    this.init()
    this.inputNik.label = ''
  },

  methods: {
    init(){
      this.loadFormat()
    },

    submit(){
      this.dataInput = JSON.parse(JSON.stringify(jQuery('#form-input').serializeArray()))

      const newComponent = new URLSearchParams()
      newComponent.append('letter_id', this.inputForm[0].letter_format_id)
      newComponent.append('Indonesian_date', this.dateType)
      for (var i = 0; i < this.dataInput.length; i++) {
        if (this.dataInput[i].value == '') {
          alert('All field cannot empty!')
          return;
        }
        newComponent.append(this.dataInput[i].name, this.dataInput[i].value)
      }

      axios.post('http://127.0.0.1/e-letter/format/submit', newComponent)
      .then((response) => {
        this.html = response.data
        var element = document.getElementById('output');
        console.log(this.html)
          var opt = {
            margin: 13,
            filename: 'myfile.pdf',
            image: {type: 'jpeg',quality: 0.98},
            html2canvas:  { dpi: 192, letterRendering: true },
            jsPDF: {
              unit: 'mm',
              format: 'a4',
              orientation: 'portrait'
            }
          };

          html2pdf().set(opt).from(element).save()


          // this.html = ''
        // let pdfName = 'test'
        // var doc = new jsPDF({
        // 	orientation: 'p',
        // 	unit: 'mm',
        // 	format: 'a4',
        // })
        // doc.fromHTML(
        //   response.data,
        //   20,
        //   20,
        //
        //   {
        //     'width': 170,
        //   }
        // )
        // doc.save(pdfName + '.pdf')
        // this.html = ''
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
      this.clearForm()
      const response = await axios.get('http://127.0.0.1/e-letter/format/formInput/'+this.selectedFormat)
      this.inputForm = response.data

      if (response.data.config != null) {
        this.inputNik = response.data.config
        this.inputNik.label = 'NIK'
        // console.log(this.inputNik)
      }
    },

    changeNik(){
      var findnik = this.inputNik.nik.find(x => x.nik === this.selectedNik)
      for(var i in findnik){
        if (i != 'nik') {
          $('#'+i).val(findnik[i])
        }
      }
    },

    clearForm(){
      this.inputNik.label = ''
    }
  },

}
</script>
