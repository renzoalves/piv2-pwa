<template>
  <div class="input-wrapper">
    <input
      v-if="type != 'select' && type != 'textarea'"
      ref="input"
      :readonly="Readonly"
      :disabled="Disabled"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :value="inputValue"
      :class="{ customClass, readonly: Readonly }"
      :maxlength="maxlength"
      @input="updateInputValue($event.target)"
    />

    <button class="search-button" type="submit" v-if="searchiconSubmit">
      <IconifyIcon class="search-icon" icon="material-symbols:search-rounded" />
    </button>

    <IconifyIcon
      v-if="searchicon"
      class="search-icon"
      icon="material-symbols:search-rounded"
    />

    <button v-if="type == 'password'" @click.prevent="togglePassword">
      <IconifyIcon v-if="passwordState == 'hidden'" icon="fa6-solid:eye" />

      <IconifyIcon
        v-else-if="passwordState == 'show'"
        icon="fa6-solid:eye-slash"
      />
    </button>

    <select
      v-if="type == 'select'"
      ref="input"
      :name="name"
      @change="updateInputValue($event.target)"
      :disabled="Disabled"
      :class="{ customClass, disabled: Disabled }"
    >
      <option selected disabled value="">
        {{ placeholder ? placeholder : "Selecione uma opção" }}
      </option>

      <slot></slot>
    </select>

    <textarea
      v-if="type == 'textarea'"
      ref="input"
      :name="name"
      :readonly="Readonly"
      :disabled="Disabled"
      :class="{ customClass, readonly: Readonly }"
      :maxlength="maxlength"
      :placeholder="placeholder"
      @input="updateInputValue($event.target)"
    ></textarea>
  </div>
</template>

<script setup>
import { ref, onMounted, toRef } from "vue";

const props = defineProps({
  type: String,
  name: String,
  placeholder: String,
  selected: String,
  value: String,
  maxlength: String,
  searchicon: Boolean,
  searchiconSubmit: Boolean,
  customClass: String,
  Readonly: {
    type: Boolean,
    default: false,
  },
  Disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "show-inputs"]);

const passwordState = ref("hidden");
const input = ref();

const propValue = toRef(props, "value");
let inputValue = propValue.value;

onMounted(() => {
  emit("update:modelValue", input.value);
});

const updateInputValue = (target) => {
  emit("update:modelValue", target);
  inputValue = target.value;

  if (inputValue == "SIMPLES NACIONAL") {
    emit("show-inputs", true);
  } else {
    emit("show-inputs", false);
  }
};

const togglePassword = () => {
  passwordState.value = passwordState.value == "hidden" ? "show" : "hidden";

  if (passwordState.value == "show") {
    input.value.type = "text";
  }

  if (passwordState.value == "hidden") {
    input.value.type = "password";
  }
};
</script>

<style scoped lang="less">
.input-wrapper {
  width: 100%;
  position: relative;

  input,
  select,
  textarea {
    width: 100%;
    border: none;
    padding: 12px;
    background: #fff;
    color: @primaryBlue;
    font-size: 16px;
    border-radius: 8px 8px 0px 0px;
    box-sizing: border-box;
    border-bottom: 2px solid @primaryBlue;
    box-shadow: inset 0px 3px 6px #00000029 !important;

    &.invalid {
      border-bottom: 2px solid red;
    }

    &:focus,
    &.readonly,
    &.disabled {
      background: @lightGray;
      outline: none;
      box-shadow: inset 0px 3px 6px #00000029 !important;
    }

    &::placeholder {
      color: @primaryGray;
      opacity: 1;
      font-size: 14px;
    }

    &:-ms-input-placeholder {
      color: @primaryGray;
      font-size: 14px;
    }

    &::-ms-input-placeholder {
      color: @primaryGray;
      font-size: 14px;
    }

    &.search-table {
      background: #ffffffbf 0% 0% no-repeat padding-box !important;
      box-shadow: inset 0px 3px 6px #00000029 !important;
      border-bottom: 2px solid @primaryGray;
    }
  }

  .search-icon,
  .search-button .iconify {
    position: absolute;
    top: 55%;
    right: 10px;
    transform: translateY(-50%);
    font-size: 34px;
    color: @primaryBlue;
  }

  button {
    position: absolute;
    top: 55%;
    right: 10px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    .soft-transition();

    .iconify {
      color: @primaryGray;
      font-size: 15px;
    }

    &:hover {
      .iconify {
        color: #000;
      }

      transform: translateY(-50%) scale(1.05);
    }
  }
}

@media only screen and (max-width: 450px) {
  .input-wrapper input,
  .input-wrapper select,
  .input-wrapper textarea {
    padding: 13px 10px;
  }
}
</style>
