import React from 'react'
import {Link} from 'react-router-dom'
import './Header.css'
function Header(){
  return(
    <header id="main-header">
      <div className="header-content">
          <Link to='/'>
          {'<'}  Blog Programador {'>'}
          </Link>
          <Link to='/Login'>
            Entrar
          </Link>
      </div>
    </header>
  );
}
export default Header;