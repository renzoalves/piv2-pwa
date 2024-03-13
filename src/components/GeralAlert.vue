<template>
  <transition @enter="fallAnimation">
    <div v-if="alert" class="alert-container">
      <div class="alert" :class="alert.type">
        {{ alert.message }}

        <IconifyIcon
          v-if="alert.type == 'alert-success'"
          class="alert-icon"
          icon="fa6-solid:check"
        />
        <IconifyIcon
          v-if="alert.type == 'alert-danger'"
          class="alert-icon"
          icon="jam:triangle-danger"
        />
        <button @click="alertStore.clear()" class="btn btn-link close">
          <IconifyIcon icon="fa6-solid:xmark" />
        </button>
      </div>
      <div class="loader">
        <div class="bar"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";
import gsap from "gsap";
import { storeToRefs } from "pinia";
import { useAlertStore } from "@/stores";

const alertStore = useAlertStore();
const { alert } = storeToRefs(alertStore);

const fallAnimation = (el) => {
  gsap.to(el, {
    top: 100,
    duration: 0.5,
    opacity: 1,
  });
};

const barWidth = ref(100 + "%");

watch(alert, (isShowing) => {
  if (isShowing) {
    let timeLeft = 5000;

    const interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 15;
        barWidth.value = (100 * timeLeft) / 5000 + "%";
      } else {
        clearInterval(interval);
      }
    }, 15);

    const timeout = setTimeout(() => {
      alertStore.clear();

      clearTimeout(timeout);
    }, 5000);
  }
});
</script>

<style scoped lang="less">
.alert-container {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999999;
  opacity: 0;

  .loader {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 10px;
    border-radius: 0px 0px 10px 10px;
    overflow: hidden;
    background: transparent;

    .bar {
      position: absolute;
      width: 100%;
      height: 100%;
      background: @primaryYellow;
      width: v-bind(barWidth);
    }
  }

  .alert {
    background: @primaryBlue;
    border-radius: 10px;
    border: 1px solid @primaryYellow;
    padding: 20px 40px 20px 20px;
    color: #fff;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: inset 0px 5px 5px #00000029;

    .alert-icon {
      font-size: 28px;
    }
    &.alert-success {
      .alert-icon {
        color: green;
      }
    }

    &.alert-danger {
      .alert-icon {
        color: red;
      }
    }

    button {
      position: absolute;
      top: 0px;
      right: 0px;
      border: none;
      background: none;
      cursor: pointer;
      color: #fff;

      .iconify {
        font-size: 26px;
        color: @primaryYellow;
      }

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
</style>
