import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog} from '@fortawesome/free-solid-svg-icons';

import { editTaskVisibility, removeTask, copyTask} from '../actions';

const mapStateToProps = state => {
    return {		
		users: state.users,		
		current_user: state.current_user,
		current_task: state.current_task,
		tasks: state.tasks
	};
};
const TaskSettings = connect(mapStateToProps)(({users, tasks, current_user, current_task, dispatch}) => {
	let taskData = tasks.filter((tsk)=>tsk.id == current_task);
	taskData = taskData.length > 0 ? taskData[0] : null;
	let copyOfTask = tasks.filter((tsk)=>current_user==tsk.user_id && tsk.copy==current_task);
	let copyes = tasks.filter((tsk)=>current_user==tsk.user_id && tsk.copy==current_task);
	const [taskHidden, setTaskHidden] = useState(taskData.hidden);
	const [modal, setModal] = useState({
		show: false,
		title: "",
		text: "",
		ok: "",
		okFunction: null
	});	
	const taskVisibilityChange = (e)=>{
		dispatch(editTaskVisibility(current_task, e.target.checked));		
	}

	return(
		<>	
		{taskData ? 
			<>
			<div className="settings-container">
				<div className="settings-header">
					<FontAwesomeIcon icon={faCog} />
				</div>
				<div className="settings-body">
					<ul>{
						current_user == taskData.user_id ?
						<>
						<li>
							<div className="group-item-top">
								<input type="checkbox" name="hideTask" id="hideTaskCbx" value="0" checked={taskData.hidden} onChange={taskVisibilityChange}  />
								<label htmlFor="hideTaskCbx">Hide this task</label>																													
							</div>						
						</li>
						<li><Button size="sm" variant="link" onClick={()=>setModal({
							title: "Remove task", 
							text: "Are you sure? Task will be removed forever and without recovering!", 
							ok: "I am sure! Remove this task!",
							okFunction: ()=>{
								dispatch(removeTask(current_task));
								let reloadHref = localStorage.getItem("reload_href_edithomework");
								if(reloadHref !== null){
									localStorage.removeItem("reload_href_edithomework");
									window.location.href = reloadHref;
								}								
							},
							show: true})}>Remove this task</Button></li>						
						</> :
						copyOfTask.length > 0 ?
						<li>You have copy of this task - <a href={"/task/" + copyOfTask[0].id}> {copyOfTask[0].name}</a></li>
					: <></> }
						<li><Button size="sm" variant="link" onClick={()=>{
							dispatch(copyTask(current_task, current_user));
							let reloadHref = localStorage.getItem("reload_href_edithomework");
							if(reloadHref !== null){
								localStorage.removeItem("reload_href_edithomework");
								window.location.href = reloadHref;
							}
							
						}}>Make copy</Button></li>
											
					</ul>
				</div>
			</div>
			<Modal show={modal.show} onHide={()=>{setModal({...modal, show: false})}}>
				<Modal.Header closeButton>
					<Modal.Title>{modal.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{modal.text}</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={()=>{setModal({...modal, show: false})}} >
						Cancel
					</Button>				
					<Button variant="primary" onClick={()=>{
						setModal({...modal, show: false});
						if(typeof modal.okFunction == "function"){
							modal.okFunction();
						}
						}} >
						{modal.ok}
					</Button>
				</Modal.Footer>
			</Modal>
			</>
			: <></>	
		}

		</>		
)});


export default TaskSettings;