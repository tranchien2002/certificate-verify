<template>
  <div>
    <div class="container-fluid">
      <h1 class="h3 mb-2 text-gray-800">Quản Lý Chứng Chỉ</h1>
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
                    variant="info"
                    class="mr-1 btn-circle btn-sm"
                    :to="`certificates/${row.item.id}/students`"
                    :id="`popover-info-${row.item.id}`"
                  >
                    <b-popover
                      :target="`popover-info-${row.item.id}`"
                      triggers="hover"
                      placement="top"
                    >Chi Tiết</b-popover>
                    <i class="fas fa-info-circle"></i>
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
      :id="infoModal.id"
      :total="infoModal.total"
      @hide="resetInfoModalEdit"
      ok-title="Update"
      @ok="handleUpdate"
      title="Cập Nhật Môn Học"
    >
      <b-form>
        <b-form-group id="input-group-1" label-for="input-1" class>
          <b-form-input
            id="input-1"
            v-model="form.subject_name"
            type="text"
            required
            placeholder="subject name *"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-2" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.total"
            required
            placeholder="total *"
            type="number"
          ></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>

    <b-modal
      id="modal-create"
      title="Tạo Mới Môn Học"
      @ok="handleCreate"
      @cancel="resetInfoModalCreate"
    >
      <b-form-group id="input-group-1" label-for="input-1" class>
        <b-form-input
          id="input-1"
          v-model="newSubject.subject_name"
          type="text"
          required
          placeholder="subject name *"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-2" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="newSubject.total"
          required
          placeholder="total *"
          type="number"
        ></b-form-input>
      </b-form-group>
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
          id: 4,
          subject_name: "Subject04",
          total: 10
        },
        {
          id: 5,
          subject_name: "Subject05",
          total: 10
        },
        {
          id: 6,
          subject_name: "Subject06",
          total: 10
        },
        {
          id: 7,
          subject_name: "Subject01",
          total: 10
        },
        {
          id: 8,
          subject_name: "Subject02",
          total: 10
        },
        {
          id: 9,
          subject_name: "Subject03",
          total: 10
        },
        {
          id: 10,
          subject_name: "Subject04",
          total: 10
        },
        {
          id: 11,
          subject_name: "Subject05",
          total: 10
        },
        {
          id: 12,
          subject_name: "Subject06",
          total: 10
        },
        {
          id: 13,
          subject_name: "Subject01",
          total: 10
        },
        {
          id: 14,
          subject_name: "Subject02",
          total: 10
        },
        {
          id: 15,
          subject_name: "Subject03",
          total: 10
        },
        {
          id: 16,
          subject_name: "Subject04",
          total: 10
        },
        {
          id: 17,
          subject_name: "Subject05",
          total: 10
        },
        {
          id: 18,
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
    resetInfoModalCreate() {
      this.newSubject.subject_name = "";
      this.newSubject.total = 0;
    },
    handleUpdate() {},
    handleCreate() {
      resetInfoModalCreate();
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
