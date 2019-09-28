<template>
  <div id="app">
    <span>{{ message }}</span>
    <Test />
  </div>
</template>

<script>
import Test from "./components/Test.vue";
export default {
  name: "app",
  components: {
    Test
  },
  data() {
    return {
      message: "hello world❗️❗️❗️",
      obj: {
        msg: "11"
      }
    };
  },
  created() {
    console.log("created父组件App被执行了");
  },
  created() {
    console.log("created父组件App被执行了12312312312");
  },
  mounted() {
    console.log("mounted父组件App被执行了");
    console.log(this);
    console.log(this.message);
    console.log(this.obj);
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
