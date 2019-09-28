<template>
  <div class="test" id="test">
    {{ test }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      test: "这是测试测试测试测试测试"
    };
  },
  created() {
    console.log("created子组件test被执行了");
    this.consOK();
  },
  consOK() {
    console.log("testokokokokokokokok");
  },
  mounted() {
    console.log("mounted子组件test被执行了");
  }
};
</script>
