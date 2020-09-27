<style src="./List.scss" lang="scss" scoped></style>
<script src="./List.ts" lang="ts"></script>

<template>
  <div>
    <div class="body-upper">
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
      <div class="actions">
        <template v-if="hasPermission([PERMISSION.DEAL['*'], PERMISSION.DEAL.WORKFLOW['*']])">
          <b-button
            v-b-modal.dealWorkflowCreateModal
            variant="primary"
            class="float-right nt_btn nt_btn nt_btn-warning nt-button-top"
          >
            <i class="fas fa-plus"></i> Thêm quy trình làm việc
          </b-button>
        </template>
        <template v-else>
          <b-button
            variant="primary"
            class="float-right nt_btn nt_btn nt_btn-warning nt-button-top permission-btn-disabled"
            v-b-tooltip.hover
            :title="messageNotPermission"
          >
            <i class="fas fa-plus"></i> Thêm quy trình làm việc
          </b-button>
        </template>
      </div>
    </div>
    <div class="body-content body-content-custom">
      <div class="body-content-left">
        <SidebarLeft />
      </div>
      <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
        <template v-for="(dealWorkflow, index) in dealWorkflows">
          <div class="body-content-right mb-4 float-right" :key="index">
            <div class="deal-workflow-head">
              <h5
                class="item-deal-workflow-head-title"
                v-b-toggle="'dealWorkflow' + dealWorkflow.id"
              >
                {{ dealWorkflow.name }}
                <i class="fas fa-angle-down ml-1"></i>
              </h5>
              <div class="item-deal-workflow-head-actions text-right">
                <template
                  v-if="hasPermission([PERMISSION.DEAL['*'], PERMISSION.DEAL.WORKFLOW['*']])"
                >
                  <i
                    class="fas fa-edit cursor-pointer"
                    @click.prevent="onEditDealWorkflow(dealWorkflow.id)"
                  ></i>
                </template>
                <template v-else>
                  <i
                    class="fas fa-edit cursor-pointer mr-2 permission-btn-disabled"
                    v-b-tooltip.hover
                    :title="messageNotPermission"
                  ></i>
                </template>
              </div>
            </div>
            <b-collapse
              class="deal-workflow-body"
              :id="'dealWorkflow' + dealWorkflow.id"
              :visible="dealWorkflow.id === 1 ? true : false"
            >
              <template v-if="hasPermission([PERMISSION.DEAL['*'], PERMISSION.DEAL.WORKFLOW['*']])">
                <b-button
                  @click.prevent="onCreateDealActionFlow(dealWorkflow.id)"
                  variant="primary"
                  class="mb-3 mt-3 float-right nt_btn nt_btn-outline-primary"
                >
                  <i class="fas fa-plus"></i> Thêm luồng tác nghiệp
                </b-button>
              </template>
              <template v-else>
                <b-button
                  variant="primary"
                  class="float-right nt_btn nt_btn nt_btn-warning nt-button-top permission-btn-disabled"
                  v-b-tooltip.hover
                  :title="messageNotPermission"
                >
                  <i class="fas fa-plus"></i> Thêm luồng tác nghiệp
                </b-button>
              </template>
              <b-table
                bordered
                hover
                responsive
                :items="convertDataDealActionFlows(dealWorkflow.deal_action_flows)"
                :fields="fields"
              >
                <template
                  v-slot:custom-foot="data"
                  v-if="dealWorkflow.deal_action_flows.length <= 0"
                >
                  <b-tr>
                    <b-td
                      :colspan="data.fields.length"
                      class="text-center text-confirm"
                    >Không có luồng tác nghiệp nào.</b-td>
                  </b-tr>
                </template>
                <template v-slot:cell(actions)="data">
                  <template
                    v-if="hasPermission([PERMISSION.DEAL['*'], PERMISSION.DEAL.WORKFLOW['*']])"
                  >
                    <i
                      class="fas fa-edit cursor-pointer mr-2"
                      @click.prevent="onEditDealActionFlow(dealWorkflow.id, data.item.id)"
                    ></i>
                  </template>
                  <template v-else>
                    <i
                      class="fas fa-edit cursor-pointer mr-2 permission-btn-disabled"
                      v-b-tooltip.hover
                      :title="messageNotPermission"
                    ></i>
                  </template>
                  <!-- <i class="fas fa-trash cursor-pointer" @click.prevent="onDelete(data.item)"></i> -->
                </template>
              </b-table>
            </b-collapse>
          </div>
        </template>
      </b-overlay>
    </div>
    <CreateDealWorkFlow @onCreated="onRefresh" />
    <EditDealWorkFlow @onUpdated="onRefresh" />
    <CreateDealActionFlow @onCreated="onRefresh" />
    <EditDealActionFlow @onUpdated="onRefresh" />
  </div>
</template>