/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import firebase from '../../firebase'
import { Link, withRouter } from 'react-router-dom'
import { BsFillPlusCircleFill, BsFillXCircleFill } from 'react-icons/bs'
import { Card } from 'react-bootstrap'
import './Dashboard.css'
class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			nome: localStorage.nome,
			posts: [],
		}
		this.logout = this.logout.bind(this)
	}
	logout = async () => {
		await firebase.logout().catch(error => {
			console.log('logout:' + error)
		})
		localStorage.removeItem('nome')
		this.props.history.push('/login')
	}
	async componentDidMount() {
		if (!firebase.getCurrent()) {
			this.props.history.replace('/login')
			return null
		}
		firebase.getUserName(info => {
			localStorage.nome = info.val().nome
			this.setState({ nome: localStorage.nome })
		})

		firebase.app.ref('posts').once('value', snapshot => {
			let state = this.state
			state.posts = []
			snapshot.forEach(childItem => {
				state.posts.push({
					key: childItem.key,
					titulo: childItem.val().titulo,
					imagem: childItem.val().imagem,
					descricao: childItem.val().descricao,
					autor: childItem.val().autor,
				})
			})
			state.posts.reverse()
			this.setState(state)
		})
	}
	render() {
		return (
			<div id='dashboard'>
				<div className='container'>
					<div className=' bg-dark  d-flex justify-content-between align-items-center p-3 my-3 text-white-50 rounded shadow-sm'>
						<Link to='/dashboard/new'>
							<BsFillPlusCircleFill size='25' color='#00b4d8' />
						</Link>
						<div className='lh-100'>
							<h6 className='font-weight-bold mb-0 text-white 1h-100'>{this.state.nome}</h6>
						</div>
						<BsFillXCircleFill size='25' color='red' onClick={() => this.logout()} />
					</div>

					{this.state.posts.map(post => {
						const nome = this.state.nome
						if (post.autor === nome) {
							return (
								<Card
									style={{ width: '100%'}}
									key={post.key}
									className='d-row p-3 my-3 rounded bg-dark'>
									<Card.Title className='font-weight-bold d-flex justify-content-center align-items-center text-light'>
										<h1>{post.titulo}</h1>
									</Card.Title>
									<Card.Img variant='top' src={post.imagem} className='rounded' />
									<Card.Body className='text-light font-italic'>
										<Card.Subtitle>{post.descricao}</Card.Subtitle>
										<br />
										<Card.Text className='mb-2 text-muted'>Autor:{post.autor}</Card.Text>
									</Card.Body>
								</Card>
							)
						}
					})}
				</div>
			</div>
		)
	}
}
export default withRouter(Dashboard)
