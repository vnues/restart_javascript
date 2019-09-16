<template>
  <div id="new">
    <span>{{ message }}</span>
    <Test />
  </div>
</template>

<script>
export default {
  name: "new",
  data() {
    return {
      message: "new Vue vvvvvvv ❗️❗️❗️"
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
