import {useLocation} from "react-router-dom"
import history from '../history'
import {FiUser} from 'react-icons/fi'
import React, {useState} from 'react';
function Header(){

    const [isOpen,setIsOpen]=useState(false);

    function menuPerfil(){
        setIsOpen(!isOpen);
    }
    function sairMenu(){
        setIsOpen(false);
    }
    const AlterarPerfil=async()=>{
        history.push("/Perfil");
    }
    const Logar=async()=>{
        localStorage.clear();
        history.push("/");
    }
    function voltarTela(){
        localStorage.removeItem('ven');
        history.push('/home');
    }
    return(
    <header>
        <button type="button" size={18} id="btnInicio" onClick={voltarTela}>Academia</button>
        <div id="divBtn">
            <button type="button" className="btnUser" onMouseEnter={menuPerfil}>
                <FiUser size={30} color="#ffffff" />
            </button>
            {isOpen && <div id="menu" onMouseLeave={sairMenu}>
                <ul>
                    <li><button type="button" onClick={AlterarPerfil}>Meu perfil</button></li>
                    <li><button type="button" onClick={Logar}>Sair</button></li>
                </ul>
            </div>}
            
        </div>
    </header>
    );
}
export default Header;