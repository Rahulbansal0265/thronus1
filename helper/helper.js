var FCM = require('fcm-node');

module.exports = {
  success: function (res, message = "", body = {}) {
    return res.status(200).json({
      success: true,
      code: 200,
      message: message,
      body: body,
    });
  },

  error: function (res, err, req) {
    // console.log(err, "===========================>error");
    let code = typeof err === "object" ? (err.code ? err.code : 403) : 403;
    let message =
      typeof err === "object" ? (err.message ? err.message : "") : err;
    if (req) {
      req.flash("flashMessage", {
        color: "error",
        message,
      });
      const originalUrl = req.originalUrl.split("/")[1];
      return res.redirect(`/${originalUrl}`);
    }
    return res.status(code).json({
      success: false,
      message: message,
      code: code,
      body: {},
    });
  },

  failed: function (res, message = "") {
    message =
      typeof message === "object"
        ? message.message
          ? message.message
          : ""
        : message;
    return res.status(400).json({
      success: false,
      code: 400,
      message: message,
      body: {},
    });
  },
  unixTimestamp: function () {
    var time = Date.now();
    var n = time / 1000;
    return (time = Math.floor(n));
  },
  checkValidation: async (v) => {
    var errorsResponse;
    await v.check().then(function (matched) {
      if (!matched) {
        var valdErrors = v.errors;
        var respErrors = [];
        Object.keys(valdErrors).forEach(function (key) {
          if (valdErrors && valdErrors[key] && valdErrors[key].message) {
            respErrors.push(valdErrors[key].message);
          }
        });
        errorsResponse = respErrors.join(", ");
      }
    });
    return errorsResponse;
  },

 // Adjust the fileUpload function to handle the correct path
fileUpload: function (file, folder = 'users') {
  let file_name_string = file.name;
  var file_name_array = file_name_string.split(".");
  var file_ext = file_name_array[1];

  var letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
  var result = "";
  while (result.length < 28) {
    var rand_int = Math.floor(Math.random() * 19 + 1);
    var rand_chr = letters[rand_int];
    if (result.substr(-1, 1) != rand_chr) result += rand_chr;
  }
  var resultExt = `${result}.${file_ext}`;

  // Adjusted path, removing "public/" from the destination
  file.mv(`public/images/${folder}/${result}.${file_ext}`, function (err) {
    if (err) {
      throw err;
    }
  });

  // Adjusted return path, removing "public/" from the return value
  return `/images/${folder}/${result}.${file_ext}`;
}
,
  fileUploader(file, folder = "users") {
    console.log(file, "===================================##@@");

    let file_name_string = file.name;
    console.log("🚀 ~ file: helper.js:98 ~ fileUploader ~ file_name_string:", file_name_string)
    var file_name_array = file_name_string.split(".");
    var file_ext = file_name_array[file_name_array.length - 1];
    var letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
    var result = "";
    while (result.length < 28) {
      var rand_int = Math.floor(Math.random() * 19 + 1);
      var rand_chr = letters[rand_int];
      if (result.substr(-1, 1) != rand_chr) result += rand_chr;
    }
    var resultExt = `/images/${folder}/${result}.${file_ext}`;
    file.mv(`public/images/${folder}/${result}.${file_ext}`, function (err) {
      if (err) {
        throw err;
      }
    });
    return resultExt;
  },
  sendFCMnotification:async(all_data) => {
    var message = {
      to: all_data.device_token,
      // to:'ciF_C0vWQfCjrO3my6tKok:APA91bEYS3YBwlqPryaUg-6qsKZzEJufQINcr-G40WLQZ7pzxlaCP4ROfmUUf5gwC4Z4XPfw-uJ_ETJZ72DHaizZp3Ims6UZIBnU6KePt1_o4NzzA-GL47Xr1SWFYeUWPae-vRcC4aSK', 
      collapse_key: 'your_collapse_key',
      
      notification: {
          title: 'Geracao Thronus', 
          body: all_data.msg, 
          sender_id: all_data.sender_id,
          sender_name: all_data.sender_name,
          senderImage: all_data.senderImage,
          senderRole: all_data.senderRole,
          notification_type: all_data.noti_type,
          receiverId: all_data.receiverId,
          receiver_name: all_data.receiver_name,
          receiverImage: all_data.receiverImage,
          receiverRole: all_data.receiverRole,
          receiverChatStatus: all_data.receiverChatStatus ? all_data.receiverChatStatus : 1,
      },
      
      data: {
        title: 'Geracao Thronus', 
        body: all_data.msg, 
        sender_id: all_data.sender_id,
        sender_name: all_data.sender_name,
        senderImage: all_data.senderImage,
        senderRole: all_data.senderRole,
        notification_type: all_data.noti_type,
        receiverId: all_data.receiverId,
        receiver_name: all_data.receiver_name,
        receiverImage: all_data.receiverImage,
        receiverRole: all_data.receiverRole,
        receiverChatStatus: all_data.receiverChatStatus ? all_data.receiverChatStatus : 1,
    },
  };
  var fcm = new FCM(process.env.serverKey);
  // console.log(message,">>>>>>>>>>>>>>>>>>>>>>>>>>message");
  fcm.send(message, function(err, response){
      if (err) {
          console.log("Something has gone wrong!");
      } else {
          console.log("Successfully sent with response: ", response);
      }
  });
  },
  sendFCMnotificationImage:async(all_data) => {
    var message = {
      to: all_data.device_token,
      // to:'fnQJR9HJRWqJZ_r-Qpg4LN:APA91bGLeOAkER9rIa6jEXqHI2WUiMhH7QenJ92qbb6ZTyGaZyzpFNm36eLVP1hYzeUlS8MetYGCIahXuDced1PjCFwyMWw9u2IJcDATjMGMmbOh0oXDuJziDBmKGJ1de10ZZspzvAUk', 
      collapse_key: 'your_collapse_key',
      
      notification: {
          title: 'Geracao Thronus', 
          body: all_data.msg, 
          sender_name: all_data.sender_name,
          notification_type: all_data.noti_type,
          image: all_data.image,
      },
      
      data: {
        title: 'Geracao Thronus', 
        body: all_data.msg, 
        sender_name: all_data.sender_name,
        notification_type: all_data.noti_type,
        image : all_data.image,
    },
  };
  var fcm = new FCM(process.env.serverKey);
  fcm.send(message, function(err, response){
      if (err) {
          console.log("Something has gone wrong!");
      } else {
          console.log("Successfully sent with response: ", response);
      }
  });
  }
};
