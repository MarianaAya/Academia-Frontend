import api from '../../servicos/api';
import React,{useState,useEffect} from 'react';
import history from '../../history'
import Header from '../../Componentes/Header'
import {FiTrash2} from 'react-icons/fi'
import './ContTabela.css'
function CadastroContatos(){
    const [nome,setNome]=useState('');
    const [celular,setCelular]=useState('');
    const [relacao,setRelacao]=useState('');
    const [codigo,setCodigo]=useState('');
    const [contatos,setContatos]=useState([]);
  


    useEffect(()=>{
        setCodigo(localStorage.getItem('cod'));
        carregarContatos();
    },[]);

    const carregarContatos = async () => {
        const response= await api.get('/contatos/'+localStorage.getItem('cod'));
        setContatos(response.data);
    }
    async function Excluir(codigo)
    {
        const response = await api.delete('/contatos/'+codigo);
        setContatos(contatos.filter(contatos=>contatos.con_codigo!==codigo));
    }
    function voltarPerfil(){
        console.log(codigo);
        history.push('/Perfil',{cod:codigo});
    }
    function validarTelefone(valor)
    {
      if(/[a-zA-Z]/.test(valor))
        return false;
      else
      {
        if(/^\([1-9]{2}\) [0-9]{5}\-[0-9]{4}/.test(valor))
          return true;
        else
          return false;
      }
    }
    async function cadastrarContato(e){
        e.preventDefault();
        let mensagem = document.querySelector("#mensagem");
        mensagem.innerHTML="";
        if(nome.length>0 && celular.length>0 && relacao.length>0)
        {
            if(validarTelefone(celular)){
                let qtde=0;
                for(let i=0;i<contatos.length;i++)
                    qtde=contatos[i].con_codigo;
                console.log(codigo);
                qtde=qtde+1;
                console.log(qtde);
                    const response=await api.post('/contatos',{
                        usu_codigo:codigo,
                        con_codigo:qtde,
                        con_nome:nome,
                        con_celular:celular,
                        con_relacao:relacao
                })
                
                alert('Contato cadastrado');
                setNome('');
                setCelular('');
                setRelacao('');
                carregarContatos();
            }
            else
                mensagem.innerHTML="<p>Telefone inválido</p>";
        }
    }

    return(
        <div id="tela">    
            <Header/>
            <div id="app">
                <aside id="formulario" >
                    <h1>Cadastrar Contato</h1>
                    <form onSubmit={cadastrarContato} >
                        <div className="input-block" id="block-nomeContato">
                            <label htmlFor="nome">Nome</label>
                            <input name="nome" id="nome" value={nome} onChange={e=>setNome(e.target.value)} required/>
                        </div>
                        <div className="input-block" id="block-fone">
                            <label htmlFor="celular">Celular</label>
                            <input name="celular" id="celular" value={celular} onChange={e=>setCelular(e.target.value)} placeholder="(xx) xxxxx-xxxx" required/>
                        </div>
                        <div className="input-block" id="block-relacao">
                            <label htmlFor="relacao">Relação</label>
                            <input name="relacao" id="relacao" value={relacao} onChange={e=>setRelacao(e.target.value)} required/>
                        </div>
                        <div id="mensagem">

                        </div>
                        <button type="submit" id="btnForm">Cadastrar</button>
                        <button type="button" onClick={voltarPerfil}>Voltar ao perfil</button>
                    </form>
                    <div id="divTable">
                        <table id="tabela">
                            <thead>
                                <tr>
                                    <td>Nome</td>
                                    <td>Celular</td>
                                    <td>Relação</td>
                                    <td>Excluir</td>
                                </tr>
                            </thead>
                            <tbody>
                                {contatos.map(contato=>(
                                    <tr key={contato.con_codigo}>
                                        <td>{contato.con_nome}</td>
                                        <td>{contato.con_celular}</td>
                                        <td>{contato.con_relacao}</td>
                                        <td>
                                            <button id="btexcluir" onClick={()=>Excluir(contato.con_codigo)} type="button">
                                                <FiTrash2 size={18} color="#999"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </aside>
            </div>
        </div>
    );
}
export default CadastroContatos;