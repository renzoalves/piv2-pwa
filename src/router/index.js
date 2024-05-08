import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/user";
import { useAlertStore } from "@/stores/alert";

const Home = () => import("@/views/HomeView.vue");
const Login = () => import("@/views/LoginView.vue");
const MyAccount = () => import("@/views/MyAccount.vue");
const Dashboard = () => import("@/views/DashboardView.vue");
const TaxManagerTable = () => import("@/views/TaxManagerTable.vue");
const MoostriTable = () => import("@/views/MoostriTable.vue");
const Vacine = () => import("@/views/Vacine.vue");
const GTIntegrado = () => import("@/views/GTIntegrado.vue");
const CookiesView = () => import("@/views/CookiesView.vue");
const LGPDView = () => import("@/views/LGPDView.vue");
const ContactView = () => import("@/views/ContactView.vue");
const ContractView = () => import("@/views/ContractView.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      metaTags: [{ name: "Portal iMendes - Login", },],
    },
    {
      path: "/login/:id/:info",
      name: "LoginVerificarEmail",
      component: Login,
      metaTags: [{ name: "Portal iMendes - Verificação de E-mail", },],
    },
    {
      path: "/login/:id/:emailEncrip/:info",
      name: "LoginAlterarSenha",
      component: Login,
      metaTags: [{ name: "Portal iMendes - Alteração de Senha", },],
    },
    {
      path: "/",
      name: "Home",
      component: Home,
      metaTags: [{ name: "Portal iMendes - Home", },],
    },
    {
      path: "/minha-conta",
      name: "Minha Conta",
      component: MyAccount,
      metaTags: [{ name: "Portal iMendes - Minha Conta", },],
    },
    {
      path: "/gestor-tributario/consulta",
      props: (route) => ({ query: route.query.desc }),
      name: "Consulta Gestor Tributário",
      component: TaxManagerTable,
      metaTags: [{ name: "Portal iMendes - Consulta Gestor Tributário", },],
    },
    {
      path: "/moostri",
      name: "Consulta Moostri",
      component: MoostriTable,
      metaTags: [{ name: "Portal iMendes - Consulta Moostri", },],
    },
    {
      path: "/vacine",
      name: "Vacine",
      component: Vacine,
      metaTags: [{ name: "Portal iMendes - Vacine", },],
    },
    {
      path: "/gestor-integrado",
      name: "Gestor Integrado",
      component: GTIntegrado,
      metaTags: [
        {
          name: "Portal iMendes - GT Integrado",
        },
      ],
    },
    // {
    //   path: "/dashboard",
    //   name: "Dashboard Gestor",
    //   component: Dashboard,
    //   metaTags: [ { name: "Portal iMendes - Dashboard Gestor", }, ],
    // },
    {
      path: "/cookies",
      name: "Política de Cookies",
      component: CookiesView,
      metaTags: [{ name: "Portal iMendes - Política de Cookies", },],
    },
    {
      path: "/lgpd",
      name: "LGPD",
      component: LGPDView,
      metaTags: [{ name: "Portal iMendes - LGPD", },],
    },
    {
      path: "/contato",
      name: "Entre em Contato",
      component: ContactView,
      metaTags: [{ name: "Portal iMendes - Contato", },],
    },
    {
      path: "/contrato",
      name: "Soluções",
      component: ContractView,
      metaTags: [{ name: "Portal iMendes - Soluções", },],
    },
    {
      path: "/calculadora",
      name: "Calculadora",
      component: Home,
      beforeEnter() {
        window.open('https://app.powerbi.com/view?r=eyJrIjoiMWQyYzUwMDAtOGFlMi00Yjg3LThiN2MtOTc1NWNkMDJmYWE2IiwidCI6IjExODM3MzNkLTJjZTMtNDdhMi1hNmQzLTkyZjA1ODJiMDAwMiJ9', '_blank');
      },
    },
  ],
});

router.beforeEach(async (to) => {
  const alertStore = useAlertStore();
  alertStore.clear();

  const auth = useAuthStore();

  const publicPages = [
    "/login",
    "/",
    "/gestor-tributario/consulta",
    "/contrato",
    "/calculadora",
  ];

  if (to.path.substring(0, 6) === '/login' && to.path.length > 6) {
    publicPages.push(to.path);
  }

  const authRequired = !publicPages.includes(to.path);

  if (auth.user.hasAuth && to.path == "/login") {
    return "/";
  }

  if (authRequired && !auth.user.hasAuth) {
    auth.returnUrl = to.fullPath;
    return "/login";
  }

  document.title = `${import.meta.env.VITE_APP_TITLE} - ${to.name}`;
});

export default router;
