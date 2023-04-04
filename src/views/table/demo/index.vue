<script lang="ts" setup>
import { createTableDataApi, getTableDataApi } from "@/api/table"
import { IGetTableData } from "@/api/table/types/table"
import { usePagination } from "@/hooks/usePagination"
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue"
import { FormInstance, message } from "ant-design-vue"
import { ref, reactive, watch } from "vue"
import { checkAge } from "@/utils/validate"
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
const getTableData = () => {
  getTableDataApi({
    ...formState,
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize
  })
    .then((result) => {
      data.value = result.data.list
      paginationData.total = result.data.total
    })
    .catch(() => {})
    .finally(() => {})
}

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination({
  pageSize: 20
})

const loading = ref<boolean>(false)
const visible = ref<boolean>(false)
const formStateSubmitRef = ref()
const showModal = () => {
  visible.value = true
}

const handleOk = () => {
  loading.value = true
  formStateSubmitRef.value
    ?.validateFields()
    .then(() => {
      createTableDataApi(formStateSubmit).then(() => {
        message.success("新增成功")
        visible.value = false
        getTableData()
      })
    })
    .catch(() => {})
}

const handleCancel = () => {
  visible.value = false
}

interface FormState {
  name: string
  age: number
}
const formStateSubmit = reactive<FormState>({
  name: "",
  age: 0
})

watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <a-card>
      <div>
        <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="formState">
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
      <a-button type="primary" @click="showModal">
        <template #icon><plus-outlined /> </template>
        添加
      </a-button>
      <a-modal v-model:visible="visible" title="Title" @ok="handleOk">
        <a-form
          :model="formStateSubmit"
          ref="formStateSubmitRef"
          name="basic"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
        >
          <template #footer>
            <a-button key="back" @click="handleCancel">Return</a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
          </template>
          <a-form-item label="name" name="name" :rules="[{ required: true, message: 'Please input your name!' }]">
            <a-input v-model:value="formStateSubmit.name" />
          </a-form-item>

          <a-form-item label="age" name="age" :rules="[{ validator: checkAge }]">
            <a-input-number v-model:value="formStateSubmit.age" />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-table :columns="columns" :data-source="data" :pagination="false">
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
      <a-pagination
        v-model:current="paginationData.currentPage"
        show-quick-jumper
        :total="paginationData.total"
        :pageSize="paginationData.pageSize"
        :pageSizeOptions="paginationData.pageSizes"
        @change="handleCurrentChange"
        @showSizeChange="handleSizeChange"
      />
      <br />
    </a-card>
  </div>
</template>

<style scoped></style>
