import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faBell } from '@fortawesome/free-solid-svg-icons';
import EditableField from './EditableField';

const mapStateToProps = state => {
    return {		
		users: state.users,		
		current_user: state.current_user
	};
};

const UserBlock = connect(mapStateToProps)(({users, current_user}) => {
	const [notifyVisible, setNotifyVisible] = useState(false);
	let userInfo = users.filter((us)=>{ return us.id == current_user});
	userInfo = userInfo.length ? userInfo[0] : null;
	const setNotifyVisibleClick = ()=>{
		setNotifyVisible(!notifyVisible);
	}
	const handleChangeUserName = (name)=>{
		console.log("new name", name);
	}
	return(
		<>{userInfo !== null ? 			
			<span className="user-info">
				<span className="user-photo">{userInfo.photo ? <img src={userInfo.photo} title={userInfo.name}/> : <i><FontAwesomeIcon icon={faUserGraduate} /></i> }</span>
				<span className="user-name"><EditableField {...{text: userInfo.name, saveTextFunction: handleChangeUserName}}/></span>
			</span> : <></>}
			<Button size="sm">Logout</Button>
		</>		
)});


export default UserBlock;