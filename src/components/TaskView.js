import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { SketchPicker } from 'react-color';
import Messager from './Messager';

import { removeText, addText, editText, addMessage, removeMessage, editTaskDate} from '../actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCaretDown, faPlus, faArrowsAlt, faExclamation, faCheck, faEnvelope, faCalendarAlt} from '@fortawesome/free-solid-svg-icons';


const mapStateToProps = state => {
    return {		
		users: state.users,		
		current_user: state.current_user,
		current_task: state.current_task,
		texts: state.texts,
		messages: state.messages,
		tasks: state.tasks,
		current_page: state.current_page
	};
};

const TaskView = connect(mapStateToProps)(({users, current_user, current_task, current_page, tasks, texts, messages,  dispatch}) => {
	const fonts = {
		small: "12px",
		normal: "14px",
		large: "20px",
		huge: "30px"
	}
	const customEditableBlock = {
		visible: false,
		value: "",
		owner: true
	};
	const customEditableButtonsState = {
		color: false,
		font: false,
		strike: false,
		message: true
	}
	const editableRef = useRef(null);	
	const editableTextareaRef = useRef(null);
	const [loader, setLoader] = useState(false);
	const [editableButtonsState, setEditableButtonsState] = useState({...customEditableButtonsState});
	const [textsVisibility, setTextsVisibility] = useState(texts.map(()=>true));
	
	const [editableBlock, setEditableBlock] = useState({...customEditableBlock});
	const canvasRef = useRef(null);
	let taskData = tasks.filter((tsk)=>{
		return tsk.id == current_task;
	});
	taskData = taskData.length > 0 ? taskData[0] : null;
	if(textsVisibility.length !== texts.length){
		setTextsVisibility(texts.map(()=>true));
	}
	let renderImage = ()=>{
		if(!taskData) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');				
		const image = new Image();
		image.src = taskData.images[current_page];
		setLoader(true);
		return new Promise(resolve => {
			image.onload = () => {
				let w = 1000;
				let h = (w * image.height) / image.width;
				ctx.canvas.width  = w;
				ctx.canvas.height = h;			
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.drawImage(image, 0, 0, w, h);							
				resolve({status: 'ok'});
				setLoader(false);
			};				
		});	
	}
	const editTextClick = (e, txt, index)=>{
		e.preventDefault();		
		e.stopPropagation();			
		setTextsVisibility(texts.map((t, ind)=>{return ind == index ? false : true;}));
		let rect = e.currentTarget.getBoundingClientRect();
		setEditableBlock({...customEditableBlock, 
			visible: true,
			left: e.currentTarget.offsetLeft,
			top: e.currentTarget.offsetTop,
			color: txt.color,
			font_size: txt.font_size,
			background: txt.background,
			border: txt.border,
			line: txt.line,
			width: txt.width || rect.width,
			height: txt.height || rect.height,
			value: txt.text,
			owner: current_user == txt.user_id,
			user_id: txt.user_id,
			id: txt.id,
			history: txt.history
		});	
		setEditableButtonsState({...customEditableButtonsState});
	}
	const showEmptyEditableBlockClick = (e)=>{	
		if(editableRef.current && editableRef.current.contains(e.target)) return;
		setTextsVisibility(texts.map((t, ind)=>{return true;}));
		let rect = e.currentTarget.getBoundingClientRect();
		setEditableBlock({...customEditableBlock, 
			visible: true,
			left:  e.clientX - rect.x,
			top: e.clientY - rect.y
		});		
		setEditableButtonsState({...customEditableButtonsState});
	}
	const handleClickOutside = (e)=> {
		
		if(editableRef.current && !editableRef.current.contains(e.target)) {		    
			setTextsVisibility(texts.map((t, ind)=>{return true;}));
			setEditableBlock({...customEditableBlock})	
			setEditableButtonsState({...customEditableButtonsState});
		}
	}	
	const editableFieldValueChange = (e)=>{
		setEditableBlock({...editableBlock, value: e.target.value});	
	}
	const removeTextClick = (e,txt)=>{
		e.preventDefault();		
		e.stopPropagation();
		dispatch(removeText(txt.id, current_task));
		dispatch(editTaskDate(current_task));
	}
	const cancelTextChangesClick = ()=>{
		setTextsVisibility(texts.map((t, ind)=>{return true;}));
		setEditableBlock({...customEditableBlock})	
		setEditableButtonsState({...customEditableButtonsState});			
	}
	const saveTextChangesClick = ()=>{	
		let rect = editableTextareaRef.current.getBoundingClientRect();
		let obj = {
			x: editableBlock.left,
			y: editableBlock.top,
			task_id: current_task,
			image_index: current_page,	
			text: editableBlock.value,
			width: rect.width,
			height: rect.height,
			font_size: editableBlock.font_size,
			color: editableBlock.color,
			background: editableBlock.background,
			border: editableBlock.border,
			line: editableBlock.line
		};
		if(editableBlock.id === undefined){
			dispatch(addText({
				...obj,
				user_id: current_user
			}));				
		}
		else{			
			dispatch(editText({
				...obj,
				id: editableBlock.id,
				history: editableBlock.owner || editableBlock.history.indexOf(current_user) !== -1 ? [...editableBlock.history] : [...editableBlock.history, current_user]
			}));	
			
		}
		dispatch(editTaskDate(current_task));
		
		setTextsVisibility(texts.map((t, ind)=>{return true;}));
		setEditableBlock({...customEditableBlock})	
		setEditableButtonsState({...customEditableButtonsState});		
			
	}
	useEffect(() => {		
		renderImage();	
		document.addEventListener("mousedown", handleClickOutside);
		return () => {		  
			document.removeEventListener("mousedown", handleClickOutside);
		};		
	}, []);

	return(
		<>
			<div className="image-parent" onClick={showEmptyEditableBlockClick}>
				{loader ? <Loader type="Bars" color="#736b66" height={50} width={50} /> : <></>}
				<canvas ref={canvasRef} />	
				<div className="image-texts">
					{texts.map((txt, index)=>{
						return(	
							<div key={index} className={(txt.line ? "line-through ": "") + "image-text"} onClick={(e)=>editTextClick(e, txt, index)}  style={{												
								"left": txt.x,
								"top": txt.y,															
								"cursor": txt.user_id == current_user ? "pointer" : "",
								"visibility": textsVisibility[index] ? "visible" : "hidden"								
								}}><span style={{
									"width": txt.width,
									"height": txt.height,
									"display": "inline-block",
									"vertical-align": "top",
									"fontSize": txt.font_size,
									"color": txt.color,
									"background": txt.background,	
									"border": txt.border ? "1px silid #000" : "none",
									"outline": txt.border ? "1px solid #000" : "none"
								}}>{txt.text}</span>
								<ButtonGroup>	
								<Button size="sm" title="Click to Add Message" className={(messages.filter((ms)=>ms.text_id==txt.id).length > 0 ? "edit-btn-visible" :"" ) + "edit-btn"}>
									<FontAwesomeIcon icon={faEnvelope} /><small>{messages.filter((ms)=>ms.text_id==txt.id).length}</small> <FontAwesomeIcon icon={faCaretDown} />									
								</Button>
								{/*<Button size="sm" title="Click to Edit this text" className="edit-btn"><FontAwesomeIcon icon={faEdit} /></Button>*/}								
								{txt.user_id == current_user ? 															
									<Button size="sm" title="Click to Remove this text" className="edit-btn" onClick={(e)=>removeTextClick(e, txt)}><FontAwesomeIcon icon={faTrash} /></Button>
								 : <></>
								}
								</ButtonGroup>
								<div className="image-text-info" onClick={(e)=>{e.preventDefault();e.stopPropagation();}}>
									<div>Created by {users.filter((us)=>us.id==txt.user_id)[0].name}</div>
									{txt.history.map((hId)=>{
										return (<div>Style was changed by {users.filter((us)=>us.id==hId)[0].name}</div>)
									})}
								</div>
							</div>
							
						)					
					})}
					<div className="editable-text-container" style={{
						display: editableBlock.visible ? "block" : "none",
						left: editableBlock.left,
						top: editableBlock.top}} ref={editableRef}>
							<div className="editable-left-side">
								<div className="editable-text-header">	
								</div>
								<ButtonGroup>
									<div title={editableBlock.owner ? "" : "You can't change this text, you can only change the style of this text."} className={(editableBlock.line ? "line-through ": "") + "editable-text-field-parent"}>							
										<textarea  onChange={editableFieldValueChange} className="editable-text-field"							
											placeholder="Write Your text..."						
											rows="1"
											value={editableBlock.value}
											disabled={!editableBlock.owner}								
											style={{
												color: editableBlock.color || "#000",
												background: editableBlock.background || "transparent",
												fontSize: editableBlock.font_size || fonts.normal,
												outline: editableBlock.border ? "1px solid #000": "none",
												width: editableBlock.width,
												height: editableBlock.height
											}}
											ref={editableTextareaRef}
										/>
									</div>											
								</ButtonGroup>
								<ButtonGroup style={{verticalAlign: "top"}}>	
									<Button size="sm" onClick={saveTextChangesClick}>Save</Button>
											{/*<Button size="sm" onClick={cancelTextChangesClick}>Cancel</Button>*/}											
								</ButtonGroup>								
								<div className="editable-text-footer">
									<div className="editable-buttons-block">
									<ButtonGroup>
										<Button size="sm" className={editableButtonsState.color ? "active" : ""} onClick={()=>setEditableButtonsState({...editableButtonsState, color: !editableButtonsState.color, font: false, message: false})}><span style={{textDecoration: "underline"}}>A</span> <FontAwesomeIcon icon={faCaretDown} /></Button>
										<Button size="sm" className={editableButtonsState.font ? "active" : ""} onClick={()=>setEditableButtonsState({...editableButtonsState, font: !editableButtonsState.font, color: false, message:false})}>T<small>T</small> <FontAwesomeIcon icon={faCaretDown} /></Button>
										<Button size="sm" className={editableBlock.line ? "active" : ""} onClick={()=>setEditableBlock({...editableBlock, line: !editableBlock.line})} style={{textDecoration: "line-through"}}>S</Button>								
									</ButtonGroup>
									</div>
									<div className="editable-buttons-block-value">
										<div className="editable-color-value" style={{display: editableButtonsState.color ? "block" : "none"}}>
											<div className="group-item-top">
												<input type="checkbox" name="addBorder" id="addBorderCbx" value="0" onChange={(e)=>setEditableBlock({...editableBlock, border: e.target.checked})} checked={editableBlock.border}/>
												<label htmlFor="addBorderCbx">Add border</label>																													
											</div>									
											<ButtonGroup>
												<div className="group-item">
													<div className="group-item-label">Font color</div>
													<SketchPicker
														color={  editableBlock.color || "#000" }	
														onChangeComplete={(color)=>setEditableBlock({...editableBlock, color: color.hex})}
													  />
												</div>
												<div className="group-item">
													<div className="group-item-label">Background color</div>												
													<SketchPicker
														color={  editableBlock.background || "transparent" }
														onChangeComplete={(color)=>{ let bg = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;  return setEditableBlock({...editableBlock, background: bg})}}
													  />
												</div>							  
											</ButtonGroup>
										</div>
										<div className="editable-font-value" style={{display: editableButtonsState.font ? "block" : "none"}}>
											<Form.Control as="select" multiple onChange={(e)=>setEditableBlock({...editableBlock, font_size: e.target.value})}>
											{Object.keys(fonts).map((fnt, index)=><option key={index} value={fonts[fnt]} selected={editableBlock.font_size==fonts[fnt]} style={{fontSize: fonts[fnt], textTransform: "capitalize"}}>{fnt}</option>)}								  
											</Form.Control>
										</div>
									</div>
								</div>							
							</div>
							<div className="editable-right-side">
									<ButtonGroup className="editable-text-mess">
										<Button size="sm" className={editableButtonsState.message ? "active" : ""} onClick={()=>setEditableButtonsState({...editableButtonsState, message: !editableButtonsState.message, font: false, color: false})}><FontAwesomeIcon icon={faEnvelope} /> <small>{messages.filter((ms)=>ms.text_id==editableBlock.id).length}</small> <FontAwesomeIcon icon={faCaretDown} /></Button>
									</ButtonGroup>								
										<div className="editable-message-value" style={{display: editableButtonsState.message ? "block" : "none"}}>
											<Messager {...{
												messages: editableBlock.id !== undefined ? messages.filter((ms)=>ms.text_id==editableBlock.id): [], 
												users: users, 
												user: tasks.filter((tsk)=>tsk.id==current_task)[0].user_id, 
												addMessageF: (message)=>{											
													dispatch(addMessage(message, current_user, {...editableBlock,
														task_id: current_task,
														image_index: current_page	
													}));
													dispatch(editTaskDate(current_task));
													if(editableBlock.id === undefined){
														setTextsVisibility(texts.map((t, ind)=>{return true;}));
														setEditableBlock({...customEditableBlock})	
														setEditableButtonsState({...customEditableButtonsState});															
													}									
												},
												removeMessageF: (id)=>{											
													dispatch(removeMessage(id, current_task));
													dispatch(editTaskDate(current_task));
												}												
												}}/>
										</div>
							</div>								
					</div>
				</div>
			</div>
		</>
)});


export default TaskView;