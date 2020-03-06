import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import FileUploader from './FileUploader';
import TaskItem from './TaskItem';

const mapStateToProps = state => {
    return {
		tasks: state.tasks,
		users: state.users,
		current_task: state.current_task,
		current_user: state.current_user		
	};
};

const TasksList = connect(mapStateToProps)(({users, tasks, current_task, current_user}) => {
	const sortingData = {
		"name": "Name",
		"load_date": "Date of creation",
		"last_edit_date": "Date of change",
	};
	const [my, setMy] = useState(false);
	const [sortBy, setSortBy] = useState(Object.keys(sortingData)[0]);
	useEffect(() => {		
		let myChecked = localStorage.getItem("my_checked_edithomework");		
		if(myChecked !== null){
			setMy(myChecked== "true");			
		}
		let sortBy = localStorage.getItem("sort_by_edithomework");		
		if(sortBy !== null){
			setSortBy(sortBy);			
		}		
		
	}, []);	
	return(
		<>	
		<div className="task-loader">			
			<FileUploader/>
		</div>
		<div className="tasks-list">
		<div className="tasks-sorting">			
			<div className="group-item-top">
				<div>Sort by: </div>
				{Object.keys(sortingData).map((key, index)=>{
					return (<div style={{display: "flex"}} key={index}>
					<input type="radio" name="sortTasks" id={"sortTasksCbx"+index} value={key} onChange={(e)=>{setSortBy(key); localStorage.setItem("sort_by_edithomework", key);}} checked={sortBy==key}  />
					<label htmlFor={"sortTasksCbx"+index}>{sortingData[key]}</label>																													
				</div>)
				})}				
			</div>				
			<div className="group-item-top">
				<input type="checkbox" name="myTasks" id="myTasksCbx" value="0" onChange={(e)=>{setMy(e.target.checked); localStorage.setItem("my_checked_edithomework", e.target.checked);}} checked={my} />
				<label htmlFor="myTasksCbx">Show only my tasks</label>																													
			</div>				
		</div>
		<div className="tasks-scroll">
		{tasks
			.filter((tsk)=>{ return (my ? current_user == tsk.user_id : true)})
			.sort((a,b)=>{	
				let a1 = sortBy == "name" ? a[sortBy] : +new Date(a[sortBy]);
				let b1 = sortBy == "name" ? b[sortBy] : +new Date(b[sortBy]);
				return sortBy == "name" ? a1 > b1 ? 1 : a1 < b1 ? -1 : 0 : a1 < b1 ? 1 : a1 > b1 ? -1 : 0;
			})
			.map((task, index)=>{
			let taskUser = users.filter((us)=>us.id == task.user_id);
			taskUser = taskUser.length > 0 ? taskUser[0] : null;
			let taskData = {
				...task,
				user: taskUser
			};
			return(<div  key={index} className="task">
				{task.hidden == true && current_user !== task.user_id ? <></> :
					current_task == task.id ? 
					<div><TaskItem {...taskData} /></div> : 
					<a href={"/task/" + task.id} title={task.name}><TaskItem {...taskData} /></a>}				
			</div>);
		})}
		</div>
		</div>
		</>		
)});


export default TasksList;