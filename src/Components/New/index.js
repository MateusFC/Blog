import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import firebase from '../../firebase'
import { ProgressBar,Button } from 'react-bootstrap'
import './New.css'
class New extends Component {
	constructor(props) {
		super(props)
		this.state = {
			titulo: '',
			imagem: null,
			url: '',
			descricao: '',
			alert: '',
			progress: 0,
		}
		this.cadastrar = this.cadastrar.bind(this)
		this.handFile = this.handFile.bind(this)
		this.handleUpload = this.handleUpload.bind(this)
	}
	handFile = async e => {
		if (e.target.files[0]) {
			const image = e.target.files[0]
			if (image.type === 'image/png' || image.type === 'image/jpeg') {
				await this.setState({ imagem: image })
				this.handleUpload()
			} else {
				alert('Envie uma imagem do tipo PNG ou JPG')
				this.setState({ imagem: null })
				return null
			}
		}
	}
	handleUpload = async () => {
		const { imagem } = this.state
		const currentUid = firebase.getCurrentUid()
		const uploadTaks = firebase.storage.ref(`images/${currentUid}/${imagem.name}`).put(imagem)
		await uploadTaks.on(
			'state_changed',
			snapshot => {
				const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
				this.setState({ progress })
			},
			error => {
				console.log('Error' + error)
			},
			() => {
				//sucesso
				firebase.storage
					.ref(`images/${currentUid}`)
					.child(imagem.name)
					.getDownloadURL()
					.then(url => {
						this.setState({ url: url })
					})
			},
		)
	}
	componentDidMount() {
		if (!firebase.getCurrent()) {
			this.props.history.replace('/login')
			return null
		}
	}
	cadastrar = async e => {
		e.preventDefault()
		if (
			this.state.url !== '' &&
			this.state.imagem !== null &&
			this.state.titulo !== '' &&
			this.state.descricao !== '' &&
			this.state.imagem !== ''
		) {
			let posts = firebase.app.ref('posts')
			let chave = posts.push().key
			await posts.child(chave).set({
				titulo: this.state.titulo,
				imagem: this.state.url,
				descricao: this.state.descricao,
				autor: localStorage.nome,
			})
			this.props.history.push('/dashboard')
		} else {
			this.setState({ alert: 'Preencha todos os Campos!' })
		}
	}
	render() {
		return (
			<div>
				<header id='new'>
					<Link to='/dashboard'>Voltar</Link>
				</header>
				<form onSubmit={this.cadastrar} id='new-post'>
					<h2 className='d-flex justify-content-center align-items-center'>Cadastro de Post</h2><br/>
					<div className="form-group">
					<input type='file' onChange={this.handFile} />
					<br />
					{this.state.url !== '' ? (
						<img src={this.state.url} width='250' height='150' alt='Capa do post' />
					) : (
						<ProgressBar animated variant="success" now={this.state.progress}/>
					)}
					</div>
					<div className="form-group">
					<label className="font-weight-bold">Titulo:</label>
					<br/>
					<input
					className='form-control'
						type='text'
						placeholder='Nome do Post'
						value={this.state.titulo}
						onChange={e => this.setState({ titulo: e.target.value })}
					/>
					</div>
					<div className="form-group">
					<label className="font-weight-bold">Descrição:</label>
					<br />
					<textarea
					className="form-control"
						type='text'	
						placeholder='Descricao do post'
						value={this.state.descricao}
						onChange={e => this.setState({ descricao: e.target.value })}
					/>
					</div>
					<div className="form-group">
					<span>{this.state.alert}</span>
					<Button type='submit' className="btn btn-secondary btn-lg btn-block">Cadastrar</Button>
					</div>
				</form>
			</div>
		)
	}
}
export default withRouter(New)
