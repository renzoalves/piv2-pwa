<script setup>
import { RouterView } from "vue-router";
import GeralAlert from "@/components/GeralAlert.vue";
</script>

<template>
  <div class="all-content">
    <GeralAlert />
    <RouterView />
  </div>
</template>

<style lang="less">
.all-content {
  position: relative;
  min-height: 89vh;
}
:root {
  --primaryBlue: #2e354c;
  --primaryYellow: #febd11;
  --primaryYellowDarken: #e2b12d;
  --darkYellow: #826310;
  --primaryGray: #707070;
  --lightGray: #ededed;
}

html,
body {
  height: 100% !important;
}

body {
  margin: 0;
  padding: 0;
  height: 100vh;
  background-color: var(--lightGray);
}

h1 {
  color: var(--primaryGray);
  font-size: 30px;
  line-height: 21.06px;
  margin: 0px 0px 15px;
}

label {
  margin-bottom: 5px !important;
}

h1 {
  margin-bottom: 10px !important;
}

.form-control {
  height: 2rem;
  font-size: 12px;
}

#cabecalho {
  margin: 0;
  padding: 0;
  top: 0;
}

label {
  display: inline-block;
  color: var(--primaryGray);
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
}

input[type="file"] {
  display: none;
}

thead,
tbody,
th {
  font-size: 12px;
}

table {
  box-shadow: 0px 1px 3px #00000029;
  background-color: #ffffff !important;
}

tbody {
  font-weight: normal;
}

td {
  font-size: 12px;
  color: var(--primaryBlue);
}
.card-body {
  border-radius: 5px;
}

.geral-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  border-radius: 3px;
  border: 3px solid @primaryBlue;
  box-sizing: border-box;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  background: @primaryBlue;
  text-decoration: none;
  cursor: pointer;

  &.link-button {
    padding: 10px 75px;
  }

  .soft-transition();

  &:focus {
    box-shadow: inset 0px 5px 5px #00000052;
    background: darken(@primaryGray, 10%);
  }
  &:hover {
    background: darken(@primaryBlue, 20%);
    border-color: darken(@primaryBlue, 20%);
  }
  &:disabled {
    opacity: 0.3;
    pointer-events: none;
    cursor: default;
    position: relative;

    .iconify {
      position: absolute;
      top: 50%;
      right: 5%;
      transform: translateY(-50%);
      font-size: 24px;
    }
  }
}

.primary {
  background: @primaryGray;
  border-color: @primaryGray;

  &:hover {
    background: darken(@primaryGray, 20%);
    border-color: darken(@primaryGray, 20%);
  }

  &:focus {
    box-shadow: inset 0px 5px 5px #00000052;
    background: darken(@primaryGray, 10%);
  }
}

.danger {
  background: #d80505;
  color: #fff;
  border-color: #d80505;

  &:hover {
    background: darken(#d80505, 20%);
    border-color: darken(#d80505, 20%);
  }

  &:focus {
    box-shadow: inset 0px 5px 5px #00000052;
    background: darken(#d80505, 10%);
  }
}

#loading {
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  position: fixed;
  display: block;
  z-index: 99;
  background: rgba(165, 165, 165, 0.5);
}

#loading-image {
  width: 75px;
  height: 75px;
  position: relative;
  top: 45%;
  left: 47%;
  z-index: 100;
}

.btnModalGeral {
  color: #f5f5f5 !important;
  background-color: #2e354c !important;
}

.btnModalPrimary {
  color: #f5f5f5 !important;
  background-color: #707070 !important;
}

i {
  cursor: pointer;
}

#piscofins,
#ampPC,
#ipi,
#icms,
#pdv,
#detalhes {
  overflow-x: auto;
}

.container-fluid {
  max-width: 1600px;
  font-family: "Roboto", sans-serif !important;
}

.mt-30 {
  margin-top: 30px;
}

.mt-10 {
  margin-top: 10px;
}

.card {
  padding: 15px 20px 0px 20px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px 0px rgba(167, 167, 167, 0.75);
}

.card-row div {
  color: var(--cor-11);
  padding: 5px 10px 5px 0px;
}

i {
  cursor: pointer;
}

#lupa > i,
#eye > i {
  position: relative;
  float: right;
  top: -25px; // adjust as needed
  left: -5px; // adjust as needed
}

.valor {
  float: left !important;
  cursor: text !important;
}
</style>
