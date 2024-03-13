<template>
  <transition @enter="fallAnimation">
    <div v-if="modelValue" class="modal" ref="modal">
      <div class="modal-body">
        <button
          class="close-modal"
          @click.prevent="$emit('update:modelValue', false)"
        >
          <IconifyIcon icon="ph:x-bold" />
        </button>

        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import gsap from "gsap";

defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);

const fallAnimation = (el) => {
  const body = el.querySelector(".modal-body");
  gsap.to(body, {
    top: "50%",
    duration: 0.5,
    opacity: 1,
  });
};
</script>

<style scoped lang="less">
.modal-title {
  text-align: center;

  &.text-only {
    text-align: start;

    span {
      font-size: 16px;
    }

    h3 {
      text-align: center;
      margin-bottom: 30px;
    }
  }

  h3 {
    font-size: 22px;
    color: @primaryBlue;
    margin-bottom: 20px !important;
  }
}
</style>

<style scoped lang="less">
.modal {
  opacity: 1;
  z-index: 10;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.4);

  &.smaller-modal .modal-body {
    min-width: 20%;
  }

  &.form-modal .modal-body {
    width: 60%;
  }

  .modal-body {
    background: #fff;
    max-height: 80%;
    width: auto;
    border-radius: 10px;
    padding: 50px;
    position: absolute;
    left: 50%;
    top: 30%;
    opacity: 1;
    transform: translate(-50%, -50%);
    overflow: scroll;

    .close-modal {
      all: unset;
      cursor: pointer;
      position: absolute;
      right: 7px;
      top: 7px;

      .iconify {
        font-size: 28px;
        color: @primaryBlue;
      }
    }
  }
}

@media only screen and (max-width: 1366px) {
  .modal .modal-body {
    padding: 25px;
  }
}
</style>
