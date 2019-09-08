<template>
  <div id="app">
    <div>{{ this.message }}</div>
    <div class="app-message">
      <span> {{ message }}</span>
      <span> {{ message }}</span>
    </div>
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
export default {
  name: "app",
  components: {
    HelloWorld
  },
  data() {
    return {
      message: "hello world❗️❗️❗️"
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
