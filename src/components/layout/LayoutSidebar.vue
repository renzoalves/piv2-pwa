<template>
  <aside class="sidebar" :class="{ collapsed: collapse }">
    <div class="toggle-wrapper">
      <button @click="collapse = !collapse" class="toggle-collapse">
        <IconifyIcon icon="ic:round-keyboard-arrow-right" />
      </button>
    </div>

    <div class="close-menu-mobile">
      <button @click="collapse = !collapse" class="toggle-collapse">
        <IconifyIcon icon="ph:x-bold" />
      </button>
    </div>

    <nav>
      <div class="header">
        <router-link to="/">
          <img
            v-if="!collapse"
            class="logo"
            src="@/assets/images/white-logo.png"
            alt="Logotipo iMendes"
          />
          <img
            v-else
            class="logo small"
            src="@/assets/images/small-logo-white.png"
            alt="Logotipo iMendes"
          />
        </router-link>

        <router-link class="geral-link" to="/" title="Início">
          <IconifyIcon icon="ph:house" />

          <transition appear @enter="fadeIn">
            <span v-if="!collapse">Início</span>
          </transition>
        </router-link>
      </div>

      <div class="divider"></div>

      <div class="pages">
        <div class="top">
          <p :class="{ hide: collapse }" class="pages-title">Produtos</p>

          <router-link class="geral-link" to="/gestor-tributario/consulta" title="GT Consultas">
            <!-- <IconifyIcon icon="fluent-emoji-high-contrast:light-bulb" /> -->
            <!-- <IconifyIcon icon="material-symbols:barcode-reader-outline" /> -->
            <IconifyIcon icon="ph:barcode-bold"/>

            <transition appear @enter="fadeIn">
              <span v-if="!collapse">Gestor Tributário</span>
            </transition>
          </router-link>

          <router-link class="geral-link" to="/moostri"  title="Moostri">
            <IconifyIcon icon="gravity-ui:tag-dollar" />

            <transition appear @enter="fadeIn">
              <span v-if="!collapse">Moostri</span>
            </transition>
          </router-link>

          <router-link class="geral-link" to="/vacine" title="Vacine">
            <IconifyIcon icon="fluent-emoji-high-contrast:syringe" />

            <transition appear @enter="fadeIn">
              <span v-if="!collapse">Vacine</span>
            </transition>
          </router-link>

          <router-link class="geral-link" to="/calculadora" title="Calculadora Tributária">
            <IconifyIcon icon="ooui:mathematics" />

            <transition appear @enter="fadeIn">
              <span v-if="!collapse">Calc. Tributária</span>
            </transition>
          </router-link>

          <!-- <router-link class="geral-link" to="/">
            <IconifyIcon icon="fluent-emoji-high-contrast:light-bulb" />

            <transition appear @enter="fadeIn">
              <span v-if="!collapse">Gestor Integrado</span>
            </transition>
          </router-link> -->
        </div>

        <div v-if="userStore.user.hasAuth" class="bottom">          
          <router-link class="geral-link" to="/dashboard" title="Indicadores">
            <IconifyIcon icon="lucide:layout-dashboard" />

            <transition appear @enter="fadeIn">
              <span v-if="!collapse">Indicadores</span>
            </transition>
          </router-link>

          <button
            class="geral-link toggle-dropdown"
            :class="{ open: openDropdown }"
            @click.prevent="openMenu(false)"
          >
            <div class="center" title="Ajuda">
              <IconifyIcon icon="radix-icons:question-mark-circled" />

              <transition appear @enter="fadeIn">
                <span v-if="!collapse">Ajuda</span>
              </transition>

              <IconifyIcon
                class="dropdown-arrow"
                icon="material-symbols:keyboard-arrow-down-rounded"
                v-if="!collapse"
              />
            </div>

            <transition appear @enter="fadeIn">
              <div class="dropdown-menu-ajuda" v-if="openDropdown">
                <router-link
                  class="geral-link"
                  :class="{ 'no-padding-collapsed': collapse }"
                  to="/cookies"
                  title="Cookies"
                >
                  <IconifyIcon icon="lucide:cookie" />

                  <span v-if="!collapse">Cookies</span>
                </router-link>

                <router-link
                  class="geral-link"
                  :class="{ 'no-padding-collapsed': collapse }"
                  to="/lgpd"
                  title="LGPD"
                >
                  <IconifyIcon icon="octicon:law-24" />

                  <span v-if="!collapse">LGPD</span>
                </router-link>
              </div>
            </transition>
          </button>

          <router-link class="geral-link" to="/minha-conta" title="Configurações">
            <IconifyIcon icon="mdi:gear" />

            <transition appear @enter="fadeIn">
              <span v-if="!collapse">Configurações</span>
            </transition>
          </router-link>

          <LogoutButton
            size="20px"
            :text="!collapse ? 'Sair' : ''"
            class="geral-link"
            title="Sair"
          />
        </div>
      </div>

      <div class="divider"></div>

      <transition appear @enter="fadeIn">
        <span v-if="!collapse" class="version">v2.0 - Termos e Condições</span>
        <span v-else class="version" title="Versão do Sistema v2.0.20240312-1227" style="cursor: pointer;">v2.0</span>
      </transition>
    </nav>
  </aside>

  <div class="mobile-header">
    <div class="mobile-toggle">
      <button @click="collapse = !collapse" class="toggle-collapse">
        <IconifyIcon icon="charm:menu-hamburger" />
      </button>
    </div>

    <div class="mobile-logo">
      <img
        class="logo"
        src="@/assets/images/white-logo.png"
        alt="Logotipo iMendes"
      />
    </div>

    <div class="login-profile">
      <GeralButton
        v-if="!userStore.user.hasAuth"
        buttonType="anchor"
        text="Logar"
        to="/login"
      />

      <ProfileDropdown v-else>
        <router-link class="dropdown-link" to="/minha-conta">
          <IconifyIcon icon="bi:person-gear" />

          <span>Editar Perfil</span>
        </router-link>

        <button
          class="dropdown-link toggle-dropdown profile-dropdown"
          :class="{ open: openDropdownMenu }"
          @click.prevent="openMenu(true)"
        >
          <div class="center">
            <IconifyIcon icon="iconoir:question-mark" />

            <span>Ajuda</span>

            <IconifyIcon
              class="dropdown-arrow"
              icon="material-symbols:keyboard-arrow-down-rounded"
            />
          </div>

          <transition appear @enter="fadeIn">
            <div class="dropdown-menu-ajuda" v-if="openDropdownMenu">
              <router-link class="dropdown-link" to="/cookies">
                <IconifyIcon icon="lucide:cookie" />

                <span>Cookies</span>
              </router-link>

              <router-link class="dropdown-link" to="/lgpd">
                <IconifyIcon icon="octicon:law-24" />

                <span>LGPD</span>
              </router-link>
            </div>
          </transition>
        </button>

        <!-- <router-link class="dropdown-link" to="/contato">
          <IconifyIcon icon="ph:phone-light" />

          <div class="text">
            <span>Contato</span>
            <span class="phone">0000 0000</span>
          </div>
        </router-link> -->

        <LogoutButton size="20px" text="Sair" class="dropdown-link" />
      </ProfileDropdown>
    </div>
  </div>

  <div class="content">
    <slot></slot>
  </div>

  <GeralModal v-model="showTaxProfileModal">
    <div class="modal-title">
      <h3>Configurar Perfil</h3>
      <span>Realize a configuração de perfil nos campos abaixo</span>
    </div>

    <div class="tax-profile-wrapper">
      <TaxProfile
        :ufs="UFs"
        :tribs="Tribs"
        :cnaes="Cnaes"
        @closeModal="showTaxProfileModal = false"
      />
    </div>
  </GeralModal>
