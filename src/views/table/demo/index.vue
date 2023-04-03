<script lang="ts" setup>
import { getTableDataApi } from "@/api/table"
import { IGetTableData } from "@/api/table/types/table"
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue"
import { FormInstance } from "ant-design-vue"
import { ref, reactive } from "vue"
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

const data = ref<IGetTableData[]>([])

const formRef = ref<FormInstance>()
const formState = reactive({
  name: "",
  age: undefined
})
const onFinish = (values: any) => {
  console.log("Received values of form: ", values)
  console.log("formState: ", formState)
}

const getTableData = () => {
  getTableDataApi({
    ...formState,
    currentPage: 1,
    size: 10
  })
    .then((result) => {
      data.value = result.data.list
    })
    .catch(() => {})
    .finally(() => {})
}
</script>

<template>
  <div class="app-container">
    <a-card>
      <div>
        <a-form
          ref="formRef"
          name="advanced_search"
          class="ant-advanced-search-form"
          :model="formState"
          @finish="onFinish"
        >
          <a-row :gutter="24">
            <template v-for="(e, key) in formState" :key="key">
              <a-col :span="8">
                <a-form-item :name="key" :label="key">
                  <a-input v-model:value="formState[key  as  keyof typeof formState]" placeholder="placeholder" />
                </a-form-item>
              </a-col>
            </template>
          </a-row>
          <a-row>
            <a-col :span="24" style="text-align: right">
              <a-button type="primary" html-type="submit" @click="getTableData">Search</a-button>
              <a-button style="margin: 0 8px" @click="() => formRef?.resetFields()">Clear</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card>
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

<style scoped></style>
