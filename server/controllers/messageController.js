import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
    // console.log("message sent", req.params.id);

    try {
        const {message} = req.body;
        const { id: receiverId} = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId,receiverId] },
        });

        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId,receiverId]
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.message.push(newMessage._id);
        }

        // await conversation.save();
        // await newMessage.save();
          await Promise.all([conversation.save(),newMessage.save()]);
            //socket io functionality

            const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}



        res.status(201).json(newMessage);


    } catch (error) {

        console.log("Error in sendMessage controller :", error.message);
        res.status(500).json({error:"Internal server Error"});
    }
};


export const getMessages = async (req,res) => {
    try { 
        const {id:userToChatId} = req.params;
        const senderId = req.user._id;


        const conversation = await Conversation.findOne({
            participants: {$all: [senderId,userToChatId]},

        }).populate("message"); // not reference but actuasl messages

        if(!conversation) return res.status(200).json([]);

        res.status(200).json(conversation.message); 

    }catch(error) {
        console.log("Error in getMessage controller", error.message);
        res.status(500).json({error:"Internal server Error"});
    }
};