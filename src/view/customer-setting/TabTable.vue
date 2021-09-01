<!-- eslint-disable -->
<template>
  <div class="body">
    <div class="main" :style="windowStyle">
      <Tabs type="card" @on-click="TabChange" v-model="defaultTabValue">
        <TabPane v-for="(tab) in tabs" :value="tab.value" :name="tab.value" :key="tab.label" :label="tab.label"/>
      </Tabs>
      <div>
        <i-button :type="btn.state" :value="btn.value" v-for="(btn, index) in btns" @click="btnsClick(btn.value)">
          {{ btn.label }}
        </i-button>
      </div>
      <Table
        :columns="columnsSource"
        :data="dataSource"
        :width="width"
        :loading="indexLoading"/>
    </div>
    <div class="footer" style="height: 30px">
      <Page :total="page" show-sizer show-elevator show-total @on-change="clickPage" @on-page-size-change="changePageSize" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Tab-Table',
  data () {
    return {
      width: '1200px',
      windowWidth: 0,
      windowHeight: 0,
      defaultTabValue: '',
      windowStyle: windowData
    }
  },
  props: {
    tabs: {
      type: Array,
      default () {
        return []
      }
    },
    dataSource: {
      type: Array,
      default () {
        return []
      }
    },
    indexLoading: {
      type: Boolean,
      default: false
    },
    columnsSource: {
      type: Array,
      default () {
        return []
      }
    },
    btns: {
      type: Array,
      default () {
        return []
      }
    },
    page: {
      type: Number,
      default: 0
    }
  },
  methods: {
    TabChange (value) {
      console.log(value)
    },
    btnsClick (value) {
      this.$emit('btnChange', value)
    },
    clickPage(value) {
      console.log("当前页", value)
    },
    changePageSize(value) {
      console.log("每页条数", value)
    }
  },
  created: function () {
  },
  mounted () {
    // 当前窗口长宽高
    var that = this
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight
        window.fullWidth = document.documentElement.clientWidth
        windowData.height = window.fullHeight - 30 + 'px' // 高
        windowData.width = window.fullWidth + 'px' // 宽
      })()
    }
  }
}
const windowData = {
  height: '0px'
}
</script>

<style>
.footer {
  position: fixed;
  bottom: 5px;
  right: 5px;
  height: 30px;
}
</style>
