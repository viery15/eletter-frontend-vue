<template>
  <div class="home">
    <br /><br />
    <div class="row">
      <div class="col-md-6  mx-auto">
        <div class="form-group row">
          <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">Letter Format: </label>
          <div class="col-md-9">
            <!-- <select v-on:change="onChange()" v-model="selectedFormat" name="type" class="form-control form-control-sm">
              <option value="" disabled selected>Select Letter Format</option>
              <option v-for="format in dataFormat" :value="format.id">{{format.name}}</option>
            </select> -->
            <multiselect :value="selectedFormat" @input="onChange()" v-model="selectedFormat" :options="dataFormat" :multiple="false" :close-on-select="true" :clear-on-select="false" :preserve-search="true" placeholder="Select format" label="name" track-by="name" :preselect-first="false">
              <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>
            </multiselect>
          </div>
        </div>
        <form id="form-input">
          <div v-if="inputNik.label != ''">
            <div class="form-group row" >
              <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">{{inputNik.label}}</label>
              <div class="col-md-9">
                <!-- <select v-if="dataSource == 'single'" v-on:change="changeNik()" v-model="selectedNik" name="type" class="form-control form-control-sm">
                  <option value="" disabled selected>Select NIK</option>
                  <option v-for="(nik, key) in inputNik.nik" >{{nik.nik}}</option>
                </select> -->
                <multiselect v-if="dataSource == 'single'" @input="changeNik()" v-model="selectedNik" :options="inputNik.nik" :value="value" :multiple="false" :close-on-select="true" :clear-on-select="false" :preserve-search="true" placeholder="Pick some NIK" label="label" track-by="label" :preselect-first="false">
                  <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>
                </multiselect>
                <div v-if="dataSource == 'multiple'">
                  <div>
                    <multiselect @input="selectnik()" v-model="value" :options="inputNik.nik" :value="value" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Pick some NIK" label="label" track-by="label" :preselect-first="false">
                      <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>
                    </multiselect>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row" v-for="input in inputForm" v-if="input.for == 'single' && inputForm.data_source == 'multiple'">
            <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">{{input.name}}</label>
            <div class="col-md-9">
              <div v-html="input.html_basic"></div>
            </div>
          </div>

        <div v-for="value in value" v-if="inputForm.data_source == 'multiple'" >
          <b>{{value.nik}} - {{value.nama}}</b>
          <div class="form-group row" v-for="input in inputForm" v-if="input.for != 'single'">
            <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">{{input.name}}</label>
            <div class="col-md-9">
              <div v-html="input.html_basic"></div>
            </div>
          </div>
        </div>

        <div v-if="inputForm.data_source == 'single'">

        <div class="form-group row" v-for="input in inputForm">
          <!-- <div v-if="key != 'config' || key != 'data_source' || key != 'date'"> -->
            <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">{{input.name}}</label>
            <div class="col-md-9">
              <div v-html="input.html_basic"></div>
            </div>
          <!-- </div> -->
        </div>

        </div>

        <div v-if="inputForm.data_source == 'single'" style="margin-top:-70px;">
          <div class="form-group row" v-if="inputNik.label != '' && this.inputForm.date != null">
            <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">Date format</label>
            <div class="checkbox">
              <label><input type="checkbox" v-model="dateType"> Indonesian</label>
            </div>
          </div>
        </div>

        <div v-if="inputForm.data_source == 'multiple'">
          <div class="form-group row" v-if="inputNik.label != '' && this.inputForm.date != null">
            <label for="colFormLabelSm" class="col-md-3 col-form-label col-form-label-sm">Date format</label>
            <div class="checkbox">
              <label><input type="checkbox" v-model="dateType"> Indonesian</label>
            </div>
          </div>
        </div>

        </form>
        <div class="form-group row" style="margin-top:30px">
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
import { mapGetters } from 'vuex'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
import html2pdf from 'html2pdf.js'

