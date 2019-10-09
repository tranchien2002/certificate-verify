<template>
  <div>
    <div class="container-fluid">
      <h1 class="h3 mb-2 text-gray-800">Quản Lý Học Viên</h1>
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Danh Sách Học Viên</h6>
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

              <template slot="Fullname" slot-scope="row">{{ row.item.Fullname }}</template>

              <template slot="Username" slot-scope="row">{{ row.item.Username }}</template>
              <template slot="more">...</template>

              <template slot="delete" slot-scope="row">
                <div class="row justify-content-center">
                  <b-button
                    variant="info"
                    class="mr-1 btn-circle btn-sm"
                    :to="`students/${row.item.id}/subjects`"
                    :id="`popover-class-${row.item.id}`"
                  >
                    <b-popover
                      :target="`popover-class-${row.item.id}`"
                      triggers="hover"
                      placement="top"
                    >Môn Học</b-popover>
                    <i class="fas fa-layer-group"></i>
                  </b-button>
                  <b-button
                    @click="info(row.item, row.index, $event.target)"
                    class="mr-1 btn-circle btn-sm"
                    variant="info"
                    :id="`popover-info-${row.item.id}`"
                  >
                    <b-popover
                      :target="`popover-info-${row.item.id}`"
                      triggers="hover"
                      placement="top"
                    >Chi Tiết</b-popover>
                    <i class="fas fa-info-circle"></i>
                  </b-button>
                  <b-button
                    variant="danger"
                    @click="deleteSubject(row.item)"
                    class="btn-circle btn-sm"
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
      :id="infoModal.id"
      :total="infoModal.total"
      @hide="resetInfoModalDetail"
      title="Cập Nhật Môn Học"
      ok-only
      ok-variant="secondary"
      ok-title="Cancel"
    >
      <b-form>
        <b-form-group id="input-group-1" label-for="input-1">
          <div class="row">
            <div class="col-4">
              <h6>Fullname:</h6>
            </div>
            <div class="col-8 text-left">
              <h5>{{student.Fullname}}</h5>
            </div>
          </div>
        </b-form-group>
        <b-form-group id="input-group-2" label-for="input-2">
          <div class="row">
            <div class="col-4">
              <h6>Username:</h6>
            </div>
            <div class="col-8 text-left">
              <h5>{{student.Username}}</h5>
            </div>
          </div>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      student: {
        Fullname: ""
      },
      infoModal: {
        id: "info-modal",
        total: ""
      },
      blogPosts: [
        {
          id: 1,
          Username: "helloworld",
          Fullname: "student01"
        },
        {
          id: 2,
          Username: "helloworld",
          Fullname: "student02"
        },
        {
          id: 3,
          Username: "helloworld",
          Fullname: "student03"
        },
        {
          id: 4,
          Username: "helloworld",
          Fullname: "student04"
        },
        {
          id: 5,
          Username: "helloworld",
          Fullname: "student05"
        },
        {
          id: 6,
          Username: "helloworld",
          Fullname: "student06"
        },
        {
          id: 7,
          Username: "helloworld",
          Fullname: "student07"
        },
        {
          id: 8,
          Username: "helloworld",
          Fullname: "student08"
        },
        {
          id: 9,
          Username: "helloworld",
          Fullname: "student09"
        },
        {
          id: 10,
          Username: "helloworld",
          Fullname: "student10"
        },
        {
          id: 11,
          Username: "helloworld",
          Fullname: "student11"
        },
        {
          id: 12,
          Username: "helloworld",
          Fullname: "student12"
        },
        {
          id: 13,
          Username: "helloworld",
          Fullname: "student13"
        },
        {
          id: 14,
          Username: "helloworld",
          Fullname: "student14"
        },
        {
          id: 15,
          Username: "helloworld",
          Fullname: "student15"
        },
        {
          id: 16,
          Username: "helloworld",
          Fullname: "student16"
        },
        {
          id: 17,
          Username: "helloworld",
          Fullname: "student17"
        },
        {
          id: 18,
          Username: "helloworld",
          Fullname: "student18"
        }
      ],
      fields: [
        { key: "id", label: "id", class: "text-center", sortable: true },
        {
          key: "Fullname",
          label: "Fullname",
          class: "text-center",
          sortable: true
        },
        {
          key: "Username",
          label: "Username",
          class: "text-center",
          sortable: true
        },
        {
          key: "more",
          label: "...",
          class: "text-center",
          sortable: true
        },
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
      this.student.Fullname = item.Fullname;
      this.student.Username = item.Username;
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModalDetail() {
      this.student.Fullname = "";
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
    }
  }
};
</script>
