<template>
  <div>
    <Tabs type="card" @on-click="TabChange" v-model="defaultTabValue">
      <TabPane v-for="(tab) in tabs" :value="tab.value" :name="tab.value" :key="tab.label" :label="tab.label"/>
    </Tabs>
    <div>
      <i-button type="primary">退回</i-button>
    </div>
    <Table
      :columns="columns"
      :data="data1"
      width="1200px"
      :loading="indexLoading"/>
  </div>
</template>

<script>
import { columns } from './index'

export default {
  data () {
    return {
      columns: columns,
      defaultTabValue: '',
      indexLoading: false,
      // 后续需要从接口获取数据
      tabs: [
        {
          label: '标签一',
          value: 'tab1'
        },
        {
          label: '标签二',
          value: 'tab2'
        },
        {
          label: '标签三',
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
  components: {},
  created () {},
  methods: {
    test (value) {
      console.log('test')
    },
    TabChange (value) {
      console.log(value)
    }
  }
}
</script>

<style>

</style>
