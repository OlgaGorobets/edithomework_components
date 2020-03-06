import React , { useState, useEffect,useRef } from 'react';
import { connect } from 'react-redux';
import axios, { post } from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import { addTask} from '../actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';



const mapStateToProps = state => {
    return {		
		current_user: state.current_user
    };
};


const FileUploader = connect(mapStateToProps)(({ current_user, dispatch }) => {
	const [file, setFile] = useState(null);
	const [loader, setLoader] = useState(null);
	const [modal, setModal] = useState({
		show: false,
		title: "",
		text: ""
	});
	
	let fileUp = (file)=>{
		const url = '/upload.php';
		const formData = new FormData();
		formData.append('file',file)
		const config = {
			headers: {
            'content-type': 'multipart/form-data'
			}
		}
		return  post(url, formData,config)
	}
	
	let onFormSubmit = (e)=>{
		e.preventDefault() 
		file && setLoader(true);
		fileUp(file).then((response)=>{	
			setLoader(false);
			let result = response.data;
			if(result.error == false){				
					dispatch(addTask({
						file: result.file,
						images: JSON.parse(result.images),
						user_id: current_user
					}));
					let reloadHref = localStorage.getItem("reload_href_edithomework");
					if(reloadHref !== null){
						localStorage.removeItem("reload_href_edithomework");
						window.location.href = reloadHref;
					}						
			}
		})
		
	}
	let onChange = (e)=> {
		setFile(e.target.files[0]);	
		if(e.target.files[0]){
			setLoader(true);
			fileUp(e.target.files[0]).then((response)=>{				
				setLoader(false);
				let result = response.data;
				
				if(result.error == false){					
					dispatch(addTask({
						file: result.file,
						images: JSON.parse(result.images),
						user_id: current_user
					}));
					let reloadHref = localStorage.getItem("reload_href_edithomework");
					if(reloadHref !== null){
						localStorage.removeItem("reload_href_edithomework");
						window.location.href = reloadHref;
					}					
				}
				else{
					setModal({...modal, show: true, title: "File Upload Error", text: ("File wasn't loaded. " + result.error) });
				}
			}).catch(error => { setLoader(false); setModal({...modal, show: true, title: "File Upload Error", text: "File wasn't loaded. Somthing went wrong..."});});			
		}
	}

	return(
		<>
		<form onSubmit={onFormSubmit}>
			<h6>Upload File(pdf or image):</h6>
			{ loader ? <span>
					<Spinner animation="border" variant="secondary" />
					Wait please, File is Loading...
				</span> : <>
				  <div className="custom-file">
					<input
						type="file"
						className="custom-file-input"
						id="inputGroupFile01"
						aria-describedby="inputGroupFileAddon01"
						onChange={onChange}
						size="sm"
					/>
					<label className="custom-file-label" size="sm" htmlFor="inputGroupFile01">
					  Choose file
					</label>
					<button type="submit" style={{"display": "none"}}>Upload</button>
				  </div>			
				
				
			  </>
				
			}

		</form>
		<Modal show={modal.show} onHide={()=>{setModal({...modal, show: false})}}>
			<Modal.Header closeButton>
				<Modal.Title>{modal.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{modal.text}</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={()=>{setModal({...modal, show: false})}} >
					Ok
				</Button>
			</Modal.Footer>
		</Modal>	
		</>
)});


export default FileUploader;