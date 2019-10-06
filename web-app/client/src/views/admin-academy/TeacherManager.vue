<template>
  <div>
    <div class="container-fluid">
      <h1 class="h3 mb-2 text-gray-800">Quản Lý Giáo Viên</h1>
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Danh Sách Giáo Viên</h6>
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

              <template slot="name" slot-scope="row">{{ row.item.name }}</template>

              <template slot="username" slot-scope="row">{{ row.item.username }}</template>
              <template slot="more">...</template>

              <template slot="delete" slot-scope="row">
                <div class="row justify-content-center">
                  <b-button
                    variant="info"
                    class="mr-1 btn-circle btn-sm"
                    :to="`teachers/${row.item.id}/subjects`"
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
                    class="mr-1 float-right btn-circle btn-sm"
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
                    class="float-left btn-circle btn-sm"
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
              <h6>Name:</h6>
            </div>
            <div class="col-8 text-left">
              <h5>{{teacher.name}}</h5>
            </div>
          </div>
        </b-form-group>
        <b-form-group id="input-group-2" label-for="input-2">
          <div class="row">
            <div class="col-4">
              <h6>Username:</h6>
            </div>
            <div class="col-8 text-left">
              <h5>{{teacher.username}}</h5>
            </div>
          </div>
        </b-form-group>
        <b-form-group id="input-group-3" label-for="input-3">
          <div class="row">
            <div class="col-4">
              <h6>Birthday:</h6>
            </div>
            <div class="col-8 text-left">
              <h5>{{teacher.birthday}}</h5>
            </div>
          </div>
        </b-form-group>

        <b-form-group id="input-group-4" label-for="input-4">
          <div class="row">
            <div class="col-4">
              <h6>Number Phone:</h6>
            </div>
            <div class="col-8 text-left">
              <h5>{{teacher.numberphone}}</h5>
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
      teacher: {
        name: "",
        birthday: 0
      },
      infoModal: {
        id: "info-modal",
        total: ""
      },
      blogPosts: [
        {
          id: 1,
          username: "teacher",
          name: "teacher01",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 2,
          username: "teacher",
          name: "teacher02",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 3,
          username: "teacher",
          name: "teacher03",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 4,
          username: "teacher",
          name: "teacher04",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 5,
          username: "teacher",
          name: "teacher05",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 6,
          username: "teacher",
          name: "teacher06",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 7,
          username: "teacher",
          name: "teacher07",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 8,
          username: "teacher",
          name: "teacher08",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 9,
          username: "teacher",
          name: "teacher09",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 10,
          username: "teacher",
          name: "teacher10",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 11,
          username: "teacher",
          name: "teacher11",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 12,
          username: "teacher",
          name: "teacher12",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 13,
          username: "teacher",
          name: "teacher13",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 14,
          username: "teacher",
          name: "teacher14",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 15,
          username: "teacher",
          name: "teacher15",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 16,
          username: "teacher",
          name: "teacher16",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 17,
          username: "teacher",
          name: "teacher17",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        },
        {
          id: 18,
          username: "teacher",
          name: "teacher18",
          birthday: "01 / 01 / 1997",
          numberphone: "0123456789"
        }
      ],
      fields: [
        { key: "id", label: "id", class: "text-center", sortable: true },
        {
          key: "name",
          label: "Name",
          class: "text-center",
          sortable: true
        },
        {
          key: "username",
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
      this.infoModal.birthday = `Row index: ${index}`;
      this.teacher.name = item.name;
      this.teacher.birthday = item.birthday;
      this.teacher.username = item.username;
      this.teacher.numberphone = item.numberphone;
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModalDetail() {
      this.teacher.name = "";
      this.teacher.birthday = 0;
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
