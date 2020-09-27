<style src="./List.scss" lang="scss" scoped></style>
<script src="./List.ts" lang="ts"></script>

<template>
  <div class="page-list">
    <div class="body-upper">
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
      <div class="actions">
        <Create @onCreated="onRefresh" v-if="contactAttributes && contactAttributes.length" />
        <Delete ref="deleteModal" @onDeleted="onRefresh" />
      </div>
    </div>

    <template>
      <div class="filter mt-3">
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
                    v-if="hasPermission([PERMISSION.CONTACT['*'], PERMISSION.CONTACT.EXPORT])"
                  >
                    <b-overlay
                      rounded
                      opacity="0.6"
                      spinner-small
                      spinner-variant="primary"
                      :show="isLoadingExport"
                    >
                      <b-dropdown-item @click.prevent="contactsExport()" class="action-items">
                        <i class="fas fa-file-export"></i>
                        Trích xuất LH
                      </b-dropdown-item>
                    </b-overlay>
                  </template>
                  <template v-else>
                    <b-dropdown-item
                      class="permission-btn-disabled"
                      v-b-tooltip.hover
                      :title="messageNotPermission"
                    >Trích xuất LH</b-dropdown-item>
                  </template>
                </b-dropdown>
                <span
                  v-if="total"
                  class="ml-2"
                  :class="highlightAction ? 'text-warning' : ''"
                >với tất cả ( {{ total }} LH)</span>
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
                  <template v-slot:title>Bạn có thể tìm kiếm liên hệ theo</template>
                  <div class="suggest-search-item">- Tên LH</div>
                  <div class="suggest-search-item">- SĐT</div>
                  <div class="suggest-search-item">- Email</div>
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
              class="contact-table"
              sticky-header="calc(100vh - 300px)"
            >
              <!-- Filter  -->
              <template v-slot:thead-top="data">
                <FilterAttribute
                  v-if="data"
                  :attributes="contactAttributes"
                  :data="data"
                  @onFilter="onFilter"
                />
              </template>
              <!-- End Filter -->

              <template v-slot:cell(actions)="data">
                <template
                  v-if="hasPermission([PERMISSION.CONTACT['*'], PERMISSION.CONTACT.DESTROY])"
                >
                  <i class="fas fa-trash cursor-pointer" @click="onDelete(data.item)"></i>
                </template>
                <template v-else>
                  <i
                    class="fas fa-trash cursor-pointer permission-btn-disabled"
                    v-b-tooltip.hover
                    :title="messageNotPermission"
                  ></i>
                </template>
              </template>
              <template v-slot:cell(ten_lh)="data">
                <template v-if="hasPermission([PERMISSION.CONTACT['*'], PERMISSION.CONTACT.SHOW])">
                  <router-link
                    :to="{ name: PERMISSION.CONTACT.SHOW, params: { id: data.item.id } }"
                  >{{ data.value }}</router-link>
                </template>
                <template v-else>
                  <span
                    class="permission-btn-disabled"
                    v-b-tooltip.hover
                    :title="messageNotPermission"
                  >{{ data.value }}</span>
                </template>
              </template>
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
          <div v-else class="text-center text-confirm">Chưa có liên hệ nào.</div>
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
  </div>
</template>