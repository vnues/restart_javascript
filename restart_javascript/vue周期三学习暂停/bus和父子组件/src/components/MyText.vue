<template>
  <div class="my-text">
    <div>{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "MyText",
  data() {
    return {
      text: ""
    };
  },
  created() {
    // 相当于@xxxx=xxxx 绑定了一个事件
    // 监听
    this.$bus.$on("getValue", value => {
      this.text = value;
    });
  }
};
</script>

<style>
.my-text {
  width: 200px;
  height: 200px;
  background: lightblue;
  margin: 200px auto;
  text-align: center;
  line-height: 200px;
  color: red;
}
</style>
