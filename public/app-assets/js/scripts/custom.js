function blockUI(element = "") {
  if (element != "") {
    $(element).block({
      message: '<img src="/assets/img/Fidget-spinner.gif" width=50 height=50>',
    });
  } else {
    $.fn.center = function () {
      this.css("position", "absolute");
      this.css(
        "top",
        ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px"
      );
      this.css(
        "left",
        ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px"
      );
      return this;
    };
    $.blockUI({
      css: {
        backgroundColor: "transparent",
        border: "none",
      },
      message: '<img src="/assets/img/Fidget-spinner.gif" height=50 width=50>',
      baseZ: 1500,
      overlayCSS: {
        backgroundColor: "#FFFFFF",
        opacity: 0.9,
        cursor: "wait",
      },
    });
    $(".blockUI.blockMsg").center();
  }
}

function newBlockUi(id) {
  //   console.log(id, "????");
  var section = $(`${id}`);
  section.block({
    message:
      '<div class="d-flex justify-content-center align-items-center"><p class="me-50 mb-0">Please wait...</p><div class="spinner-grow spinner-grow-sm text-white" role="status"></div>',
    timeout: 1000,
    css: {
      backgroundColor: "transparent",
      color: "#fff",
      border: "0",
    },
    overlayCSS: {
      opacity: 0.5,
    },
  });
}

function unblockUI(element = "") {
  if (element != "") {
    $(element).unblock();
  } else {
    $.unblockUI();
  }
}
