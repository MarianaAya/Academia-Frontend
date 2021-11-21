import api from '../../servicos/api';
import history from '../../history'
import './telaInicial.css'
import React, {useState,useEffect} from 'react';
import {FiUser,FiSearch} from 'react-icons/fi'
function TelaInicial()
{
    const [pacotes,setPacs]=useState([]);
    const [busca,setBusca]=useState('');
    const [isOpen,setIsOpen]=useState(false);


    const carregarPacotes = async () => {
      const response= await api.get('/pacs');
      setPacs(response.data);
    }
    const mostrarPacotesPesq=async()=>{
        const response=await api.get('/pacs/'+busca);
        setPacs(response.data);
    }
    function menuPerfil(){
        setIsOpen(!isOpen);
    }
    function sairMenu(){
        setIsOpen(false);
    }
    const entrarPerfil=async()=>{
        history.push("/Perfil");
    }
    const Logar=async()=>{
        localStorage.clear();
        history.push("/");
    }
    async function CadastrarVenda(valor)
    {
        localStorage.setItem('pac',valor);
        history.push("/CadastrarVenda" );
    }
    useEffect(()=>{
        carregarPacotes();
    },[]);
    return (
        <div id="tela">
            <header>
                <button type="button" size={18} id="btnInicio">Academia</button>
                <div id="pesquisa">                
                    <input type="text" placeholder="Pesquise um pacote..."value={busca} onChange={e=>setBusca(e.target.value)}></input>
                    <button type="button" onClick={mostrarPacotesPesq}>
                        <FiSearch size={19} color="#009900"/>
                    </button>
                </div>
                <div id="divBtn">
                    <button type="button" className="btnUser" onMouseEnter={menuPerfil}>
                        <FiUser size={30} color="#ffffff" />
                    </button>
                    {isOpen && <div id="menu" onMouseLeave={sairMenu}>
                        <ul>
                            <li><button type="button" onClick={entrarPerfil}>Meu perfil</button></li>
                            <li><button type="button" onClick={Logar}>Sair</button></li>
                        </ul>
                    </div>}
                    
                </div>
            </header>
            <div id="conteudo">
                <main>
                    <ul>
                        {pacotes.map(pac=>(
                            <li key={pac.pac_codigo} className="pac-Item">
                                <div className="pac-nome">
                                    <p>Pacote</p>
                                </div>
                                <div className="pac-info">
                                    <p><strong>Valor:</strong> R${pac.pac_valor}</p>
                                    <p><strong>Prazo:</strong> {pac.pac_prazoExpira} dias</p>
                                    <p><strong>Quantidade de parcelas:</strong> {pac.pac_maxParcelamento}</p>
                                    <p><strong>Quantidade Aulas:</strong> {pac.pac_qtdeAulas} dias + {pac.pac_qtdeBonus} bônus</p>
                                    <p><strong>Descrição:</strong> {pac.pac_descricao}</p>
                                </div>
                                <div className="pac-buttons">
                                    <button type="button" onClick={()=>CadastrarVenda(pac.pac_codigo)}>Cadastrar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </main>
            </div>

        </div>
    )
}
export default TelaInicial;