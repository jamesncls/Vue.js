<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Importar estilos globais
import './assets/styles/global.css'
import './assets/styles/mobile.css'
</script>

<style>
#app {
  min-height: 100vh;
  width: 100%;
}

/* Garantir que o body ocupe toda a tela */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Estilos para mobile - esconder scrollbar horizontal quando não necessária */
@media (max-width: 768px) {
  body {
    overflow-x: hidden;
  }
}
</style>
