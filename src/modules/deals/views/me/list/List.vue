<style src="./List.scss" lang="scss" scoped></style>
<script src="./List.ts" lang="ts"></script>

<template>
  <div class="page-list">
    <div class="body-upper">
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
    </div>
    <div class="statistical mt-3">
      <b-overlay
        :show="isLoadingStatsByMe"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
      >
        <h5>Trạng thái xử lý</h5>
        <ul class="custom-list list-inline" v-if="statsByMe.deal_stages">
          <template v-for="(item, index) in statsByMe.deal_stages">
            <li
              class="custom-list-item"
              :key="index"
              :class="filterCustom && filterCustom.stage_id === item.id ? 'is-active': ''"
              @click.prevent="onFilterCustom('stage_id', item.id)"
            >
              <a>
                {{ item.name }}
                <b-badge
                  class="ml-1"
                  pill
                  :class="item.total > 0 ? 'custom-badge': ''"
                >{{ item.total }}</b-badge>
              </a>
            </li>
          </template>
        </ul>
        <h5>Phân loại Lead</h5>
        <ul class="custom-list list-inline" v-if="statsByMe.deal_lead_types">
          <template v-for="(item, index) in statsByMe.deal_lead_types">
            <li
              class="custom-list-item"
              :key="index"
              :class="filterCustom && filterCustom.lead_type_id === item.id ? 'is-active': ''"
              @click.prevent="onFilterCustom('lead_type_id', item.id)"
            >
              <a>
                {{ item.name }}
                <b-badge
                  class="ml-1"
                  pill
                  :class="item.total > 0 ? 'custom-badge': ''"
                >{{ item.total }}</b-badge>
              </a>
            </li>
          </template>
        </ul>
        <h5>Hành động</h5>
        <ul class="custom-list list-inline" v-if="statsByMe.deal_actions">
          <template v-for="(item, index) in statsByMe.deal_actions">
            <li
              class="custom-list-item"
              :key="index"
              :class="filterCustom && filterCustom.action_id === item.id ? 'is-active': ''"
              @click.prevent="onFilterCustom('action_id', item.id)"
            >
              <a>
                {{ item.name }}
                <b-badge
                  class="ml-1"
                  pill
                  :class="item.total > 0 ? 'custom-badge': ''"
                >{{ item.total }}</b-badge>
              </a>
            </li>
          </template>
        </ul>
      </b-overlay>
    </div>

    <template>
      <div class="filter">
        <b-button
          id="filter_tooltip"
          class="nt_btn-pill nt_btn nt_btn-outline-primary pl-4 pr-4"
          :class="showFilter ? 'nt_btn-primary' : 'nt_btn-outline-primary'"
          @click.prevent="toggleFilter()"
          :disabled="isLoading"
        >
          Bộ lọc
          <i class="fa ml-1" :class="showFilter ? 'fa-angle-up' : 'fa-angle-down'"></i>
        </b-button>
        <b-tooltip
          :show="showFilter"
          :disabled="!showFilter"
          ref="filterTooltip"
          target="filter_tooltip"
        >
          Bấm vào đây để
          <strong>bỏ lọc</strong>.
        </b-tooltip>
      </div>
      <div class="body-content">
        <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
          <div class="row">
            <div class="col-md-6 mb-4">
              <template v-if="items.length > 0">
                <b-dropdown
                  @show="toggleHighlightAction()"
                  @hide="toggleHighlightAction()"
                  id="actions"
                  text="Tác vụ"
                  class="actions"
                >
                  <template
                    v-if="hasPermission([PERMISSION.DEAL.ME['*'], PERMISSION.DEAL.ME.EXPORT])"
                  >
                    <b-overlay
                      rounded
                      opacity="0.6"
                      spinner-small
                      spinner-variant="primary"
                      :show="isLoadingExport"
                    >
                      <b-dropdown-item @click.prevent="dealsExport()" class="action-items">
                        <i class="fas fa-file-export"></i>
                        Trích xuất ĐH
                      </b-dropdown-item>
                    </b-overlay>
                  </template>
                  <template v-else>
                    <b-dropdown-item
                      class="permission-btn-disabled"
                      v-b-tooltip.hover
                      :title="messageNotPermission"
                    >Trích xuất ĐH</b-dropdown-item>
                  </template>
                </b-dropdown>
                <span
                  v-if="total"
                  class="ml-2"
                  :class="highlightAction ? 'text-warning' : ''"
                >với tất cả ( {{ total }} ĐH)</span>
              </template>
            </div>
            <div class="col-md-6 mb-4">
              <b-input-group class="search float-right" id="search_box" v-b-popover.hover.top>
                <b-popover
                  class="suggest-search nt_search_input"
                  target="search_box"
                  triggers="hover"
                  placement="top"
                >
                  <template v-slot:title>Bạn có thể tìm kiếm đơn hàng theo</template>
                  <div class="suggest-search-item">- Mã ĐH</div>
                  <div class="suggest-search-item">- Tên ĐH</div>
                  <div class="suggest-search-item">- Tên khách hàng ĐH</div>
                  <div class="suggest-search-item">- SĐT khách hàng ĐH</div>
                  <div class="suggest-search-item">- Email khách hàng ĐH</div>
                </b-popover>
                <div class="position-relative">
                  <b-form-input
                    type="text"
                    v-model="searchKey"
                    @keyup.enter="onSearch"
                    @keypress="onDebounce"
                    class="nt_search_input"
                    placeholder="Nhập từ khóa để tìm kiếm ..."
                  ></b-form-input>
                  <i
                    v-if="searchKey"
                    class="fas fa-times text-danger cursor-pointer search-reset"
                    @click="searchKey = ''; onRefresh()"
                  ></i>
                </div>
                <b-input-group-append>
                  <b-button class="nt_search_input_icon" :disabled="isLoading" @click="onSearch">
                    <i class="fas fa-search"></i>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </div>
          </div>
          <template>
            <b-table
              bordered
              hover
              responsive
              :items="items"
              :fields="fields"
              class="deal-table deal-table-me"
              sticky-header="calc(100vh - 300px)"
              ref="dealTable"
            >
              <!-- Filter  -->
              <template v-slot:thead-top="data">
                <FilterAttribute
                  v-if="data"
                  :attributes="dealAttributes"
                  :data="data"
                  @onFilter="onFilter"
                />
              </template>
              <!-- End Filter -->

              <template v-slot:cell(actions)="data">
                <button
                  @click.prevent="showModalDealAction({deal_id: data.item.id, customer_id: data.item.customer_id})"
                  variant="primary"
                  class="nt_btn nt_btn-warning"
                  size="sm"
                >Tác nghiệp</button>
              </template>
              <template v-slot:cell(ma_dh)="data">
                <a
                  href="#"
                  @click.prevent="showModalDealDetailsAction({deal_id: data.item.id, customer_id: data.item.customer_id})"
                >{{ data.value }}</a>
              </template>
              <template v-slot:cell(trang_thai_thanh_toan)="data">
                <span :class="setClassDealPaymentStatus(data.value)">
                  {{ data.value }}
                  <i
                    v-if="data.value === 'Thanh toán hết'"
                    class="fas fa-check ml-1"
                  ></i>
                </span>
              </template>
              <template v-slot:cell(deal_stages)="data">{{ data.value }}</template>
              <template v-slot:cell(deal_lead_types)="data">{{ data.value }}</template>
            </b-table>
          </template>
        </b-overlay>
        <div class="custom-pagination" v-if="items.length">
          <div class="info mr-3">
            {{ (perPage * (currentPage - 1)) + 1 }} -
            {{ checkPageCurrentPageOfTotalPage() ? currentPage * perPage : total }}
            của
            {{ total }}
          </div>
          <b-pagination
            v-if="items.length"
            pills
            :value="currentPage"
            :total-rows="total"
            :per-page="perPage"
            align="right"
            @change="onChange"
            class="mb-0"
          ></b-pagination>
        </div>
        <template v-if="!items.length && !isLoading">
          <template v-if="hasFilter">
            <NoResults />
          </template>
          <div v-else class="text-center text-confirm">Chưa có đơn hàng nào.</div>
        </template>
      </div>
    </template>

    <b-modal
      id="exportMessage"
      scrollable
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom"
      footer-class="justify-content-center"
      title="Thông báo"
      ok-title="Đóng"
      :hide-header="true"
      :ok-only="true"
    >
      <div class="text-confirm text-center">Có lỗi xảy ra vui lòng thử lại.</div>
    </b-modal>
    <b-modal
      id="exportProgress"
      scrollable
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      footer-class="justify-content-center"
      title="Thông báo"
      :hide-header="true"
      :hide-footer="true"
    >
      <div class="text-confirm text-center mb-3">Hệ thống đang xử lý vui lòng đợi trong giây lát.</div>

      <b-progress :max="100">
        <b-progress-bar
          variant="success"
          :animated="true"
          :striped="false"
          :value="progress"
          :label-html="`<strong>${progress}%</strong>`"
          :max="100"
          :precision="0"
          show-value
        ></b-progress-bar>
      </b-progress>
    </b-modal>
    <CreateAction @onCreatedAction="onCreatedAction" />
    <Show />
  </div>
</template>