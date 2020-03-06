import { 
SET_CURRENT_TASK, SET_CURRENT_PAGE, SET_LOGIN_POPUP_VISIBILITY, SIGN_FB,
REMOVE_TEXT, ADD_TEXT , EDIT_TEXT, REMOVE_TASK,COPY_TASK,EDIT_TASK_DATE,LOAD_STATE,LOAD_USER,ADD_TMP_USER,EDIT_USER_NAME,
REMOVE_MESSAGE, ADD_MESSAGE, EDIT_TASK_NAME, ADD_TASK, EDIT_TASK_VISIBILITY} from '../actions';
import { getNextNumber, formatDate, getNextId } from '../helper';
import axios, { post } from 'axios';
const saveData= (name, data)=>{
	const url = '/db.php';
	let savedData = JSON.stringify(data);
	const formData = new FormData();
	formData.append("name", name);
	formData.append("action", "set");
	formData.append("data", savedData);		
	post(url, formData).then((result)=>{
		console.log(result, "saved", name);
	});
}	
const removeFiles= (fileName)=>{
	const url = '/remove.php';	
	const formData = new FormData();
	formData.append("name", fileName);
	formData.append("action", "remove");
		
	post(url, formData).then((result)=>{
		console.log(result, "removed", name);
	});
}
const initialState = {  	
	current_user: null,
	current_page: 0,
	current_task: "test",	
	users: [/*{
		id: 0,
		name: "OlkaOlkaOlkaOlka",
		photo: false,
		key: "123"
	},
	{
		id: 1,
		name: "temporary user",
		photo: false
	}*/],	
	tasks: [/*{
		name: "task name test",
		id: "test",
		user_id: 1,
		load_date: "",
		last_edit_date: "",
		file: "file path",		
		images: ["/uploads/photos/2.jpg", "/uploads/photos/photo_pdf билета.png", "../photos/3.jpg", "../photos/4.jpg", "../photos/5.jpg", "../photos/6.jpg", "../photos7.jpg", "../photos/8.jpg"]
	},
	{
		name: "task name1",
		id: "1",
		user_id: 0,
		load_date: "",
		last_edit_date: "",
		file: "file path",
		hidden: true,
		images: ["/uploads/photos/photo_pdf билета.png", "../photos/2.jpg", "../photos/3.jpg", "../photos/4.jpg", "../photos/5.jpg", "../photos/6.jpg", "../photos7.jpg", "../photos/8.jpg"]
	},
	{
		name: "task name2",
		id: "2",
		user_id: 0,
		load_date: "",
		last_edit_date: "",
		file: "file path",
		images: ["/uploads/photos/photo_pdf билета.png", "../photos/2.jpg", "../photos/3.jpg", "../photos/4.jpg", "../photos/5.jpg", "../photos/6.jpg", "../photos7.jpg", "../photos/8.jpg"]
	},
	{
		name: "aaaa",
		id: "3",
		user_id: 0,
		load_date: "",
		last_edit_date: "",
		file: "file path",
		hidden: true,
		images: ["/uploads/photos/photo_pdf билета.png", "../photos/2.jpg", "../photos/3.jpg", "../photos/4.jpg", "../photos/5.jpg", "../photos/6.jpg", "../photos7.jpg", "../photos/8.jpg"]
	},	
	{
		name: "task name4",
		id: "4",
		user_id: 1,
		load_date: "",
		last_edit_date: "",
		file: "file path",
		images: ["/uploads/photos/photo_pdf билета.png", "../photos/2.jpg", "../photos/3.jpg", "../photos/4.jpg", "../photos/5.jpg", "../photos/6.jpg", "../photos7.jpg", "../photos/8.jpg"]
	}*/],	
	texts: [/*{
		text: "testing text1",
		x: 0,
		y:0,
		task_id: 0,
		image_index: 0,
		id: 0,
		width: "auto",
		font_size: "14px",
		color: "red",
		background: "yellow",
		border: true,
		line: true,
		user_id: 0,
		history: []
	},
	{
		text: "testing text2",
		x: 100,
		y:0,
		task_id: 0,
		image_index: 0,
		id: 1,
		width: "auto",
		font_size: "12px",
		color: "red",
		background: "yellow",
		border: false,
		line: false,
		user_id: 1,
		history: []
	},
	{
		text: "testing text2",
		x: 300,
		y:300,
		task_id: 0,
		image_index: 0,
		id: 2,
		width: "auto",
		font_size: "14px",
		color: "red",
		background: "yellow",
		border: false,
		line: false,
		user_id: 0,
		history: []
	}*/],
	messages: [/*{
		id: 0,
		user_id: 0,		
		text_id: 0,
		message: ["message1"],
		date: "date1"
	},
	{
		id: 1,
		user_id: 1,		
		text_id: 0,
		message: ["message2"],
		date: "date1"
	}*/]	
};
export default function app(state = initialState, action) {
	let obj = null;
	switch (action.type) {
	case SET_CURRENT_TASK:
		return {			
			...state,
			current_task: action.id
		}
	case SET_CURRENT_PAGE:
		return {			
			...state,
			current_page: action.number
		}		
	case SET_LOGIN_POPUP_VISIBILITY:
		return {			
			...state,
			login_popup_visible: action.visibility
		}	
	case REMOVE_TEXT:
		obj = {			
			...state,
			texts: state.texts.filter((txt)=>{return txt.id !== action.id}),
			messages: state.messages.filter((msg)=>{return msg.text_id !== action.id})
		};

			saveData(`texts_${action.task_id}`, [...obj.texts]);
			saveData(`messages_${action.task_id}`, [...obj.messages]);			
		
		return obj;
	case REMOVE_MESSAGE:
		obj = {			
			...state,			
			messages: state.messages.filter((msg)=>{return msg.id !== action.id})
		}
			saveData(`messages_${action.task_id}`, [...obj.messages]);			
		return obj;	
	case REMOVE_TASK:
		let textsIds = state.texts.filter((txt)=>{return txt.task_id == action.id}).map((txt)=>txt.id);
		let taskCopies = state.tasks.filter((tsk)=>{return tsk.copy == action.id});
		let removingTask = state.tasks.filter((tsk)=>{return tsk.id == action.id});
		removingTask = removingTask.length > 0 ? removingTask[0] : null;
		if(taskCopies.length == 0 && removingTask !== null && removingTask.copy === undefined){
			removeFiles(removingTask.file);
		}
		obj = {			
			...state,
			texts: state.texts.filter((txt)=>{return txt.task_id !== action.id}),
			messages: state.messages.filter((msg)=>{return textsIds.indexOf(msg.text_id) == -1}),
			tasks: state.tasks.filter((tsk)=>{return tsk.id !== action.id})
		}
		localStorage.setItem("reload_href_edithomework", "/");
		saveData(`messages_${action.id}`, [...obj.messages]);
		saveData(`messages_${action.id}`, [...obj.texts]);
		saveData("tasks", [...obj.tasks]);
		
		return obj;
	case ADD_TEXT:	
		obj = {			
			...state,
			texts: [
				...state.texts,
				{
					id: getNextId("text_", state.texts),
					x: action.textObj.x,
					y: action.textObj.y,
					task_id: action.textObj.task_id,
					image_index: action.textObj.image_index,	
					text: action.textObj.text,
					width: action.textObj.width,
					height: action.textObj.height,
					font_size: action.textObj.font_size,
					color: action.textObj.color,
					background: action.textObj.background,
					border: action.textObj.border,
					line: action.textObj.line,
					user_id: action.textObj.user_id,
					history: []
				}
			]
		}
		saveData(`texts_${action.textObj.task_id}`, [...obj.texts]);
		return obj;
	case EDIT_TEXT:		
		obj = {			
			...state,
			texts: [
				...state.texts.filter((txt)=>txt.id !== action.textObj.id),
				{...state.texts.filter((txt)=>txt.id == action.textObj.id)[0],
					x: action.textObj.x,
					y: action.textObj.y,
					task_id: action.textObj.task_id,
					image_index: action.textObj.image_index,	
					text: action.textObj.text,
					width: action.textObj.width,
					height: action.textObj.height,
					font_size: action.textObj.font_size,
					color: action.textObj.color,
					background: action.textObj.background,
					border: action.textObj.border,
					line: action.textObj.line,					
					history: action.textObj.history
				}
			]
		}
		saveData(`texts_${action.textObj.task_id}`, [...obj.texts]);
		return obj;	
	case ADD_MESSAGE:		
		let addMessageTexts = [...state.texts];
		let addMessageTextId = action.textData.id;
		if(addMessageTextId === undefined){
			addMessageTextId = getNextId("text_", state.texts);
			addMessageTexts = [...state.texts,
				{
					id: addMessageTextId,
					x: action.textData.left,
					y: action.textData.top,
					task_id: action.textData.task_id,
					image_index: action.textData.image_index,	
					text: "",
					user_id: action.user_id,
					history: []
				}			
			]
		}
		obj = {			
			...state,
			texts: addMessageTexts,			
			messages: [
				...state.messages,
				{
					id: getNextId("message_", state.messages),
					message: action.message,
					user_id: action.user_id,
					text_id: addMessageTextId,
					date: formatDate()
				}
			]
		}
		saveData(`texts_${action.textData.task_id}`, [...obj.texts]);
		saveData(`messages_${action.textData.task_id}`, [...obj.messages]);
		return obj;
	case EDIT_TASK_NAME:
		obj = {			
			...state,
			tasks: [
				...state.tasks.filter((tsk)=>tsk.id !== action.id),
				{
					...state.tasks.filter((tsk)=>tsk.id == action.id)[0],
					name: action.name,
					last_edit_date: formatDate()
				}
			]
		}
		saveData("tasks", [...obj.tasks]);
		return obj;
	case EDIT_TASK_VISIBILITY:
		obj = {			
			...state,
			tasks: [
				...state.tasks.filter((tsk)=>tsk.id !== action.id),
				{
					...state.tasks.filter((tsk)=>tsk.id == action.id)[0],
					hidden: action.hidden,
					last_edit_date: formatDate()
				}
			]
		}
		saveData("tasks", [...obj.tasks]);
		return obj;	
	case EDIT_TASK_DATE:
		obj = {			
			...state,
			tasks: [
				...state.tasks.filter((tsk)=>tsk.id !== action.id),
				{
					...state.tasks.filter((tsk)=>tsk.id == action.id)[0],					
					last_edit_date: formatDate()
				}
			]
		}
		saveData("tasks", [...obj.tasks]);
		return obj;			
	case ADD_TASK:	
		let newTaskId =  getNextId("task_", state.tasks);
		localStorage.setItem("reload_href_edithomework", "/task/" + newTaskId);
		obj = {			
			...state,
			tasks: [
				...state.tasks,
				{
					id: newTaskId,
					name: action.file.split(".").join("_"),		
					user_id: action.user_id,
					load_date: formatDate(),
					last_edit_date: formatDate(),
					file: action.name,
					images: action.images
				}
			]
		}
		saveData("tasks", [...obj.tasks]);
		return obj;	
	case COPY_TASK:		
		let taskForCopy = state.tasks.filter((tsk)=>tsk.id == action.task_id);
		taskForCopy = taskForCopy.length > 0 ? taskForCopy[0] : null;
		console.log(taskForCopy, "taskForCopy");
		let nextTaskId =  getNextId("task_", state.tasks);
		
		localStorage.setItem("reload_href_edithomework", "/task/" + nextTaskId);
		obj = {			
			...state,
			tasks: [
				...state.tasks,
				{
					...taskForCopy,
					id: nextTaskId,
					user_id: action.user_id,
					name: "copy of " + taskForCopy.name,
					copy: taskForCopy.id,
					last_edit_date: formatDate()
				}
			]
		}
		saveData("tasks", [...obj.tasks]);
		return obj;	
	case LOAD_STATE:	
		let lTasks = action.data.tasks;
		let lUsers = action.data.users;
		if(lTasks.length == 0){
			lTasks = [{
				name: "task test",
				id: "test",
				user_id: 0,
				load_date: formatDate(),
				last_edit_date: formatDate(),
				file: "test_task.png",		
				images: ["/uploads/photos/test_task.png"]				
			}];
		}
		if(lUsers.length == 0){
			lUsers = [{
				id: 0,
				name: "Olka",
				photo: false	
			}];
		}		
		return {			
			...state,
			tasks: [
				...lTasks
			],
			messages: [
				...action.data.messages
			],
			texts: [
				...action.data.texts
			],
			users: [
				...lUsers
			]
		};		
	case LOAD_USER:	
		return {			
			...state,
			current_user: action.id
		};		
	case ADD_TMP_USER:	
	
		let usId = getNextId("user_", state.users);
		obj = {...state,
			users: [
				...state.users,
				{
					id: usId,					
					name: "temporary user",
					photo: false
				}
			],
			current_user: usId}		
		
		localStorage.setItem("current_user_edithomework", usId);
		saveData("users", [...obj.users]);
		return obj;	
	case SIGN_FB:	
		let fbusId;
		let aUser = state.users.filter((us)=>us.key==action.data.key);
		aUser = aUser.length > 0 ? aUser[0] : null;
		if(aUser !== null){
			fbusId = aUser.id;
			obj = {...state,
				current_user: fbusId}			
		}
		else{
			fbusId = getNextId("user_", state.users);
			obj = {...state,
				users: [
					...state.users,
					{
						id: fbusId,					
						name: action.data.name,
						photo: action.data.photo,
						key: action.data.key
					}
				],
				current_user: fbusId}	
			saveData("users", [...obj.users]);
		}		
		localStorage.setItem("current_user_edithomework", fbusId);
		
		return obj;			
	case EDIT_USER_NAME:	
		obj = {			
			...state,
			users: [
				...state.users.filter((us)=>us.id !== action.id),
				{
					...state.users.filter((us)=>us.id == action.id)[0],
					name: action.name
				}
			]
		}	
		
		saveData("users", [...obj.users]);
		return obj;			
    default:
      return state;
  }
}