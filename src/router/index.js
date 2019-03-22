import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import FormComponent from '@/components/FormComponent'
import LetterFormat from '@/components/LetterFormat'

Vue.use(Router)

export default new Router ({
  routes: [
    {
      path: '/',
      name : 'Hello',
      component: HelloWorld
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
