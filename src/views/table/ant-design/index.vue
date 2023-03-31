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
            <a-button type="primary" html-type="submit" @click="handleSearch">Search</a-button>
            <a-button style="margin: 0 8px" @click="resetSearch">Clear</a-button>
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
      <a-button type="primary" @click="showModal">
        <template #icon><plus-outlined /></template>
        新增
      </a-button>
      <a-modal v-model:visible="visible" title="Title">
        <template #footer>
          <a-button key="back" @click="handleCancel">Return</a-button>
          <a-button key="submit" type="primary" :loading="loadingModal" @click="onSubmit">Submit</a-button>
        </template>
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="Name" required>
            <a-input v-model:value="modelRef.name" />
          </a-form-item>
          <a-form-item label="Age" required>
            <a-select v-model:value="modelRef.region" placeholder="please select your zone">
              <a-select-option value="shanghai">Zone one</a-select-option>
              <a-select-option value="beijing">Zone two</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Tags" required>
            <a-checkbox-group v-model:value="modelRef.type">
              <a-checkbox value="1" name="type">DEVELOPER</a-checkbox>
              <a-checkbox value="2" name="type">NICE</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }" v-bind="errorInfos">
            <!-- <a-button type="primary" @click.prevent="onSubmit">Create</a-button>
            <a-button style="margin-left: 10px" @click="resetFields">Reset</a-button> -->
          </a-form-item>
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
              <a @click="showModal">编辑</a>
              <a-divider type="vertical" />
              <a>删除</a>
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
import { ref, reactive, watch, toRaw, computed } from "vue"
import { getTableDataApi } from "@/api/table"
import { SmileOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons-vue"
import type { FormInstance } from "ant-design-vue"
import { Form } from "ant-design-vue"
import { usePagination } from "@/hooks/usePagination"
import { type IGetTableData } from "@/api/table/types/table"
import { toArray } from "lodash-es"
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
const useForm = Form.useForm
//#region 增
const labelCol = { span: 6 }
const wrapperCol = { span: 14 }
const modelRef = reactive({
  name: "",
  region: undefined,
  type: []
})
const rulesRef = reactive({
  name: [
    {
      required: true,
      message: "Please input name"
    }
  ],
  region: [
    {
      required: true,
      message: "Please select region"
    }
  ],
  type: [
    {
      required: true,
      message: "Please select type",
      type: "array"
    }
  ]
})
const { validate, validateInfos, mergeValidateInfo } = useForm(modelRef, rulesRef)
const onSubmit = () => {
  validate()
    .then(() => {
      console.log(toRaw(modelRef))
      setTimeout(() => {
        loadingModal.value = false
        visible.value = false
      }, 2000)
    })
    .catch((err) => {
      console.log("error", err)
    })
    .finally(() => {
      loadingModal.value = false
    })
}
const errorInfos = computed(() => {
  return mergeValidateInfo(toArray(validateInfos))
})
const loadingModal = ref<boolean>(false)
const visible = ref<boolean>(false)

const showModal = () => {
  visible.value = true
}

const handleCancel = () => {
  visible.value = false
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
const expand = ref(false)
const onFinish = (values: any) => {
  console.log("Received values of form: ", values)
  console.log("formState: ", formState)
}
</script>
