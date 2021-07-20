<template>
  <a-button></a-button>
</template>

<script>
import Emitter from 'iview/src/mixins/emitter'
export default {
  name: 'TreeSelect',
  mixins: [Emitter],
  components: {},
  props: {
    value: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    loadData: Function
  },
  data () {
    return {
      isChangedByTree: true,
      isInit: true
    }
  },
  provide () {
    return {
      parent: this
    }
  },
  methods: {
  }
}
</script>

<style lang="less">
.tree-select {
  .ivu-select-dropdown {
    padding: 0 6px;
  }
}
</style>
