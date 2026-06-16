import { defineStore } from "pinia";
import { experimentApi } from "../api/experiment";
import type { ExperimentRecord } from "../types/experiment";

export const useExperimentStore = defineStore("experiments", {
  state: () => ({
    items: [] as ExperimentRecord[],
    projectId: "",
    status: ""
  }),
  actions: {
    async load(projectId?: string, status?: string) {
      if (projectId !== undefined) this.projectId = projectId;
      if (status !== undefined) this.status = status;
      this.items = await experimentApi.list(this.projectId, this.status);
    },
    resetFilters() {
      this.projectId = "";
      this.status = "";
      return this.load();
    }
  }
});
