<template>
  <div>
    <div class="container-fluid">
      <h1 class="h3 mb-2 text-gray-800">Quản Lý Môn Học</h1>
      <p class="mb-4 mt-4"></p>
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">
            <button class="btn btn-success" @click="createSubject" v-b-modal.modal-create>
              <i class="fas fa-plus"></i>
            </button>
          </h6>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <b-table
              show-empty
              stacked="md"
              :items="blogPosts"
              :fields="fields"
              :current-page="currentPage"
              :per-page="perPage"
            >
              <template slot="id" slot-scope="row">{{ row.item.id }}</template>

              <template slot="subject_name" slot-scope="row">{{ row.item.subject_name }}</template>

              <template slot="total" slot-scope="row">{{ row.item.total }}</template>

              <template slot="delete" slot-scope="row">
                <div class="row justify-content-center">
                  <b-button
                    variant="danger"
                    @click="deleteSubject(row.item)"
                    class="ml-1 btn-circle btn-sm"
                    :id="`popover-del-${row.item.id}`"
                  >
                    <b-popover
                      :target="`popover-del-${row.item.id}`"
                      triggers="hover"
                      placement="top"
                    >Xóa</b-popover>
                    <i class="fas fa-trash-alt"></i>
                  </b-button>
                </div>
              </template>
            </b-table>
          </div>

          <b-row>
            <b-col md="6" class="my-1">
              <b-pagination
                :total-rows="blogPosts.length"
                :per-page="perPage"
                v-model="currentPage"
                class="my-0"
              />
            </b-col>
          </b-row>
        </div>
      </div>
    </div>

    <b-modal
      id="modal-create"
      title="Thêm Môn Học"
      ok-title="Thêm"
      @ok="handleAddSubject"
      ok-only
      @cancel="resetInfoModalAdd"
    >
      <b-form-select class="mb-3">
        <template v-slot:first>
          <option :value="null" disabled>-- Chọn lớp --</option>
        </template>

        <option value="1">PHP 01</option>
        <option value="2">Python 02</option>
      </b-form-select>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        subject_name: "",
        total: 0
      },
      newSubject: {
        subject_name: "",
        total: 0
      },
      infoModal: {
        id: "info-modal",
        total: ""
      },
      blogPosts: [
        {
          id: 1,
          subject_name: "Subject01",
          total: 10
        },
        {
          id: 2,
          subject_name: "Subject02",
          total: 10
        },
        {
          id: 3,
          subject_name: "Subject03",
          total: 10
        },
        {
          id: 1,
          subject_name: "Subject04",
          total: 10
        },
        {
          id: 2,
          subject_name: "Subject05",
          total: 10
        },
        {
          id: 3,
          subject_name: "Subject06",
          total: 10
        },
        {
          id: 1,
          subject_name: "Subject01",
          total: 10
        },
        {
          id: 2,
          subject_name: "Subject02",
          total: 10
        },
        {
          id: 3,
          subject_name: "Subject03",
          total: 10
        },
        {
          id: 1,
          subject_name: "Subject04",
          total: 10
        },
        {
          id: 2,
          subject_name: "Subject05",
          total: 10
        },
        {
          id: 3,
          subject_name: "Subject06",
          total: 10
        },
        {
          id: 1,
          subject_name: "Subject01",
          total: 10
        },
        {
          id: 2,
          subject_name: "Subject02",
          total: 10
        },
        {
          id: 3,
          subject_name: "Subject03",
          total: 10
        },
        {
          id: 1,
          subject_name: "Subject04",
          total: 10
        },
        {
          id: 2,
          subject_name: "Subject05",
          total: 10
        },
        {
          id: 3,
          subject_name: "Subject06",
          total: 10
        }
      ],
      fields: [
        { key: "id", label: "id", class: "text-center", sortable: true },
        {
          key: "subject_name",
          label: "Name Subject",
          class: "text-center",
          sortable: true
        },
        { key: "total", label: "total", class: "text-center", sortable: true },
        {
          key: "delete",
          label: "Actions",
          class: "text-center",
          sortable: true
        }
      ],
      currentPage: 1,
      perPage: 12,
      pageOptions: [12, 24, 36]
    };
  },
  methods: {
    info(item, index, button) {
      this.infoModal.total = `Row index: ${index}`;
      this.form.subject_name = item.subject_name;
      this.form.total = item.total;
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModalEdit() {
      this.form.subject_name = "";
      this.form.total = 0;
    },
    resetInfoModalAdd() {
      this.newSubject.subject_name = "";
      this.newSubject.total = 0;
    },
    handleUpdate() {},
    handleCreate() {
      resetInfoModalAdd();
    },
    deleteSubject(item) {
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#28a745",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true
      }).then(result => {
        if (result.value) {
          this.$swal("Deleted!", "Your file has been deleted.", "success");
        }
      });
    },
    createSubject(item, button) {
      this.$root.$emit("bv::show::modal", button);
    }
  }
};
</script>
