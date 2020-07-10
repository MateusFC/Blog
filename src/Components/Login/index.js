import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import firebase from '../../firebase'
import './Login.css';
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email:'',
			password:''
		}
		this.Entrar = this.Entrar.bind(this)
		this.Login = this.Login.bind(this)
	}
	componentDidMount(){
		//verificar usuario logado.
		if(firebase.getCurrent()){
			return this.props.history.replace('dashboard')
		}
	}
	Entrar(e){
		e.preventDefault()
		this.Login();
	}
	Login = async () => {
		const { email, password } = this.state
		try {
			firebase.login(email,password).catch(error => {
				if (error.code === 'auth/user-not-found'){
					alert('Este usuario não existe !')
				} else {
					alert('Login/Codigo de error:' + error.code)
					return null
				}
			})
			this.props.history.replace('dashboard')
		} catch (error) {
			alert(error.message)
		}
	}
	render() {
		return (
			<div>
				<form onSubmit={this.Entrar} id='login' className="rounded ">
					<label className="font-weight-bold">Email:</label>
					<br />
					<input
						type='email'
						autoComplete='off'
						autoFocus
						value={this.state.email}
						onChange={e => {
							this.setState({email: e.target.value })
						}}
					/>
					<br />
					<label className="font-weight-bold">Password:</label>
					<br />
					<input
						type='password'
						autoComplete='off'
						value={this.state.password}
						onChange={e => {
							this.setState({ password: e.target.value })
						}}
					/>
					<br />
					<button type='submit'>Entrar</button>
					<Link to='/register'>Ainda não possui uma Conta ?</Link>
				</form>
			</div>
		)
	}
}
export default withRouter(Login)
