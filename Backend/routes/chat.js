import express from "express";
import Thread from "../models/Thread.js"
import getOpenAIResponse from "../utils/openai.js";

const router = express.Router();



router.post("/test", async(req,res) => {
    try{
        const thread = new Thread({
            threadId: "xyz",
            title: "Testing Thread"
        });

        const response = await thread.save();
        console.log(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to save in DB"});
    }
});

router.get("/thread", async(req,res) => {
    try {
        const threads = await Thread.find({}).sort({updatedAt:-1});
        res.json(threads);
    }catch(err) {
        console.log(err);
        res.status(500).json({error:"Failed to fetch Threads"});
    }
});

router.get("/thread/:threadId", async(req,res) => {
    const {threadId} = req.params;

    try{
        const thread = await Thread.findOne({threadId});

        if(!thread) {
            res.status(404).json({error:"Thread Not Found!"});
        }

        res.json(thread.messages);

    }catch (err) {
        console.log(err);
        res.status(500).json({error:"Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async(req,res) => {
    const {threadId} = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread) {
            res.status(404).json({error:"Thread not found!"});
        }

        res.status(200).json({success:"Thread Deleted Succesfully"});

    }catch(err) {
        console.log(err);
        res.status(500).json({error:"Failed to delete thread"});
    }
});

router.post("/chat", async(req,res) => {
    const {threadId,message} = req.body;

    if(!threadId || !message) {
        res.status(400).json({error:"missing required fields"});
    }

    try{
        let thread = await Thread.findOne({threadId});

        if(!thread) {
            thread = new Thread({
                threadId,
                title:message,
                messages:[{role:"user",content:message}]
            });
        }else {
            thread.messages.push({role:"user", content:message});
        };

        const assistantReply = await getOpenAIResponse(message);

        thread.messages.push({role:"assistant", content:assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply:assistantReply});

    }catch(err) {
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    }
});


export default router;

