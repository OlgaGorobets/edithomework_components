export const SET_CURRENT_TASK = 'SET_CURRENT_TASK';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LOGIN_POPUP_VISIBILITY = 'SET_LOGIN_POPUP_VISIBILITY';
export const REMOVE_TEXT = 'REMOVE_TEXT';
export const ADD_TEXT = 'ADD_TEXT';
export const EDIT_TEXT = 'EDIT_TEXT';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
export const EDIT_TASK_NAME = 'EDIT_TASK_NAME';
export const ADD_TASK = 'ADD_TASK';
export const EDIT_TASK_VISIBILITY = 'EDIT_TASK_VISIBILITY';
export const REMOVE_TASK = 'REMOVE_TASK';
export const COPY_TASK = 'COPY_TASK';
export const EDIT_TASK_DATE = 'EDIT_TASK_DATE';
export const LOAD_STATE = 'LOAD_STATE';
export const LOAD_USER = 'LOAD_USER';
export const ADD_TMP_USER = 'ADD_TMP_USER';
export const EDIT_USER_NAME = 'EDIT_USER_NAME';
export const SIGN_FB = 'SIGN_FB';

export function setCurrentTask(id) {
	return {
		type: SET_CURRENT_TASK,
		id: id
	};
}
export function setCurrentPage(number) {
	return {
		type: SET_CURRENT_PAGE,
		number: number
	};
}
export function setLoginPopupVisibility(visibility) {
	return {
		type: SET_LOGIN_POPUP_VISIBILITY,
		visibility: visibility
	};
}
export function removeText(id, task_id) {
	return {
		type: REMOVE_TEXT,
		id: id,
		task_id: task_id
	};
}
export function addText(textObj) {
	return {
		type: ADD_TEXT,
		textObj: textObj
	};
}
export function editText(textObj) {
	return {
		type: EDIT_TEXT,
		textObj: textObj
	};
}
export function addMessage(message, user_id, textData) {
	return {
		type: ADD_MESSAGE,
		message: message,
		user_id: user_id,
		textData: textData
	};
}
export function removeMessage(id, task_id) {
	return {
		type: REMOVE_MESSAGE,
		id: id,
		task_id: task_id
	};
}
export function editTaskName(id, name) {
	return {
		type: EDIT_TASK_NAME,
		id: id,
		name: name
	};
}
export function editTaskVisibility(id, hidden) {	
	return {
		type: EDIT_TASK_VISIBILITY,
		id: id,
		hidden: hidden
	};
}
export function addTask(data) {	
	return {
		type: ADD_TASK,
		user_id: data.user_id,
		file: data.file,
		images: data.images
	};
}
export function copyTask(task_id, user_id) {	
	return {
		type: COPY_TASK,
		user_id: user_id,
		task_id: task_id
	};
}
export function removeTask(id) {	
	return {
		type: REMOVE_TASK,
		id: id
	};
}
export function editTaskDate(id) {	
	return {
		type: EDIT_TASK_DATE,
		id: id
	};
}
export function loadState(data) {	
	return {
		type: LOAD_STATE,
		data: data
	};
}
export function loadUser(id) {	
	return {
		type: LOAD_USER,
		id: id
	};
}
export function addTmpUser() {	
	return {
		type: ADD_TMP_USER
	};
}
export function editUserName(id, name) {	
	return {
		type: EDIT_USER_NAME,
		id: id,
		name: name
	};
}
export function signFB(data) {	
	return {
		type: SIGN_FB,
		data: data
	};
}