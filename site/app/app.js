// components
import Api            from './api/Api.js'
import Auth           from './api/Auth.js'
import Nav            from './components/Nav.js'
import RespuestaModal from './components/RespuestaModal.js'
import Footer         from './components/Footer.js'

const Home                      = './components/Home.js'
const AvisoRetiro               = './components/AvisoRetiro.js'
const MaterialesAceptados       = './components/MaterialesAceptados.js'
const RegistroIngreso           = './components/RegistroIngreso.js'
const RegistroIngresoMateriales = './components/RegistroIngresoMateriales.js'
const MaterialesAceptadosAdmin  = './components/MaterialesAceptadosAdmin.js'
const MaterialesRecolectados    = './components/MaterialesRecolectados.js'
const AvisosRetiro              = './components/AvisosRetiro.js'
const LoginAdmin                = './components/LoginAdmin.js'
const RegistroAdmin             = './components/RegistroAdmin.js'
const CartonerosAdmin           = './components/CartonerosAdmin.js'

const NotFound = { template: '<div>Not found</div>' }
const BtnCancelar = {
  template: `
<button @click.prevent="$router.go(-1)"
  :class="classList"
  >{{label}}</button>`,
  props: {
    label: { default: 'Cancelar' },
    link: { default: true },
    classList: { default: 'btn btn-block w-100 py-2 btn-link' }
  }

}
const BsSpinner = {
  template: `
  <div class="d-flex justify-content-center">
    <div class="spinner-border text-success" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`
}
const BsAlert = {
  template: `
  <div class="alert alert-danger" role="alert">
    <slot></slot>
  </div>
  `
}

//router
const PATH_LOGIN = '/admin/login'
const PATH_HOME   = '/'

const routes = [
  { 
    path: PATH_HOME, 
    component: () => import(Home) 
  },
  { 
    path: '/ofrecer-materiales', 
    component: () => import(AvisoRetiro) 
  },
  { 
    path: '/materiales-aceptados', 
    component: () => import(MaterialesAceptados) 
  },
  { 
    path: PATH_LOGIN, 
    component: () => import(LoginAdmin) 
  },
  { 
    path: '/admin/registro', 
    component: () => import(RegistroAdmin) 
  },
  { 
    path: '/admin/registro-ingreso', 
    component: () => import(RegistroIngreso),
    children: [
      { 
        path: 'materiales', 
        component: () => import(RegistroIngresoMateriales), 
        props: true 
      }
    ]
  },
  {
    path: '/admin/administrar-materiales', 
    component: () => import(MaterialesAceptadosAdmin),
  },
  { 
    path: '/admin/administrar-cartoneros', 
    component: () => import(CartonerosAdmin) 
  },
  { 
    path: '/admin/materiales-recolectados', 
    component: () => import(MaterialesRecolectados) 
  },
  { 
    path: '/admin/avisos-retiro', 
    component: () => import(AvisosRetiro) 
  },
  { 
    path: '/:pathMatch(.*)*', name: 'NotFound', 
    component: NotFound
  },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
})

router.beforeEach(async (to, from) => {
  console.log('Routing to', to)
  const { path: toPath } = to 
  const { path: fromPath } = from
  const re = new RegExp(`^/admin`)
  if (toPath == PATH_LOGIN) {
    return Auth.isLoggedIn() ? PATH_HOME : true
  }
  else if (fromPath != PATH_LOGIN && !re.test(fromPath) && re.test(toPath)) {
    const canAccess = await Auth.isAdmin()
    console.log('VueRouter detectando acceso admin: resultado ', canAccess)
    return canAccess ? true : PATH_LOGIN
  }
  else {
    console.log('VueRouter permitiendo acceso a', to)
    return true
  }
})

// 5. Create and mount the root instance.
const app = Vue.createApp({
  data() {
    return {
      // usuario: {
      //   "usuario": "admin",
      //   "contrasenia": "$2y$10$zv0dhP9RM4VFCmz3VIuQQuSSWR6/y50ltcUVwpe4oq1r6oDtN1T4u",
      //   "email": "admin@admin"
      // },
      usuario: undefined,
      isLoggedIn: false,
      loading: false
    }
  },
  methods: {
    startLoading() { this.loading = true },
    stopLoading() { this.loading = false },
    login(u) { 
      this.usuario = u
      this.isLoggedIn = true
    },
    logout() {
      Api.fetch('admin/logout')
      this.usuario = undefined
      this.isLoggedIn = false
      this.$router.push('/')
      // this.$router.go()
    }
}
})
// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(router)

// register components
app.component('app-nav', Nav)
app.component('app-footer', Footer)
app.component('btn-cancelar', BtnCancelar)
app.component('bs-spinner', BsSpinner)
app.component('bs-alert', BsAlert)
app.component('respuesta-modal', RespuestaModal)

const vm = app.mount('#app')

export default vm