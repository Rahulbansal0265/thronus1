const sockets = require("./models/socket");
const constant = require("./models/constant");
const message = require("./models/message");
const user = require("./models/users");
const block = require("./models/blockSchema");
const helper = require("./helper/helper");
const mongoose = require("mongoose");

module.exports = function (io) {
    // console.log("user connected");
    io.on('connection', function (socket) {
        console.log('User connected successfully');

        socket.on('connect_user', async function (connect_listener) {
            try {
                // console.log(connect_listener,"============connect_listener=========");
                if (connect_listener.userId) {
                    var socketKey = socket.id
                    let userCheck = await sockets.findOne({
                        userId: connect_listener.userId,
                        type: connect_listener.type
                    });
                    if (userCheck) {
                        createUserSocket = await sockets.findByIdAndUpdate({
                            _id: userCheck._id
                        }, {
                            sockeId: socket.id,
                        });
                    } else {
                        createUserSocket = await sockets.create({
                            userId: connect_listener.userId,
                            sockeId: socketKey,
                            type: connect_listener.type
                        });
                    }
                    success_message = [];
                    success_message = {
                        'success_message': 'User connected successfully1'
                    }
                    socket.emit('connect_listener', success_message);
                }
                // console.log("User id not found");
            } catch (error) {
                console.log(">>>>>>>>ERROR", error);
                throw error
            }
        });

        //======================= send message  ================================
        socket.on("send_message", async (chatData) => {
            try {

                let checkUserMessages = await constant.findOne({
                    $or: [
                        { senderId: chatData.senderId, receiverId: chatData.receiverId },
                        { senderId: chatData.receiverId, receiverId: chatData.senderId }
                    ]
                });

                if (checkUserMessages) {
                    // console.log(">>>>>>>>>>> Already exist",checkUserMessages);
                } else {
                    checkUserMessages = await constant.create({
                        senderId: chatData.senderId,
                        receiverId: chatData.receiverId,
                    });
                }

                // insert chat data in messages table
                let insertChat = await message.create({
                    senderId: chatData.senderId,
                    receiverId: chatData.receiverId,
                    message: chatData.message,
                    chatConstantId: checkUserMessages._id,
                    messageType: chatData.messageType ? chatData.messageType : 0,
                });

                // send push notification 

                let getuser = await user.findOne({
                    _id: chatData.receiverId
                });
                let sender_data = await user.findOne({
                    _id: chatData.senderId
                });
                var new_message = chatData.message;
                if(chatData.messageType == 1){
                    new_message = "Sent Image";
                }
                let all_data = {
                    msg: new_message,
                    sender_id: chatData.senderId,
                    sender_name: sender_data?.firstName,
                    senderImage: sender_data?.image,
                    senderRole: sender_data?.role,
                    device_token: getuser?.deviceToken,
                    receiverId: chatData.receiverId,
                    receiver_name: getuser?.firstName,
                    receiverImage: getuser?.image,
                    receiverRole: getuser?.role,
                    noti_type: 1,
                    receiverChatStatus: getuser.chatStatus ? getuser.chatStatus : 1,
                }
                // if(getuser && getuser.room_id != null && checkUserMessages._id != getuser.room_id){
                //     await helper.sendFCMnotification(all_data);
                // }
                // if(getuser.room_id == checkUserMessages._id){
                    
                    // console.log(sender_data,">>>>>>>>sender_data");
                    // console.log(checkUserMessages._id,">>>>>>>>_id");
                    // console.log(sender_data.room_id,">>>>>>>>room_id");
                // }
                // if(getuser && checkUserMessages._id == getuser.room_id){
                //     console.log("i am here in chat notification>>>>>>>");
                // }else{
                //     await helper.sendFCMnotification(all_data);
                // }
                // if (getuser && getuser.room_id && checkUserMessages && checkUserMessages._id) {
                //     if (getuser.room_id.toString() === checkUserMessages._id.toString()) {
                //         console.log("object");
                //     } else {
                //         await helper.sendFCMnotification(all_data);
                //     }
                // } 
                // else {
                //     console.error("Either getuser or checkUserMessages or their IDs are null or undefined");
                // }
                if (getuser && checkUserMessages) {

                    if(getuser.room_id && checkUserMessages._id){
                        if (getuser.room_id.toString() === checkUserMessages._id.toString()) {
                            console.log("object");
                        } else {
                            await helper.sendFCMnotification(all_data);
                        }
                    }else{
                        await helper.sendFCMnotification(all_data);
                    }
                } 
                else {
                    console.error("Either getuser or checkUserMessages or their IDs are null or undefined");
                }
                
                

                // Update last message id in chat_constant table

                let updateLastMessageId = await constant.findByIdAndUpdate({
                    _id: checkUserMessages._id
                },
                    {
                        lastMessageId: insertChat._id
                    }
                );

                // Get reciver user socket key
                let getUserSocketKey = await sockets.findOne({
                    userId: chatData.receiverId
                });

                // console.log(adminId,">>>>>>>>>>>socket>>>>>>>>>>>>>>>>")
                // Get Old Message
                let oldMessages = await message.findOne({
                    _id: insertChat._id,
                }).populate({
                    path : "receiverId",
                    select : "_id image"
                })
                // let oldMessages = await getLastMessage(checkUserMessages);
                socket.to(getUserSocketKey?.sockeId).emit('send_message', oldMessages);
                socket.emit('send_message', oldMessages);
                // console.log("data inserted successfully");
            } catch (error) {
                console.log(">>>>>>send_message", error);
                throw error
            }
        });
        socket.on("get_message_list", async (chatData) => {
            try {
                // console.log("chat",chatData);
                let chat_list = await constant.find({
                    $or: [
                        { senderId: chatData.senderId },
                        { receiverId: chatData.senderId }
                    ]
                })
                    .populate({
                        path: "senderId",
                        select: "_id firstName lastName image role chatStatus",
                        model: user
                    })
                    .populate({
                        path: "receiverId",
                        select: "_id firstName lastName image role chatStatus",
                        model: user
                    }).populate("lastMessageId")
                    .sort({ updatedAt: -1 }); // Sort by updatedAt field in descending order (latest first) chatConstantId

                var dataArr = JSON.parse(JSON.stringify(chat_list));
                // console.log(dataArr,">>>>>>>>>>dataArr");
                if(dataArr.length > 0){
                    for (let i in dataArr) {
                        var chatCount = await message.find({
                            senderId: dataArr[i].senderId?._id == chatData.senderId ? dataArr[i].receiverId?._id : dataArr[i].senderId?._id, receiverId: chatData.senderId,
                            readStatus: 0
                        });
                        // console.log(chatCount.length,"LLLLLLL");
                        dataArr[i].count = chatCount.length
                    }
                }

                socket.emit("get_message_list", dataArr);
            } catch (error) {
                console.log(">>>>>>>>>", error);
            }
        });
        socket.on("get_messages", async (chatData) => {
            // console.log("chatData",chatData);
            try {
                // let checkMessage = await getChatConstantId(chatData.senderId,chatData.receiverId);
                let checkMessage = await constant.findOne({
                    $or: [
                        { senderId: chatData.senderId, receiverId: chatData.receiverId },
                        { senderId: chatData.receiverId, receiverId: chatData.senderId }
                    ]
                }).populate({
                    path: "senderId",
                    select: "_id firstName lastName image role",
                    model: user
                }).populate({
                    path: "receiverId",
                    select: "_id firstName lastName image role",
                    model: user
                });
                let chk_block_status = await block.findOne({
                    $or: [
                        { blockedBy: chatData.senderId, blockedTo: chatData.receiverId, },
                        { blockedBy: chatData.receiverId, blockedTo: chatData.senderId, }
                    ]
                });
                // console.log(checkMessage,">>>>>>>>>>>>>");
                // return
                // let getAllOldMessage = await getallBookingMessage(checkMessage,chatData);
                // await message.update({
                //     senderId: chatData.receiverId,
                //     receiverId: chatData.senderId 
                // },{
                //         readStatus : 1,
                // });
                let getAllOldMessage = await message.find({
                    chatConstantId: checkMessage?._id
                })
                .sort({ createdAt: "asc" });
                
                let obj = {
                    senderDetails: checkMessage,
                    getAllOldMessage: getAllOldMessage,
                    blockStatus: chk_block_status,
                }
                socket.emit('get_messages', obj);
            } catch (error) {
                console.log(">>>>>>>>>>>>", error);
                throw error
            }
        });
        socket.on("block_unblock", async (chatData) => {
            try {
                var chk_exist_data = await block.findOne({
                    blockedTo: chatData.blockedTo,
                    blockedBy: chatData.blockedBy,
                });
                var msg = "";
                if (chk_exist_data) {
                    await block.findByIdAndDelete({ _id: chk_exist_data._id });
                    msg = "Unblock successfully";
                } else {
                    chk_exist_data = await block.create({
                        blockedTo: chatData.blockedTo,
                        blockedBy: chatData.blockedBy,
                    });
                    msg = "Block successfully";
                }
                var updated_data = await block.findOne({
                    blockedTo: chatData.blockedTo, blockedBy: chatData.blockedBy
                    // $or : [
                    //     { blockedTo: chatData.blockedTo,blockedBy: chatData.blockedBy},
                    //     { blockedTo: chatData.blockedBy,blockedBy: chatData.blockedTo}
                    // ]
                });
                let getUserSocketKey = await sockets.findOne({
                    userId: chatData.blockedTo
                });

                let all_data = {
                    blockStatus: updated_data,
                    message: msg
                }
                socket.to(getUserSocketKey?.sockeId).emit('block_unblock', all_data);
                socket.emit('block_unblock', all_data);
            } catch (error) {
                console.log(">>>>>>>>>>>>", error);
                throw error
            }
        });
        socket.on("read_message", async (chatData) => {
            try {
                let update_message = await message.update({
                    senderId: chatData.receiverId,
                    receiverId: chatData.senderId 
                },{
                        readStatus : 1,
                });
                let msg = "message read succesfully"
               
                // socket.to(getUserSocketKey?.sockeId).emit('block_unblock', all_data);
                socket.emit('read_message',msg);
            } catch (error) {
                console.log(">>>>>>>>>>>>", error);
                throw error
            }
        });
        socket.on("update_chat_screen_id", async (chatData) => {
            try {
                if (!mongoose.Types.ObjectId.isValid(chatData.senderId)) {
                    throw new Error(`Invalid senderId: ${chatData.senderId}`);
                }
                const senderObjectId = mongoose.Types.ObjectId(chatData.senderId);
                if(chatData.room_id == 0){
                    await user.updateOne(
                        { _id: senderObjectId },
                        { room_id: null }
                    );
                }else{
                    await user.updateOne(
                        { _id: senderObjectId },
                        { room_id: chatData.room_id }
                    );
                }
        
                let msg = "updated successfully";
                socket.emit('update_chat_screen_id', msg);
               
            } catch (error) {
                console.log(">>>>>>>>>>>>", error);
                throw error
            }
        });



    });
}