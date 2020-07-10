import React, { Component } from 'react'
import firebase from '../../firebase'
import {Card} from 'react-bootstrap'
import './Home.css'
class Home extends Component {
	state = {
		posts: [],
	}
	componentWillMount() {
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
			state.posts.reverse();
			this.setState(state)
		})
	}
	render() {
		return (
			<section id="post">
				{this.state.posts.map((post)=>{
					return(
						<Card style={{width:'100%'}} key={post.key} className="d-row p-3 my-3 bg-dark rounded " >
						<Card.Title className='font-weight-bold d-flex justify-content-center align-items-center text-light'><h1>{post.titulo}</h1></Card.Title>
					<Card.Img variant="top"  src={post.imagem} className="rounded" />
					<Card.Body className="text-light font-italic">
						<Card.Subtitle>{post.descricao}</Card.Subtitle><br/>
						<Card.Text className="mb-2 text-muted">Autor:{post.autor}</Card.Text>
					</Card.Body>
				</Card>
					);
				})}
			</section>
		)
	}
}
export default Home