export default {
  components: {
    Multiselect
  },
  name: 'Home',
  data(){
    return {
      dataFormat: [],
      selectedFormat: '',
      inputForm: [],
      input:[],
      dataInput:[],
      value: [],
      html: '',
      selectedNik:'',
      inputNik:[],
      dataNik:[],
      dataSource: '',
      dateType: true,
      url: 'http://127.0.0.1/e-letter/',
      // url: 'http://hrd.citratubindo.co.id/hr_program/giselle/application/index.php/',


    }
  },

  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  },

  mounted(){
    this.checkCurrentLogin()
    this.init()
    this.inputNik.label = ''
  },

  methods: {
    init(){
      this.loadFormat()
    },

    checkCurrentLogin(){
      if (!this.currentUser) {
        // this.$router.push('/?redirect=' + this.$route.path)
        this.$router.replace(this.$route.query.redirect || '/login')
      }
    },

    submit(){
      this.dataInput = JSON.parse(JSON.stringify(jQuery('#form-input').serializeArray()))
      // console.log(this.value)
      const newComponent = new URLSearchParams()
      newComponent.append('letter_id', this.inputForm[0].letter_format_id)
      newComponent.append('Indonesian_date', this.dateType)
      newComponent.append('data_source', this.dataSource)
      if (this.dataSource == 'single') {
        newComponent.append('nik', this.selectedNik.nik)
      }
      for (var i = 0; i < this.value.length; i++) {
        newComponent.append('nik[]', this.value[i].nik)
      }
      for (var i = 0; i < this.dataInput.length; i++) {
        if (this.dataInput[i].value == '' && this.dataInput[i].name != 'no_ktp') {
          alert('All field cannot empty!')
          return;
        }
        newComponent.append(this.dataInput[i].name, this.dataInput[i].value)
      }

      axios.post(this.url+'format/submit', newComponent)
      .then((response) => {
        this.html = response.data
        var element = document.getElementById('output')

          var opt = {
            margin : [10,10,17,10],
            filename: this.selectedFormat.name,
            image: {type: 'jpeg',quality: 0.98},
            html2canvas:  {scale:5, logging:true},

            jsPDF: {
              unit: 'mm',
              format: 'a4',
              orientation: 'portrait',
              // margin: {top: 10, bottom: 0, left: 10},
            }
          };


          if (this.selectedFormat.page_number == 'true') {
            html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
              var totalPages = pdf.internal.getNumberOfPages();

              for (i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.setTextColor(150);
                pdf.text('Page ' + i + ' of ' + totalPages, pdf.internal.pageSize.getWidth() - 30, pdf.internal.pageSize.getHeight() - 10);
              }
            }).save();
          }
          else {
            html2pdf().set(opt).from(element).save()
          }


      })
      .catch((e) => {
        console.log(e)
      })

    },

    async loadFormat(){
      const response = await axios.get(this.url+'format/letterFormat/'+this.currentUser.nik)
      this.dataFormat = response.data
    },

    async onChange(){
      this.clearForm()
      const response = await axios.get(this.url+'format/formInput/'+this.selectedFormat.id)
      this.inputForm = response.data
      console.log(response.data)
      if (response.data.config != null) {
        this.inputNik = response.data.config
        this.inputNik.label = 'NIK'
        this.dataSource = response.data.data_source

      }
    },

    async selectnik(value){
      // var currentIndex = ''
      var index = this.value.length
      if (this.value.length > 0) {
        var param = this.value[index-1].department
      }
      else {
        var param = 'all'
      }

      const response = await axios.get(this.url+'format/changeNik/'+param)

      this.inputNik.nik = response.data
      this.dataInput = JSON.parse(JSON.stringify(jQuery('#form-input').serializeArray()))
      var currentIndex = this.value

      var asd = 'nama'

      for (var key in this.inputForm) {
        var i = 0
          if (this.inputForm.hasOwnProperty(key)) {
            if (this.inputForm[key]['variable_name'] != null) {
              var varName = this.inputForm[key]['variable_name']
              // console.log(varName)
              $('input[name^="'+varName+'"]').each(function() {
                // console.log(varName)
                  $(this).val(currentIndex[i][varName])
                  i++
              })
            }
          }
      }

    },

    changeNik(){
      var findnik = this.inputNik.nik.find(x => x.nik === this.selectedNik.nik)
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
<style>
.pageNumber {
    display: table-footer-group;
}

.pageNumber:after {
    counter-increment: page;
    content:"Halaman " counter(page);
    left: 0;
    top: 100%;
    white-space: nowrap;
    z-index: 20;
    -moz-border-radius: 5px;
    -moz-box-shadow: 0px 0px 4px #222;
    background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);
}
.content {
    display: table;
}
@media all {
 .page-break  { display: none; }
}

@media print {
 .page-break  { display: block; page-break-before: always; }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
