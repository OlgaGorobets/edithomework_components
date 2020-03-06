import React, { Component } from "react";
import { connect } from 'react-redux';
import { Button, Container , Row} from 'react-bootstrap';
import { Route,Link,withRouter } from 'react-router-dom';
import axios, { post } from 'axios';
import Loader from 'react-loader-spinner';
import '../styles/App.scss';

import Page404 from './Page404';
import PageView from './PageView';
import LoginBlock from './LoginBlock';

import { setCurrentTask, setCurrentPage, loadState, loadUser, addTmpUser} from '../actions';

const mapStateToProps = state => {
    return {		
		tasks: state.tasks
	};
};
class App extends Component {
    constructor(props) {
        super(props);
		this.state = { loader: true };
				
    }	
	componentDidMount(){
		this.props.dispatch(setCurrentTask(this.props.task));
		this.props.dispatch(setCurrentPage(this.props.image));
				
		const url = '/db.php';
		let dataItems = [[`texts_${this.props.task}`, "texts"], [`messages_${this.props.task}`, "messages"], ["tasks", "tasks"], ["users", "users"]];
		let loadingArr = [];
		this.setState({
			loader: true
		});
		dataItems.forEach((item)=>{
			const formData = new FormData();		
			formData.append("action", "get");
			formData.append("data", "");				
			formData.append("name", item[0]);
			loadingArr.push(post(url, formData));
		});
		axios.all(loadingArr).then(axios.spread((...responses) => {	
			let loadedData = [];
			dataItems.forEach((item, index)=>{
				let res = responses[index];				
				if(res.data.error == false){
					let arr = JSON.parse(res.data.data);
					if(arr == false){
						arr = [];
					}
					loadedData[item[1]] = arr;
				}
			});
		
			this.props.dispatch(loadState(loadedData));	
			this.setState({
				loader: false
			});		
			let cUserId = localStorage.getItem("current_user_edithomework");
			
			if(cUserId !== null){
				let aUser = loadedData.users.filter((us)=>{
					return us.id == cUserId;
				});
				aUser = aUser.length > 0 ? aUser[0] : null;
				if(aUser !== null){
					this.props.dispatch(loadUser(cUserId));
				}
				else{
					this.props.dispatch(addTmpUser());
				}
			}	
			else{				
				this.props.dispatch(addTmpUser());
			}
		})).catch(errors => {
			console.log("loading error");
			this.setState({
				loader: false
			});			
		});	    
	}	
    render() {		
        return (
			<>					
			<div className="page-header">			
				<Container>                
					<Row>
						<a href="/" title="Edit Homework" className="mainLogoLink" ><h1 className="mainLogo"><span>Edit</span>Homework</h1></a>
						<LoginBlock/>
					</Row>
				</Container>
			</div>
			<div className="page-content">
				<Container>  
					<Row>
					{this.state.loader ? <Loader type="Bars" color="#736b66" height={50} width={50} /> : 
					 this.props.page == "404" || this.props.tasks.filter((tsk)=>tsk.id==this.props.task).length == 0 ? <Page404/> : <PageView/>}	
					</Row>
				</Container>
			</div>				
			<div className="page-footer">
				<Container>                
					<Row>EditHomework, olga@edithomework.com</Row>
				</Container>
			</div>			
			</>
        );
    }
}

export default connect(mapStateToProps)(App);