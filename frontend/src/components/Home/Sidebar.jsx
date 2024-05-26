import React from 'react'
import { CgNotes } from "react-icons/cg";
import { MdLabelImportantOutline } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa";
import { TbNotebookOff } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';
import { useEffect } from 'react';
import axios from "axios"
import { useState } from 'react';
const Sidebar = () => {
    const dispatch=useDispatch()
    const history= useNavigate();
    const data=[
        {
            title: "All tasks",
            icon: <CgNotes />,
            link:"/",
        },
        {
            title: "Important tasks",
            icon: <MdLabelImportantOutline />,
            link:"/importantTasks",
        },
        {
            title: "Completed tasks",
            icon: <FaCheckDouble />,
            link:"/completedTasks",
        },
        {
            title: "Incomplete tasks",
            icon: <TbNotebookOff />,
            link:"/incompletedTasks",
        },
    ]
    const [Data, setData] = useState()
    const logout=()=>{
        localStorage.clear("id")
        localStorage.clear("token")
        dispatch(authActions.logout())
        history("/signup")
    }
    const headers= {
        id: localStorage.getItem("id"),
        authorization:`Bearer ${localStorage.getItem("token")}` 
    }
    useEffect(()=>{
        const fetch= async()=>{
            const response= await axios.get(`${window.location.origin}/api/v2/get-all-tasks`, {headers,})
            setData(response.data.data)
        }
        if(localStorage.getItem("id") && localStorage.getItem("token")){
            fetch()
        }
    }, [])
  return (
    <>
        {Data && (
            <div>
                <h2 className='text-xl fot-semibold'>{Data.username}</h2>
                <h4 className='mb-1 text-gray-400'>{Data.email}</h4>
                <hr />
            </div>
        )}
        <div>
            {data.map((items,i)=>(
                <Link to={items.link} key={i} className='my-2 flex items-center hover:bg-gray-600 p-2 rounded transition-all duration-300'>
                    {items.icon} 
                    <span className="mx-2"> </span> 
                    {items.title}
                </Link>
            ))}
        </div>
        <div>
            <button className='bg-gray-600 w-full p-2 rounded' onClick={logout}>Log Out</button>
        </div>
    </>
  )
}

export default Sidebar