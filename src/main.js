import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VeeValidate from 'vee-validate'
import VueSweetalert2 from 'vue-sweetalert2'
import CKEditor from '@ckeditor/ckeditor5-vue'
import $ from 'jquery'
import 'bootstrap'
import 'popper.js'
import './assets/app.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import store from './store'

require('froala-editor/js/froala_editor.pkgd.min')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('font-awesome/css/font-awesome.css')
require('froala-editor/css/froala_style.min.css')

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'
Vue.use(VueFroala)

window.$ = window.jQuery = require('jquery')

library.add(faCoffee, faTrash, faEye, faPen, faPlus, faWindowClose)
// library.add(faTrash)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.component('Navbar', require('./components/Navbar.vue').default)
Vue.use(VeeValidate)
Vue.use(VueSweetalert2)
Vue.use( CKEditor )

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
