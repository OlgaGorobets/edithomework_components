import React , { useState, useEffect,useRef } from 'react';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

const EditableField = ({text , saveTextFunction}) => {
	const customButtonsVisibility = {
		edit: "inline-block",
		save: "none"
	};
	const customFieldSize = {
		height: 0,
		width: 0
	}
	const [fieldText, setFieldText] = useState("");
	const [fieldSize, setFieldSize] = useState({...customFieldSize});
	const [wrapperRef, setWrapperRef] = useState(null);
	const [textRef, setTextRef] = useState(null);
	const [buttonsVisibility, setButtonsVisibility] = useState({...customButtonsVisibility})

	let handleClickOutside = (e)=>{
		if (wrapperRef && !wrapperRef.contains(e.target)) {
			setFieldText("");
			setButtonsVisibility({
				edit: "inline-block",
				save: "none"
			});
			setFieldSize({...customFieldSize});
			document.removeEventListener('mousedown', handleClickOutside);
		}		
	}
	let handleEditField = (e)=>{		
		e.preventDefault();
		let rect = textRef.getBoundingClientRect();
		console.log(rect, "rexr");
		setFieldText(text);
		setButtonsVisibility({
			edit: "none",
			save: "inline-block"
		});
		setFieldSize({
			width: rect.width + 10,
			height: rect.height + 10
		});
		document.addEventListener('mousedown', handleClickOutside);
	}
	let handleChangeField = (e)=>{
		setFieldText(e.target.value);
	}
	let handleSave = (e)=>{
		if(fieldText.trim().length > 0 && typeof saveTextFunction == "function"){
			saveTextFunction(fieldText);
			setFieldText("");
			setButtonsVisibility({
				edit: "inline-block",
				save: "none"
			});			
		}	
		setFieldSize({...customFieldSize});
		document.removeEventListener('mousedown', handleClickOutside);
	}
		
	
	return(
	<>
		<div className="editableFieldParent" ref={setWrapperRef}>
			<div className="editableFieldValue" style={{
				"display": buttonsVisibility.edit
			}} ref={setTextRef} onClick={handleEditField}>{text}</div>
			<textarea style={{
				"display": buttonsVisibility.save,
				"width": fieldSize.width,
				"height": fieldSize.height
			}} className="editableFieldField" value={fieldText} onChange={handleChangeField}></textarea>
			<Button size="sm" style={{
				"display": buttonsVisibility.edit
			}} onClick={handleEditField}><FontAwesomeIcon icon={faEdit} /></Button>
			<Button size="sm" style={{
				"display": buttonsVisibility.save
			}} onClick={handleSave} >Save</Button>
		</div>
	</>
)};


export default EditableField;