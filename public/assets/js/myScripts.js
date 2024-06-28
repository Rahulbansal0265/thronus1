function supportSend(elem, id, email) {
  if (elem.value === "1") {
    var modal = new bootstrap.Modal(document.getElementById("default"));
    modal.show();
    // Add a click event listener to the "Send" button
    const sendButton = document.querySelector("#default .modal-footer button");
    sendButton.addEventListener("click", function () {
      // Get values from the form fields
      const title = document.getElementById("title").value;
      const note = document.getElementById("note").value;

      // Construct the data to send via AJAX
      const dataToSend = {
        title: title,
        note: note,
        id: id,
        email: email,
        // Include any other data you want to send
      };

      $.ajax({
        type: "POST", // Set the HTTP method (or 'GET' if appropriate)
        url: "/admin/sendSupport", // Specify the URL to send the data
        data: dataToSend, // Send the data
        success: function (response) {
          // Handle the response from the server
          if (response === true) {
            // Clear the form after a successful response
            document.getElementById("first-name-vertical").value = "";
            document.getElementById("note").value = "";
          }
          document.reload();
        },
        error: function (error) {
          // Handle any errors that occur during the AJAX request
        },
      });

      // Close the modal
      var modal = new bootstrap.Modal(document.getElementById("default"));
      modal.hide();
    });
  }
}

function status(elem) {
  if (elem.checked == true) {
    var status = 1;
  } else {
    status = 0;
  }

  $.ajax({
    type: "POST",
    url: "/admin/status",
    data: { status: status, id: elem.id },
    // beforeSend: function (msg) {
    //   blockUI("#table_get");
    // },
    success: function (result) {
      //   unblockUI("#table_get");
      iziToast.success({
        title: "",
        position: "topRight",
        message: "Status updated successfully",
        timeout: 1000
      });
      // location.reload();
    },
  });
}
function categoryStatus(elem) {
  if (elem.checked == true) {
    var status = 1;
  } else {
    status = 0;
  }

  $.ajax({
    type: "POST",
    url: "/admin/categoryStatus",
    data: { status: status, id: elem.id },
    // beforeSend: function (msg) {
    //   blockUI("#table_get");
    // },
    success: function (result) {
      //   unblockUI("#table_get");
      iziToast.success({
        title: "",
        position: "topRight",
        message: "Status updated successfully",
        timeout: 1000
      });
      // location.reload();
    },
  });
}
function blockedStatus(elem) {
  if (elem.checked == true) {
    var status = 1;
  } else {
    status = 0;
  }

  $.ajax({
    type: "POST",
    url: "/admin/blockedStatus",
    data: { status: status, id: elem.id },
    // beforeSend: function (msg) {
    //   blockUI("#table_get");
    // },
    success: function (result) {
      //   unblockUI("#table_get");
      iziToast.success({
        title: "",
        position: "topRight",
        message: "Status updated successfully",
        timeout: 1000
      });
      // location.reload();
    },
  });
}
function categoryStatus(elem) {
  if (elem.checked == true) {
    var status = 1;
  } else {
    status = 0;
  }

  $.ajax({
    type: "POST",
    url: "/admin/categoryStatus",
    data: { status: status, id: elem.id },
    // beforeSend: function (msg) {
    //   blockUI("#table_get");
    // },
    success: function (result) {
      //   unblockUI("#table_get");
      iziToast.success({
        title: "",
        position: "topRight",
        message: "Status updated successfully",
        timeout: 1000
      });
      // location.reload();
    },
  });
}

$(document).ready(function () {
  $(".deleteUser").on("click", function () {
    // let table = $(this).attr("DataTables_Table_0");
    // console.log("🚀 ~ file: myScripts.js:29 ~ table:", table);
    let id = $(this).data("id");
    // console.log("🚀 ~ file: myScripts.js:31 ~ id:", id);
    // alert(id);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it1!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed == true && id != "") {
          $.ajax({
            url: "/admin/deleteUser/" + id,
            type: "get",
            data: {},
            success: function (response) {
              if (response == 1) {
                location.reload(true);
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              swal("Error deleting!", "Please try again", "error");
            },
          });
        }
      });
  });
});
$(document).ready(function () {
  $(".blockedDelete").on("click", function () {
    // let table = $(this).attr("DataTables_Table_0");
    // console.log("🚀 ~ file: myScripts.js:29 ~ table:", table);
    let id = $(this).data("id");
    console.log("🚀 ~ file: myScripts.js:31 ~ id:", id);
    // alert(id);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed == true && id != "") {
          $.ajax({
            url: "/admin/blockedDelete/" + id,
            type: "get",
            data: {},
            success: function (response) {
              if (response == 1) {
                location.reload(true);
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              swal("Error deleting!", "Please try again", "error");
            },
          });
        }
      });
  });
});

