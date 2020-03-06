import React, { useState, useEffect, useRef } from "react";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faTrash } from '@fortawesome/free-solid-svg-icons';


const Messager = ({messages, users, user, addMessageF, removeMessageF}) => {
	const messagesEndRef = useRef(null);
	const [message, setMessage] = useState("");
	const scrollToBottom = () => {
		if (!messagesEndRef.current) return;
		const scrollHeight = messagesEndRef.current.scrollHeight;
		const height = messagesEndRef.current.clientHeight;
		const maxScrollTop = scrollHeight - height;
		messagesEndRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;		
	}
	
	
	const changeMessage = (e)=>{
		setMessage(e.target.value);
	}
	const addMessageClick = (e)=>{	
		message.trim().length > 0 && typeof addMessageF === "function" && addMessageF(message.split('\n'));
		setMessage("");
	}
	const removeMessageClick = (e, id)=>{
		e.preventDefault();		
		e.stopPropagation();		
		typeof removeMessageF === "function" && removeMessageF(id);
	}
	useEffect(() => {		
		scrollToBottom();
console.log("scroll bottom");		
	});
	return(
		<div className="messages-container">
			<div className="messages-list" ref={messagesEndRef}>
			{messages.map((msg, index)=>{
				let msgUser = users.filter((us)=>us.id==msg.user_id);
				msgUser = msgUser.length > 0 ? msgUser[0] : null;
				return(
				<div key={index} className={user == msg.user_id ? "my-message message": "message"}>
					<div className="message-header">
						<span className="user-info" style={{"display": "flex"}}>
							<span className="user-photo">{msgUser && msgUser.photo ? <img src={msgUser.photo} title={msgUser.name}/> : <i><FontAwesomeIcon icon={faUserGraduate} /></i> }</span>
							<span className="user-name">{msgUser ? msgUser.name : "unsigned user"}
								<div className="user-date"><small>{msg.date}</small></div>
							</span>							
							{user == msg.user_id ? <Button size="sm" title="Click to Remove this message" className="edit-btn" onClick={(e)=>removeMessageClick(e, msg.id)}><FontAwesomeIcon icon={faTrash} /></Button> : <></>}
						</span>
						
					</div>
					<div className="message-body">
					{msg.message.map((msg)=>(<div>{msg}</div>))}
					</div>
				</div>
			)})}
			
			</div>
			<div className="messages-form">
				<textarea placeholder="Add your message..." onChange={changeMessage} value={message}/>	
				<div style={{textAlign: "right"}}><Button size="sm" onClick={addMessageClick}>Add Message</Button></div>
			</div>
		</div>		
)};


export default Messager;