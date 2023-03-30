<template>
  <div class="app-container">
    <a-card>
      <a-form
        ref="formRef"
        name="advanced_search"
        class="ant-advanced-search-form"
        :model="formState"
        @finish="onFinish"
      >
        <a-row :gutter="24">
          <template v-for="i in 10" :key="i">
            <a-col v-show="expand || i <= 6" :span="8">
              <a-form-item
                :name="`field-${i}`"
                :label="`field-${i}`"
                :rules="[{ required: false, message: 'input something' }]"
              >
                <a-input v-model:value="formState[`field-${i}` as keyof typeof formState]" placeholder="placeholder" />
              </a-form-item>
            </a-col>
          </template>
        </a-row>
        <a-row>
          <a-col :span="24" style="text-align: right">
            <a-button type="primary" html-type="submit">Search</a-button>
            <a-button style="margin: 0 8px" @click="() => formRef?.resetFields()">Clear</a-button>
            <a style="font-size: 12px" @click="expand = !expand">
              <template v-if="expand">
                <UpOutlined />
              </template>
              <template v-else>
                <DownOutlined />
              </template>
              Collapse
            </a>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card>
      <a-button type="primary">
        <template #icon><plus-outlined /></template>
        新增
      </a-button>
      <a-table :columns="columns" :data-source="data">
        <template #headerCell="{ column }">
          <template v-if="column.key === 'name'">
            <span>
              <smile-outlined />
              Name
            </span>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a>
              {{ record.name }}
            </a>
          </template>
          <template v-else-if="column.key === 'tags'">
            <span>
              <a-tag
                v-for="tag in record.tags"
                :key="tag"
                :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
              >
                {{ tag.toUpperCase() }}
              </a-tag>
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a>Invite 一 {{ record.name }}</a>
              <a-divider type="vertical" />
              <a>Delete</a>
              <a-divider type="vertical" />
              <a class="ant-dropdown-link">
                More actions
                <down-outlined />
              </a>
            </span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue"
import { SmileOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons-vue"
import type { FormInstance } from "ant-design-vue"
const columns = [
  {
    name: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address"
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags"
  },
  {
    title: "Action",
    key: "action"
  }
]

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"]
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"]
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"]
  }
]

const expand = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive({})
const onFinish = (values: any) => {
  console.log("Received values of form: ", values)
  console.log("formState: ", formState)
}
</script>