$(document).ready(function () {
  $(".deleteCategory").on("click", function () {
    // let table = $(this).attr("DataTables_Table_0");
    // console.log("🚀 ~ file: myScripts.js:29 ~ table:", table);
    let id = $(this).data("id");
    console.log("🚀 ~ file: myScripts.js:31 ~ id:", id);
    // alert(id);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed == true && id != "") {
          $.ajax({
            url: "/admin/deleteCategory/",
            type: "post",
            data: { id },
            success: function (response) {
              if (response == 1) {
                location.reload(true);
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              swal("Error deleting!", "Please try again", "error");
            },
          });
        }
      });
  });
});
$(document).ready(function () {
  $(".deleteReward").on("click", function () {
    // let table = $(this).attr("DataTables_Table_0");
    // console.log("🚀 ~ file: myScripts.js:29 ~ table:", table);
    let id = $(this).data("id");
    // console.log("🚀 ~ file: myScripts.js:31 ~ id:", id);
    // alert(id);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed == true && id != "") {
          $.ajax({
            url: "/admin/deleteReward/",
            type: "post",
            data: { id },
            success: function (response) {
              if (response == 1) {
                location.reload(true);
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              swal("Error deleting!", "Please try again", "error");
            },
          });
        }
      });
  });
});
$(document).ready(function () {
  $(".deleteNews").on("click", function () {
    // let table = $(this).attr("DataTables_Table_0");
    // console.log("🚀 ~ file: myScripts.js:29 ~ table:", table);
    let id = $(this).data("id");
    console.log("🚀 ~ file: myScripts.js:31 ~ id:", id);
    // alert(id);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed == true && id != "") {
          $.ajax({
            url: "/admin/deleteNews/",
            type: "post",
            data: { id },
            success: function (response) {
              if (response == 1) {
                location.reload(true);
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              swal("Error deleting!", "Please try again", "error");
            },
          });
        }
      });
  });
});
$(document).ready(function () {
  $(".deleteFaq").on("click", function () {
    // let table = $(this).attr("DataTables_Table_0");
    // console.log("🚀 ~ file: myScripts.js:29 ~ table:", table);
    let id = $(this).data("id");
    console.log("🚀 ~ file: myScripts.js:31 ~ id:", id);
    // alert(id);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed == true && id != "") {
          $.ajax({
            url: "/admin/deleteFaq/",
            type: "post",
            data: { id },
            success: function (response) {
              if (response == 1) {
                location.reload(true);
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              swal("Error deleting!", "Please try again", "error");
            },
          });
        }
      });
  });
});
$(document).ready(function () {
  $(".deletePrescription").on("click", function () {
    // let table = $(this).attr("DataTables_Table_0");
    // console.log("🚀 ~ file: myScripts.js:29 ~ table:", table);
    let id = $(this).data("id");
    // console.log("🚀 ~ file: myScripts.js:31 ~ id:", id);
    // alert(id);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed == true && id != "") {
          $.ajax({
            url: "/doctor/deletePrescription/",
            type: "post",
            data: { id },
            success: function (response) {
              if (response == 1) {
                location.reload(true);
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              swal("Error deleting!", "Please try again", "error");
            },
          });
        }
      });
  });
});
$(document).ready(function () {
  $(".deleteProduct").on("click", function () {
    // let table = $(this).attr("DataTables_Table_0");
    // console.log("🚀 ~ file: myScripts.js:29 ~ table:", table);
    let id = $(this).data("id");
    // console.log("🚀 ~ file: myScripts.js:31 ~ id:", id);
    // alert(id);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed == true && id != "") {
          $.ajax({
            url: "/admin/deleteProduct/",
            type: "post",
            data: { id },
            success: function (response) {
              if (response == 1) {
                location.reload(true);
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              swal("Error deleting!", "Please try again", "error");
            },
          });
        }
      });
  });
});
$(document).ready(function () {
  $(".deleteSupport").on("click", function () {
    // let table = $(this).attr("DataTables_Table_0");
    // console.log("🚀 ~ file: myScripts.js:29 ~ table:", table);
    let id = $(this).data("id");
    console.log("🚀 ~ file: myScripts.js:31 ~ id:", id);
    // alert(id);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed == true && id != "") {
          $.ajax({
            url: "/admin/deleteSupport/",
            type: "post",
            data: { id },
            success: function (response) {
              if (response == 1) {
                location.reload(true);
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              swal("Error deleting!", "Please try again", "error");
            },
          });
        }
      });
  });
});
function newsStatus(elem) {
  if (elem.checked == true) {
    var status = 1;
  } else {
    status = 0;
  }

  $.ajax({
    type: "POST",
    url: "/admin/newsstatus",
    data: { status: status, id: elem.id },
    // beforeSend: function (msg) {
    //   blockUI("#table_get");
    // },
    success: function (result) {
      //   unblockUI("#table_get");
      iziToast.success({
        title: "",
        position: "topRight",
        message: "Status updated successfully",
        timeout: 1000
      });
      // location.reload();
    },
  });
}

    toastr.options = {
      "closeButton": true,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "500",
      "timeOut": "1000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
  

// $(document).ready(function () {
//   $("#myTable", {
//     responsive: true,
//   }).DataTable();
//   // $("#table_get").DataTable();
//   // $("#subCategoryTable").DataTable();
//   // $("#doctorTable").DataTable();
//   // $("#invoiceTable").DataTable();
//   // $("#patientTable").DataTable();
//   // $("#rating_table").DataTable();
//   // $("#bookingsTable").DataTable();
// });
