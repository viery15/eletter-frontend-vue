import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import FormComponent from '@/components/FormComponent'
import LetterFormat from '@/components/LetterFormat'

Vue.use(Router)

export default new Router ({
  routes: [
    {
      path: '/',
      name : 'Home',
      component: Home
    },
    {
      path: '/component',
      name : 'FormComponent',
      component: FormComponent
    },
    {
      path: '/format',
      name : 'LetterFormat',
      component: LetterFormat
    }
  ]
})
