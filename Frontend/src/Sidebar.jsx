import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";
import server from "./environment.js";
import logo from "./assets/blacklogo.png";



function Sidebar() {

    const {allThreads, setAllThreads , currThreadId, setNewChat, setPrompt, prevChats,reply,setReply, setCurrThreadId, setPrevChats,setLatestReply,newChat} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${server}/api/thread`);
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId:thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        }catch(err) {
            console.log(err);
        }

    }

    useEffect(() => {
        getAllThreads();
    },[currThreadId]);

    const createNewChat = () => {
        const newThreadId = uuidv1();
        setPrevChats(() => []);
        setReply(null);
        setLatestReply(null);
        setPrompt("");
        setCurrThreadId(newThreadId);
        setNewChat(true);
    }

    const changeThread = async (newThreadId) => {
        setReply(null);
        setLatestReply(null);
        setPrevChats([]);
        setNewChat(false);
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${server}/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        }catch(err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try{
            const response = await fetch(`${server}/api/thread/${threadId}`,{method: "DELETE"});

            //updated thread re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !==threadId));

            if(threadId ===currThreadId) {
                createNewChat();
            }
        }catch(err){
            console.log(err);
        }
    }
    return(
        <section className="sidebar" >
        
            <button onClick={createNewChat}>
                <img src={logo} alt="gpt logo" className="logo"></img><p>New chat</p>
                <i className="fa-solid fa-pen-to-square"></i>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread) => (
                        <li key={thread.threadId} onClick={(e) => changeThread(thread.threadId)} className={thread.threadId===currThreadId ? "highlighted" : ""}>
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>By Yash <i className="fa-solid fa-code"></i></p>
            </div>
        </section>
    )
}

export default Sidebar;