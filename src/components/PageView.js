import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import TasksList from './TasksList';
import TaskView from './TaskView';
import Paginator from './Paginator';
import TaskSettings from './TaskSettings';
import EditableField from './EditableField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faCaretDown,faTimes } from '@fortawesome/free-solid-svg-icons';
import { editTaskName} from '../actions';

const mapStateToProps = state => {
    return {		
		users: state.users,		
		current_user: state.current_user,
		current_task: state.current_task,
		tasks: state.tasks
	};
};
const PageView = connect(mapStateToProps)(({users, tasks, current_user, current_task, dispatch}) => {
	const [tasksVisibility, setTasksVisibility] = useState(true);
	
	let taskData = tasks.filter((tsk)=>tsk.id==current_task);
	taskData = taskData.length > 0 ? taskData[0] : null;
	let userData = null;
	if(taskData){
		userData = users.filter((us)=>us.id==taskData.user_id);
		userData = userData.length > 0 ? userData[0] : null;		
	}
	
	const handleChangeTaskName = (name)=>{
		dispatch(editTaskName(current_task, name));
	}
	useEffect(() => {		
		let tasksVisibilitySaved = localStorage.getItem("tasks_visibility_edithomework");		
		if(tasksVisibilitySaved !== null){
			setTasksVisibility(tasksVisibilitySaved == "true");			
		}	
		
	}, []);		
	return(
		<>			
			<div className="image-column">
				<div className="image-column__header">
					<div style={{display: "flex"}}>
						<div>
							<h5>{userData.id == current_user ? 
								<EditableField {...{text: taskData.name, saveTextFunction: handleChangeTaskName}}/>
								: <>{taskData.name}</>
							}	
							</h5>						
							<div className="user-info" style={{display: "flex", marginLeft: "auto"}}>						
								<span className="user-photo">{userData.photo ? <img src={userData.photo} title={userData.name}/> : <i><FontAwesomeIcon icon={faUserGraduate} /></i> }</span>
								<span className="user-name">
									{userData.name}<br/>
									<small>Created: {taskData.load_date} <br/>
									Updated: {taskData.last_edit_date}</small>
								</span>								
							</div>	
						</div>
						<TaskSettings/>
						<div style={{ marginLeft: "auto"}}><Paginator/></div>
					</div>
					
				</div>
				<div className="image-column__content">
					<TaskView/>
				</div>								
			</div>	
			<div className="tasks-column">
				<div className="tasks-title" onClick={(e)=>{e.preventDefault;setTasksVisibility(!tasksVisibility); localStorage.setItem("tasks_visibility_edithomework", !tasksVisibility);}}><h5>Tasks:  <FontAwesomeIcon icon={faCaretDown} /></h5></div>
				<div className="tasks-value" style={{display: tasksVisibility ? "block" : "none"}}>
					<span className="close-btn" title="Close tasks list" onClick={(e)=>{e.preventDefault;setTasksVisibility(false);localStorage.setItem("tasks_visibility_edithomework", false);}}><FontAwesomeIcon icon={faTimes} /></span>
					<TasksList/>
				</div>
			</div>
		</>		
)});


export default PageView;