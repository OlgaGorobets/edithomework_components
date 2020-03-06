import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import app from './reducers';
import App from "./components/App.js";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

const store = createStore(app);

const rootItem = document.getElementById("root");
const rootItemPage = rootItem.getAttribute("data-page"),
	  rootTask = rootItem.getAttribute("data-task"),
	  rootItemImage = rootItem.getAttribute("data-image");

ReactDOM.render(
<Provider store={store}>
<BrowserRouter>
<App {...{page: rootItemPage, task: rootTask, image: rootItemImage}} />
</BrowserRouter>
</Provider>
, rootItem);