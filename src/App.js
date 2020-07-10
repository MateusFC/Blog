import React, { Component } from 'react'
import './global.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './Components/Home'
import Login from './Components/Login'
import Register from './Components/Register'
import Header from './Components/Header'
import firabase from './firebase'
import Dashboard from './Components/DashBoard';
import New from'./Components/New';
class App extends Component{
	state={
		firebaseInitialized:false
	};
	componentDidMount(){
		firabase.isInitialized().then(resultado =>{
			//devolve o usuario
			this.setState({firebaseInitialized: resultado})
		})
	}
	render(){
		return this.state.firebaseInitialized !== false ? (
			<BrowserRouter>
				<Header />
				<Switch>
					<Route exact path='/' component={Home} />
					<Route exact path='/login' component={Login} />
					<Route exact path='/dashboard' component={Dashboard} />
					<Route exact path='/register' component={Register} />
					<Route exact path='/dashboard/new' component={New} />
				</Switch>
			</BrowserRouter>
		) : (
			<h1>Carregando...</h1>
		)
	}
}
export default App
