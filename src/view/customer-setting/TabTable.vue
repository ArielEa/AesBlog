<template>
  <div>
    <Tabs type="card" @on-click="TabChange" v-model="defaultTabValue">
      <TabPane v-for="(tab) in tabs" :value="tab.value" :name="tab.value" :key="tab.label" :label="tab.label"/>
    </Tabs>
    <div>
      <i-button :type="btn.state" :value="btn.value" v-for="btn in btns" @click="btnsClick(btn.value)">
        {{ btn.label }}
      </i-button>
    </div>
    <Table
      :columns="columnsSource"
      :data="dataSource"
      :width="width"
      :loading="indexLoading"/>
  </div>
</template>

<script>
export default {
  name: "Tab-Table",
  data() {
    return {
      width: '1200px',
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
      defaultTabValue: "",
    }
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return new Array()
      }
    },
    dataSource: {
      type: Array,
      default() {
        return new Array()
      }
    },
    indexLoading: {
      type: Boolean,
      default: false
    },
    columnsSource: {
      type: Array,
      default() {
        return new Array()
      }
    },
    btns: {
      type: Array,
      default() {
        return new Array()
      }
    }
  },
  methods: {
    TabChange (value) {
      console.log(value)
    },
    btnsClick (value) {
      this.$emit('btnChange', value)
    }
  },
  created:function () {
  },
  mounted () {
    // 当前窗口长宽高
    var that = this
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        window.fullWidth = document.documentElement.clientWidth;
        that.windowHeight = window.fullHeight;  // 高
        that.windowWidth = window.fullWidth; // 宽
      })()
    };
  }
}
</script>

<style>

</style>
