<template>
  <div class="input">
    <Myinput type="text" @keyup="handleKeyUp" @getChange="HandleGetChange" />
  </div>
</template>

<script>
export default {
  name: "Input",
  created() {
    this.$on("getChange", function(value) {
      console.log("value", value);
    });
  },
  methods: {
    handleKeyUp(e) {
      this.$emit("getChange1", e.target.value);
    },
    HandleGetChange(params) {
      console.log("params", params);
    }
  }
};
</script>
