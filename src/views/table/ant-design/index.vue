<template>
  <div class="app-container">
    <a-card>
      <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="formState">
        <a-row :gutter="24">
          <template v-for="(e, i) in formState" :key="i">
            <a-col :span="8">
              <a-form-item :name="i" :label="i">
                <a-input v-model:value="formState[i as keyof typeof formState]" placeholder="placeholder" />
              </a-form-item>
            </a-col>
          </template>
        </a-row>
        <a-row>
          <a-col :span="24" style="text-align: right">
            <a-button type="primary" html-type="submit" @click="handleSearch">Search</a-button>
            <a-button style="margin: 0 8px" @click="resetSearch">Clear</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card>
      <a-button type="primary" @click="showModal">
        <template #icon><plus-outlined /></template>
        新增
      </a-button>
      <a-modal v-model:visible="visible" title="Title" :afterClose="resetForm">
        <template #footer>
          <a-button key="back" @click="handleCancel">Return</a-button>
          <a-button key="submit" type="primary" :loading="loadingModal" @click="onSubmit">Submit</a-button>
        </template>
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="submitFormRef" :model="modelRef">
          <a-form-item
            name="name"
            label="name"
            :rules="[{ required: true, message: 'Please input Name', trigger: 'blur' }]"
          >
            <a-input v-model:value="modelRef.name" />
          </a-form-item>
          <a-form-item name="age" label="age" :rules="[{ validator: checkAge, trigger: 'blur' }]">
            <a-input-number id="inputNumber" v-model:value="modelRef.age" />
          </a-form-item>
          <!-- <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }" v-bind="errorInfos"> -->
          <!-- <a-button type="primary" @click.prevent="onSubmit">Create</a-button>
            <a-button style="margin-left: 10px" @click="resetFields">Reset</a-button> -->
          <!-- </a-form-item> -->
        </a-form>
      </a-modal>
      <a-table :columns="columns" :data-source="data" :pagination="false" :loading="loading">
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
              <a @click="handleUpdate(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handleDelete(record)">删除</a>
            </span>
          </template>
        </template>
      </a-table>
      <a-pagination
        :pageSizeOptions="paginationData.pageSizes"
        :total="paginationData.total"
        :pageSize="paginationData.pageSize"
        :current="paginationData.currentPage"
        @showSizeChange="handleSizeChange"
        @change="handleCurrentChange"
        show-quick-jumper
      />
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, toRaw } from "vue"
import { getTableDataApi, createTableDataApi, updateTableDataApi, deleteTableDataApi } from "@/api/table"
import { SmileOutlined, PlusOutlined } from "@ant-design/icons-vue"
import { FormInstance, message, Modal } from "ant-design-vue"
import { usePagination } from "@/hooks/usePagination"
import { type IGetTableData } from "@/api/table/types/table"
import { Rule } from "ant-design-vue/lib/form"
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
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination({ pageSize: 20 })
//#region 增
const labelCol = { span: 6 }
const wrapperCol = { span: 14 }
const modelRef = reactive({
  name: "",
  age: 0
})
const checkAge = async (_rule: Rule, value: number) => {
  if (!value) {
    return Promise.reject("Please input the age")
  }
  if (!Number.isInteger(value)) {
    return Promise.reject("Please input digits")
  } else {
    if (value < 18) {
      return Promise.reject("Age must be greater than 18")
    } else {
      return Promise.resolve()
    }
  }
}
const onSubmit = () => {
  submitFormRef.value
    ?.validateFields()
    .then(() => {
      console.log(toRaw(modelRef))
      if (currentUpdateId.value === undefined) {
        createTableDataApi(modelRef).then(() => {
          message.success("新增成功")
          visible.value = false
          getTableData()
        })
      } else {
        updateTableDataApi(modelRef).then(() => {
          message.success("修改成功")
          visible.value = false
          getTableData()
        })
      }
    })
    .catch((err) => {
      console.log("error", err)
    })
    .finally(() => {
      loadingModal.value = false
    })
}
const loadingModal = ref<boolean>(false)
const visible = ref<boolean>(false)
const submitFormRef = ref<FormInstance>()

const showModal = () => {
  visible.value = true
}

const handleCancel = () => {
  visible.value = false
}
const resetForm = () => {
  currentUpdateId.value = undefined
  modelRef.name = ""
  modelRef.age = 0
  submitFormRef.value?.clearValidate()
}
//#endregion

//#region 删
const handleDelete = (row: IGetTableData) => {
  Modal.confirm({
    content: `正在删除用户：${row.name}，确认删除？`,
    title: "提示",
    okText: "确定",
    cancelText: "取消",
    onOk() {
      deleteTableDataApi(row.name).then(() => {
        message.success("删除成功")
        getTableData()
      })
    }
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: IGetTableData) => {
  currentUpdateId.value = row.name
  modelRef.name = row.name
  modelRef.age = row.age
  visible.value = true
}
//#endregion

//#region 查
const data = ref<IGetTableData[]>([])
const formRef = ref<FormInstance>()
const formState = reactive({
  name: "",
  age: null
})
const getTableData = () => {
  loading.value = true
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    name: formState.name || undefined,
    age: formState.age || undefined
  })
    .then((res) => {
      paginationData.total = res.data.total
      data.value = res.data.list
    })
    .catch(() => {
      data.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const resetSearch = () => {
  formRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>
