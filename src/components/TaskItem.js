import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faEnvelope, faComment} from '@fortawesome/free-solid-svg-icons';
import axios, { post } from 'axios';

const TaskItem = ({user, id, name, load_date, last_edit_date}) => {
	const [messages, setMessages] = useState(0);
	const [texts, setTexts] = useState(0);
	let dataItems = [[`texts_${id}`, setTexts], [`messages_${id}`, setMessages]];
	
	useEffect(() => {
		const url = '/db.php';
		let loadingArr = [];		
		dataItems.forEach((item)=>{
			const formData = new FormData();		
			formData.append("action", "count");
			formData.append("data", "");				
			formData.append("name", item[0]);
			loadingArr.push(post(url, formData));
		});
		axios.all(loadingArr).then(axios.spread((...responses) => {				
			dataItems.forEach((item, index)=>{
				let res = responses[index];				
				if(res.data.error == false){
					let count = res.data.data;					
					dataItems[index][1](count);
				}
			});		
		})).catch(errors => {
			console.log("loading error");		
		});		
	}, [last_edit_date]);	
	return(
		<div className="task-item">
			<small><div className="user-info" style={{display: "flex", marginLeft: "auto"}}>						
				<span className="user-photo">{user.photo ? <img src={user.photo} title={user.name}/> : <i><FontAwesomeIcon icon={faUserGraduate} /></i> }</span>
				<span className="user-name">
					{user.name}<br/>
					<small>Created: {load_date} <br/>
					Updated: {last_edit_date}</small>
				</span>								
			</div></small>
			<div className="task-name">{name}</div>
			<div className="task-info">
				<span>{messages} <FontAwesomeIcon icon={faEnvelope} /></span>
				<span>{texts} <FontAwesomeIcon icon={faComment} /></span>
			</div>
		</div>		
)};


export default TaskItem;