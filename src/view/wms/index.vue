<template>
  <div>
    <TabTable
      :columns-source="columns"
      :data-source="data1"
      :index-loading="indexLoading"
      :tabs="tabs"
      :btns="btns"
      @btnChange="btnChange"
    />
  </div>
</template>

<script>
import { columns } from './index'
import TabTable from '../customer-setting/TabTable'
import { TestA } from '../api/base'
import mixins from '../customer-setting/mixins'

export default {
  name: 'WmsStore',
  mixins: [mixins],
  data () {
    return {
      api: TestA,
      columns: columns,
      defaultTabValue: '',
      indexLoading: false,
      readOnly: {
        type: Boolean,
        default: false
      },
      btns: [
        {
          label: '处理1',
          value: 'test1',
          state: 'primary'
        },
        {
          label: '处理2',
          value: 'test2'
        }
      ],
      // 后续需要从接口获取数据
      tabs: [
        {
          label: '标签一(1)',
          value: 'tab1'
        },
        {
          label: '标签二(2)',
          value: 'tab2'
        },
        {
          label: '标签三(3)',
          value: 'tab3'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          birthday: '001111',
          date: '2016-10-03',
          test: 'test1',
          test1: 'testA1'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          birthday: '001111',
          date: '2016-10-01',
          test: 'test2',
          test1: 'testB2'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          birthday: '001111',
          date: '2016-10-02',
          test: 'test3',
          test1: 'testC3'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          birthday: '001111',
          date: '2016-10-04',
          test: 'test4',
          test1: 'testD4'
        }
      ]
    }
  },
  components: {
    TabTable
  },
  created () {},
  methods: {
    test (value) {
      console.log('test')
    },
    btnChange (value) {
      console.log('这是wms上级')
      console.log(value)
      let a = { name: 21 }
      console.log(a.name)

      TestA().then(res => {
        console.log(res)
      })
    }
    // initData() {
    //   let { api } = this
    //   api().then(vv => {
    //     console.log("这儿请求的")
    //     console.log(vv.data)
    //   })
    // }
  }
}
</script>

<style>
.form-onlyRead {
  pointer-events: none;
}
</style>