</template>

<script setup>
import gsap from "gsap";
import { useAuthStore } from "@/stores/user";
import { watch, ref } from "vue";
import helpers from "@/helpers";

const UFs = helpers.getUFs();
const Tribs = helpers.getTribs();
const Cnaes = helpers.getCnaes();

const userStore = useAuthStore();

const collapse = ref(true);
const openDropdown = ref(false);
const openDropdownMenu = ref(false);
const showTaxProfileModal = ref(false);

const sidebarWidth = ref("80px");

watch(collapse, () => {
  sidebarWidth.value = collapse.value ? "80px" : "350px";
});

const fadeIn = (el) => {
  gsap.fromTo(
    el,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 1.25,
    }
  );
};

const openMenu = (menu) => {
  if (menu) {
    openDropdownMenu.value = !openDropdownMenu.value;
  } else {
    openDropdown.value = !openDropdown.value;
  }
};
</script>

<style scoped lang="less">

.tax-profile-wrapper {
  margin-top: 20px;
}

.mobile-toggle,
.mobile-logo,
.close-menu-mobile {
  display: none;
}

.toggle-dropdown {
  background: none;
  border: none;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  height: 500px;
  max-height: 30px;
  align-items: start !important;
  .soft-transition(@time: 0.8s);

  .center {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  &.profile-dropdown {
    max-height: 40px;
    align-items: start;

    &.open {
      max-height: 160px;
    }

    .center {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .dropdown-arrow {
      border: none;
    }
  }

  &.open {
    max-height: 150px;

    .dropdown-arrow {
      transform: rotate(180deg);
    }
  }

  .dropdown-menu-ajuda {
    position: absolute;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .dropdown-arrow {
    .soft-transition(@time: 0.5s);
  }
}

.content {
  margin-left: calc(v-bind(sidebarWidth) + 65px);
  margin-right: 65px;
  margin-top: 100px;
  background: transparent;
  .soft-transition(@time: 0.5s);
}

.dropdown-link {
  color: @primaryGray;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  padding: 5px 0px 5px 35px;
  position: relative;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;

  &:before {
    content: "";
    background: linear-gradient(
      90deg,
      rgba(153, 146, 146, 0.3) 0%,
      rgba(196, 196, 196, 0) 100%
    );
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 100%;
    opacity: 0;
    .soft-transition(@time: 0.5s);
  }

  &:hover {
    &:before {
      opacity: 1;
    }
  }

  .iconify {
    padding: 5px;
    border: 1px solid @primaryGray;
    border-radius: 50%;
    font-size: 20px;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 5px;

    .phone {
      font-weight: 600;
      color: #000;
    }
  }
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 350px;
  height: 100vh;
  padding-right: 12px;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 100;
  .soft-transition(@time: 0.5s);

  &.collapsed {
    width: 80px;
    .toggle-wrapper {
      .toggle-collapse {
        transform: rotate(0deg);
      }
    }
  }

  .toggle-wrapper {
    position: absolute;
    right: 0px;
    top: 0px;
    background: @lightGray;
    height: 100%;
    width: 12px;
    z-index: 5;

    .toggle-collapse {
      position: absolute;
      right: 0px;
      top: 30px;
      background: #fff;
      border: 1px solid @primaryBlue;
      border-radius: 50%;
      display: flex;
      align-items: center;
      padding: 0px;
      cursor: pointer;
      transform: rotate(180deg);
      z-index: 3;
      .soft-transition(@time: 0.5s);

      .iconify {
        font-size: 24px;
      }
    }
  }
}

nav {
  background: @primaryBlue;
  width: 350px;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;

  .geral-link {
    display: flex;
    align-items: center;
    gap: 16px;
    color: #fff;
    font-size: 18px;
    text-decoration: none;
    position: relative;
    padding: 5px 0px 5px 25px;
    .soft-transition();

    &.no-padding-collapsed {
      padding: 5px 0px 5px 0px;

      &:after {
        height: 0px !important;
      }
    }

    &:after {
      background: @primaryYellow;
      content: "";
      height: 0px;
      position: absolute;
      left: 0px;
      width: 4px;
      .soft-transition(@time: 0.5s);
    }

    .iconify {
      font-size: 22px;
    }

    &:hover {
      color: @primaryYellow;
    }

    &.router-link-active {
      color: @primaryYellow;

      &:after {
        height: 100%;
      }
    }
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 20px 25px 0px 0px;

    .logo {
      width: 155px;
      height: 45px;
      padding-left: 12.5px;
      .soft-transition();

      &.small {
        width: 55px;
        height: 45px;
      }
    }
  }

  .divider {
    width: 95%;
    margin: 20px auto;
    height: 1px;
    background: @primaryGray;
  }

  .pages {
    display: flex;
    flex-direction: column;
    height: 75%;
    padding: 0px 25px 0px 0px;

    .top,
    .bottom {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .bottom {
      margin-top: auto;
      padding-top: 30px;
    }

    .pages-title {
      font-weight: 600;
      font-size: 18px;
      color: @primaryGray;
      padding-left: 25px;
      .soft-transition(@time: 0.5s);

      &.hide {
        opacity: 0;
      }
    }
  }

  .version {
    color: @lightGray;
    text-decoration: underline;
    font-size: 12px;
    padding-left: 25px;
  }
}

.login-profile {
  position: absolute;
  right: 65px;
  top: -70px;
}

@media only screen and (max-width: 1600px) {
  .sidebar {
    width: calc(v-bind(sidebarWidth) - 50px);
  }

  nav .pages {
    height: 70%;

    .top,
    .bottom {
      gap: 15px;
    }
  }

  .toggle-dropdown {
    .dropdown-menu-ajuda {
      gap: 15px;
    }
    &.open {
      max-height: 125px;
    }
  }

  .content {
    margin-left: calc(v-bind(sidebarWidth) + 65px);
  }
}

@media only screen and (max-width: 1366px) {
  nav .pages {
    height: 65%;
  }
}

@media only screen and (max-width: 1366px) and (max-height: 700px) {
  .toggle-dropdown {
    &.open {
      max-height: 105px;
    }
    .dropdown-menu-ajuda {
      gap: 10px;
    }
  }

  nav {
    .pages {
      height: 60%;

      .top,
      .bottom {
        gap: 10px;
      }
    }

    .geral-link {
      font-size: 16px;
      gap: 10px;

      .iconify {
        font-size: 18px;
      }
    }
  }
}

@media only screen and (max-width: 1366px) {
  .content {
    margin-left: calc(v-bind(sidebarWidth) + 35px);
    margin-right: 35px;
  }
}

@media only screen and (max-width: 768px) {
  .sidebar {
    padding-right: 0px;
    box-shadow: 0px 5px 20px #000;

    .toggle-wrapper {
      display: none;
    }

    &.collapsed {
      width: 0px;
      padding-right: 0px;
    }
  }

  .mobile-header {
    background: @primaryBlue;
    width: auto;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 0px 65px;

    .mobile-logo {
      display: unset;

      img {
        width: 200px;
      }
    }

    .login-profile {
      position: relative;
      top: unset;
      right: unset;

      .geral-button {
        font-size: 16px;
        padding: 10px 20px;
      }
    }
  }

  .dropdown-wrapper .dropdown-toggle .iconify {
    color: @primaryYellow;
    border: 1px solid @primaryYellow;
  }

  .mobile-toggle {
    display: flex;

    button {
      all: unset;
      cursor: pointer;

      .iconify {
        color: @primaryYellow;
        font-size: 38px;
      }
    }
  }

  nav .header .logo {
    display: none;
  }

  nav .pages {
    height: 80%;
  }

  .close-menu-mobile {
    display: unset;
    position: absolute;
    right: 15px;
    top: 20px;
    z-index: 10;

    button {
      all: unset;
      cursor: pointer;
      .iconify {
        color: @primaryYellow;
        font-size: 32px;
      }
    }
  }

  .content {
    margin-left: 65px;
    margin-top: 30px;
  }
}

@media only screen and (max-width: 600px) {
  .mobile-header {
    padding: 0px 35px;
  }

  .content {
    margin-left: 35px;
    margin-right: 35px;
  }

  .mobile-toggle button .iconify {
    font-size: 32px;
  }

  .login-profile {
    .geral-button {
      font-size: 14px;
      padding: 10px 20px;
    }
  }
}

@media only screen and (max-width: 450px) {
  .login-profile {
    .geral-button {
      padding: 10px 10px;
    }
  }

  .mobile-header .mobile-logo img {
    width: 150px;
  }

  .mobile-header {
    padding: 0px 15px;
  }

  .content {
    margin-left: 15px;
    margin-right: 15px;
  }
}
</style>
