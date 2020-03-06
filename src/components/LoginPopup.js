import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';

import { setLoginPopupVisibility} from '../actions';

const mapStateToProps = state => {
    return {		
		users: state.users,		
		current_user: state.current_user,
		login_popup_visible: state.login_popup_visible
	};
};

const LoginPopup = connect(mapStateToProps)(({users, current_user, login_popup_visible, dispatch}) => {
	const [tempName, setTempName] = useState("");
	const [tempNameError, setTempNameError] = useState(false);
	
	const responseFacebookCallback = (response)=>{
		//response && typeof data.fb === "function" && data.fb(response);
	}
	const handleTempNameChange = (e)=>{
		setTempName(e.target.value);	
		setTempNameError(false);
	}
	const handleTempNameClick = (e)=>{		
		setTempNameError(tempName.trim().length == 0);
	}	
	const closePopup =()=>{
		dispatch(setLoginPopupVisibility(false));
	}
	return(
		<div className="login-popup" style={{display: login_popup_visible ? "block" : "none"}}>
			<div className="login-popup-close" onClick={closePopup}><FontAwesomeIcon icon={faTimes} /></div>
			<div className="temp-login">
				<div>
					<div className="field-label">Enter your name for temporary registration:</div>
					<ButtonGroup>						
						<Form.Control size="sm" name="tempname" type="text" value={tempName} placeholder="Write you name.." onChange={handleTempNameChange} />						
						<Button size="sm" onClick={handleTempNameClick}>Ok</Button>
					</ButtonGroup>
					<div className="field-error">{tempNameError ? "Required field" : ""}</div>						
				</div>			
			</div>
			<div>or</div>
			<div className="fb-login">
				<FacebookLogin			
				appId="176592233585640"
				autoLoad={false}
				fields="name,email,picture"
				
				callback={responseFacebookCallback}
				version="3.1"
				cssClass="my-facebook-button-class"
				icon="fa-facebook"
			  />
			</div>
		</div>		
)});


export default LoginPopup;