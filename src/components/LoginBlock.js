import React from 'react';
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import Button from 'react-bootstrap/Button';
import { setLoginPopupVisibility, editUserName, signFB} from '../actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faBell } from '@fortawesome/free-solid-svg-icons';
import EditableField from './EditableField';

const mapStateToProps = state => {
    return {		
		users: state.users,		
		current_user: state.current_user
	};
};

const LoginBlock = connect(mapStateToProps)(({users, current_user, dispatch}) => {
	let userData = users.filter((us)=>us.id==current_user);
	userData = userData.length > 0 ? userData[0] : null;
	const showLoginPopup = ()=>{
		dispatch(setLoginPopupVisibility(!login_popup_visible));
	}
	const handleChangeUserName = (name)=>{		
		dispatch(editUserName(current_user, name));
	}	
	const responseFacebookCallback = (response)=>{		
			response.id && dispatch(signFB({				
				name: response.name,
				key: response.id,
				photo: response.picture.data.url
			}));		
	}	
	const handleLogoutClick = ()=>{
		localStorage.removeItem("current_user_edithomework");
		document.location.reload();
	}
	return(
		<div className="login-block" style={{display: "flex"}}>
		{userData ? 
			<><span className="user-info" style={{display: "flex"}}>
				Hello, 
				<span className="user-photo">{userData.photo ? <img src={userData.photo} title={userData.name}/> : <i><FontAwesomeIcon icon={faUserGraduate} /></i> }</span>
				<span className="user-name">{userData.key ? <>{userData.name}</> : <EditableField {...{text: userData.name, saveTextFunction: handleChangeUserName}}/>}</span>
			</span>
			{userData.key ? <>
				<Button size="sm" onClick={handleLogoutClick}>Logout</Button>
			</> :
			<span className="fb-login">
				or 
				<FacebookLogin			
				appId="176592233585640"
				autoLoad={false}
				fields="name,email,picture"
				
				callback={responseFacebookCallback}
				version="3.1"
				cssClass="my-facebook-button-class"
				icon="fa-facebook"
			  /></span>			
			}
			</>
		: <></>}
		</div>		
)});


export default LoginBlock;