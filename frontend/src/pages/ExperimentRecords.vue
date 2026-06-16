<template>
  <section class="experiment-records">
    <h2 class="page-title">实验记录</h2>

    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="所属项目">
          <el-select
            v-model="filterForm.projectId"
            placeholder="全部项目"
            clearable
            style="width: 260px"
            @change="onProjectChange"
          >
            <el-option
              v-for="p in projectStore.items"
              :key="p.id"
              :label="p.name"
              :value="p.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="审核状态">
          <el-select
            v-model="filterForm.status"
            placeholder="全部状态"
            clearable
            style="width: 200px"
            @change="onStatusChange"
          >
            <el-option
              v-for="s in reviewStatusList"
              :key="s"
              :label="s"
              :value="s"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <el-table
        :data="experimentStore.items"
        stripe
        style="width: 100%"
        empty-text="暂无实验记录"
      >
        <el-table-column prop="title" label="实验标题" min-width="200" />
        <el-table-column label="所属项目" min-width="180">
          <template #default="{ row }">
            {{ projectName(row.projectId) }}
          </template>
        </el-table-column>
        <el-table-column prop="experimentDate" label="实验日期" width="140" />
        <el-table-column prop="experimenterId" label="实验人" width="140" />
        <el-table-column label="审核状态" width="140">
          <template #default="{ row }">
            <StatusBadge :value="row.reviewStatus" />
          </template>
        </el-table-column>
        <el-table-column prop="purpose" label="实验目的" min-width="220" show-overflow-tooltip />
      </el-table>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useExperimentStore } from "../stores/experimentStore";
import { useProjectStore } from "../stores/projectStore";
import StatusBadge from "../components/common/StatusBadge.vue";
import type { ReviewStatus } from "../types/enums";

const experimentStore = useExperimentStore();
const projectStore = useProjectStore();

const reviewStatusList: ReviewStatus[] = [
  "Draft",
  "Submitted",
  "Approved",
  "Rejected",
  "RevisionRequired"
];

const filterForm = reactive({
  projectId: experimentStore.projectId,
  status: experimentStore.status
});

const projectName = (id: string) =>
  projectStore.items.find((p) => p.id === id)?.name ?? "-";

const refresh = () => experimentStore.load(filterForm.projectId, filterForm.status);

const onProjectChange = () => refresh();

const onStatusChange = () => refresh();

const reset = async () => {
  await experimentStore.resetFilters();
  filterForm.projectId = experimentStore.projectId;
  filterForm.status = experimentStore.status;
};

onMounted(async () => {
  await projectStore.load();
  await refresh();
});
</script>

<style scoped>
.experiment-records {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.filter-card,
.table-card {
  border-radius: 8px;
}

.filter-form {
  margin-bottom: 0;
}
</style>
