import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import FormComponent from '@/components/FormComponent'
import LetterFormat from '@/components/LetterFormat'
import Login from '@/components/Login'
import Logout from '@/components/Logout'

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
    },
    {
      path: '/login',
      name : 'Login',
      component: Login
    },
    {
      path: '/logout',
      name : 'Logout',
      component: Logout
    }
  ]
})
