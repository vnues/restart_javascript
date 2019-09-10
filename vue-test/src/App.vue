<template>
  <div id="app">
    <div>{{ this.message }}</div>
  </div>
</template>

<script>
export default {
  name: "app",
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
