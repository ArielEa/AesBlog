import _ from 'lodash'

export default {
  data () {
    return {
      api: null,
      tabs: [{
        title: '全部',
        name: 'all'
      }],
      auto: true,
      tabsKey: 'tab',
      tabIndex: 0,
      curTab: null,
      curTabKey: '',
      loading: true,
      // 数据
      pagination: [],
      optionsList: [],
      filter: [],
      data: [],
      paramElse: {},
      hasCount: true,
      // 接口返回的原始数据
      apiResponseData: {},
      // 搜索筛选
      filters: {},
      sorter: {},
      searchValue: {},
      selectedRows: [] // 已选择的数据
    }
  },
  mounted () {
    let that = this
    that.preFix().then(() => that.initData()).then(() => {}).catch(e => console.log(e))
  },
  methods: {
    // 预处理
    preFix () {
      return Promise.resolve()
    },
    formatPreFix (v) {
      return {
        text: v.label,
        value: v.value
      }
    },
    // 初始化数据
    initData (params = {}, append = false, from) {
      let that = this
      let { pagination, curTab, api, paramElse, hasCount } = this
      if (!that.loading && (!params.hasCount || from === 'pagination')) {
        that.loading = true
      }
      if (hasCount && from !== 'pagination') {
        that.pagination.loading = true
      }
      // let otherFilter = {};
      // otherFilter[this.curTabKey] = curTab;
      let data = _.merge({}, {
        page: pagination.current,
        limit: pagination.pageSize
      }, params, paramElse)

      data[that.tabsKey] = curTab

      if (api && that.auto) {
        return api(data).then(res => {
          if (res && res.errCode === 0) {
            that.apiResponseData = res.payload
            let list = res.payload.dataList || res.payload
            // 列表数据
            list = list.map((v, i) => {
              // 默认唯一标识
              if (that.rowKey) {
                v.RID = 'R-' + v[that.rowKey] // 自定义标识
              } else {
                v.RID = 'R-' + i
              }

              if (typeof v.is_mark === 'number') {
                // 订单标记
                v.mark = {
                  marked: v.is_mark,
                  tid: v.tid
                }
              }
              // 通用收货地址
              if (v.receiver_state) {
                v.receiver_location = [v.receiver_state, v.receiver_city, v.receiver_district].join('-')
              }

              // 自定义数据处理(正常用于操作字段添加)
              that.dataDetail && that.dataDetail(v)

              return v
            })

            // 数据叠加
            if (append) {
              // 过滤重复
              that.data = that.filterRepeat([...list, ...that.selectedRows])
            } else {
              that.data = list
            }

            // 全部
            that.pagination.total = res.payload.counter || 0
            that.pagination.loading = hasCount && !data.hasCount

            // 筛选下拉数据
            // if(that.optionsList.length == 0){
            that.optionsList = res.payload.selectBox || []
            // }
            // tabs
            if (that.tabs.length === 1 && Array.isArray(res.payload.tagList) && res.payload.tagList.length > 0) {
              that.tabs = res.payload.tagList.map(v => ({
                title: v.name,
                key: v.label.key,
                name: v.label.value
              }))
              // 默认
              if (that.curTab === null) {
                that.curTab = that.tabs[0].name
              } else {
                console.log('自动匹配tab')
                that.tabIndex = that.tabs.findIndex(v => v.name === that.curTab)
                if (that.tabIndex >= 0 && that.$refs.tabTable) that.$refs.tabTable.active = that.tabIndex
              }
            }
          }
          that.loading = false
          // 二次请求数据量, 有分页
          // if(that.hasCount && !params.hasCount)that.initData(Object.assign({}, { hasCount: 1 }, params), append, from);
        }).catch(() => {})
      } else {
        that.loading = false
        console.warn('请设置请求接口')
        return Promise.resolve()
      }
    },
    // 表格分页处理
    handleTableChange (pagination, filters, sorter) {
      let data = formatFilters(filters, sorter, this.filterKeys, this.searchValue, this.searchFilterKeys)
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.filters = filters
      this.sorter = sorter
      if (this.hasCount)data.hasCount = 1
      this.initData(data, false, 'pagination')
    },
    /**
     * 搜索
     * value  搜索的值
     * append 列表数据是否叠加(仅选中)
     * */
    search (value, append, filters, sorter) {
      this.searchValue = value
      let data = formatFilters(filters, sorter, this.filterKeys, value, this.searchFilterKeys)
      this.pagination.current = 1
      this.saveSelectedRows(append)
      this.initData(data, append, 'search')
    },
    // 保存选中数据
    saveSelectedRows (state) {
      let that = this
      // 先保存一下已选中的
      if (that.$refs.tabTable && state) {
        let { selected } = that.$refs.tabTable.getSelectedItems()
        that.selectedRows = that.filterRepeat([...that.selectedRows, ...selected])
        that.$refs.tabTable.setSelectItems(that.selectedRows.map(v => v[that.rowKey]), that.selectedRows)
        console.log(`之前包含${that.selectedRows.length}个选中数据`)
      } else {
        that.selectedRows = []
      }
    },
    // 查找重复数据
    filterRepeat (array, key = 'id') {
      let list = []
      array.forEach(v => {
        if (!list.find(item => item[key] === v[key])) list.push(v)
      })
      return list
    },
    // 搜索值不变重新加载
    searchReload (filters, sorter) {
      let data = formatFilters(filters, sorter, this.filterKeys, this.searchValue, this.searchFilterKeys)
      if (this.$refs.tabTable && !this.remainSelected) this.$refs.tabTable.setSelectItems([])
      return this.initData(data, false, 'search')
    },
    // 获取当前页面的筛选排序搜索|高级搜索参数
    getTableParams () {
      let [ filters, sorter ] = this.$refs.tabTable.getFiltersData()
      return formatFilters(filters, sorter, this.filterKeys, this.searchValue, this.searchFilterKeys)
    },
    // tab切换重新请求数据
    tabChange (index) {
      this.tabIndex = index
      this.pagination.current = 1
      let _currentTab = this.tabs[index]
      this.curTab = _currentTab.name
      this.curTabKey = _currentTab.key
      this.loading = true
      this.initData({}, false, 'tab')
    }
  },
  computed: {
    // 当前路由的名称(翻译后的)
    tableTitle () {
      return this.$t(this.$route.meta.title)
    }
  }
}
