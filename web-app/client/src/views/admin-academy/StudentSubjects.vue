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
              :items="blogPosts ? blogPosts : []"
              :fields="fields"
              :current-page="currentPage"
              :per-page="perPage"
            >
              <template slot="SubjectID" slot-scope="row">{{ row.item.SubjectID }}</template>

              <template slot="Name" slot-scope="row">{{ row.item.Name }}</template>

              <template slot="actions" slot-scope="row">
                <div class="row justify-content-center">
                  <b-button
                    variant="danger"
                    @click="deleteSubject(row.item)"
                    class="ml-1 btn-circle btn-sm"
                    :id="`popover-del-${row.item.SubjectID}`"
                  >
                    <b-popover
                      :target="`popover-del-${row.item.SubjectID}`"
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
                :total-rows="blogPosts ? blogPosts.length : 0"
                :per-page="perPage"
                v-model="currentPage"
                class="my-0"
              />
            </b-col>
          </b-row>
        </div>
      </div>
    </div>

    <b-modal id="modal-create" title="Thêm Môn Học" ok-title="Thêm" @ok="handleAddSubject" ok-only>
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
        Name: ""
      },
      newSubject: {
        Name: ""
      },
      infoModal: {
        SubjectID: "info-modal"
      },
      blogPosts: [
        {
          SubjectID: 1,
          Name: "Subject01"
        },
        {
          SubjectID: 2,
          Name: "Subject02"
        },
        {
          SubjectID: 3,
          Name: "Subject03"
        },
        {
          SubjectID: 1,
          Name: "Subject04"
        },
        {
          SubjectID: 2,
          Name: "Subject05"
        },
        {
          SubjectID: 3,
          Name: "Subject06"
        },
        {
          SubjectID: 1,
          Name: "Subject01"
        },
        {
          SubjectID: 2,
          Name: "Subject02"
        },
        {
          SubjectID: 3,
          Name: "Subject03"
        },
        {
          SubjectID: 1,
          Name: "Subject04"
        },
        {
          SubjectID: 2,
          Name: "Subject05"
        },
        {
          SubjectID: 3,
          Name: "Subject06"
        },
        {
          SubjectID: 1,
          Name: "Subject01"
        },
        {
          SubjectID: 2,
          Name: "Subject02"
        },
        {
          SubjectID: 3,
          Name: "Subject03"
        },
        {
          SubjectID: 1,
          Name: "Subject04"
        },
        {
          SubjectID: 2,
          Name: "Subject05"
        },
        {
          SubjectID: 3,
          Name: "Subject06"
        }
      ],
      fields: [
        {
          key: "SubjectID",
          label: "SubjectID",
          class: "text-center",
          sortable: true
        },
        {
          key: "Name",
          label: "Name Subject",
          class: "text-center",
          sortable: true
        },
        {
          key: "actions",
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
      this.form.Name = item.Name;
      this.$root.$emit("bv::show::modal", this.infoModal.SubjectID, button);
    },
    handleAddSubject() {
      this.newSubject.Name = "";
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
