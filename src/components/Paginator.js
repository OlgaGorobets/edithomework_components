import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {		
		current_task: state.current_task,
		tasks: state.tasks,
		current_page: state.current_page
	};
};

const Paginator = connect(mapStateToProps)(({current_task, current_page, tasks}) => {	
	//const [message, setMessage] = useState("");
	let currentTask = tasks.filter((tsk)=>tsk.id==current_task)[0];
	
	useEffect(() => {		
	}, []);
	return(
		<div className="paginator">
			<span>Pages: </span>
			<ul className="paginator-pages">
			{currentTask.images.map((img, ind)=>{	
			
				return(
					<li key={ind} className={ind== parseInt(current_page) ? "active" : ""}>
					{
						ind== parseInt(current_page) ?
						<span className="page-item">
							<img src={img.replace(".png", "_preview.png").replace(".jpg", "_preview.jpg")}/>
							<span className="page-number">{ind+1}</span>
						</span> :
						<a href={"/task/" + current_task + "/" + (ind+1)}  title={"page-" + (ind+1)} className="page-item">
							<img src={img.replace(".png", "_preview.png").replace(".jpg", "_preview.jpg")}/>
							<span className="page-number">{ind+1}</span>
						</a>
					}
					</li>
				)
			})}
			</ul>
		</div>		
)});


export default Paginator;