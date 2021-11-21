import api from '../../servicos/api';
import React,{useState,useEffect} from 'react';
import {useLocation} from "react-router-dom"
import history from '../../history'
import Header from '../../Componentes/Header'
function PerfilUsuario(){
    const [cod,setCod]=useState('');
    const [cpf,setCpf]=useState('');
    const [nome,setNome]=useState('');
    const [senhaUsu,setSenhaUsu] = useState(''); 
    const [senha,setSenha] = useState(''); 
    const [senhaNova,setSenhaNova] = useState('');
    const [confsenha,setConfSenha] = useState('');
    const [email,setEmail]=useState('');
    const [isOpen,setIsOpen]=useState(false);
  

    useEffect(()=>{
        setCod(localStorage.getItem('cod'));
        procurarUsuario();
    },[]);
    async function procurarUsuario(){
        console.log(localStorage.getItem('cod'));
        const response = await api.get(`/usersprocuraCod/${localStorage.getItem('cod')}`);
        setCod(response.data[0].usu_codigo);
        setCpf(response.data[0].usu_cpf)
        setNome(response.data[0].usu_nome);
        setSenhaUsu(response.data[0].usu_senha);
        setEmail(response.data[0].usu_email);
    }
    function confirmarSenha(valor1,valor2)
    {
      if(valor1===valor2)
        return true;
      else
        return false;
    }
    function formAlterar(){
        setIsOpen(!isOpen);
    }
    function senhaAtualCorreta(valor)
    {
        if(valor===senhaUsu)
            return true;
        return false;
    }
    async function alterarSenha(e){
        e.preventDefault();
        let mensagem = document.querySelector("#mensagem");
        mensagem.innerHTML="";
        if(senha.length>0 && confsenha.length>0 && senhaNova.length>0)
        {
            if(confirmarSenha(senhaNova,confsenha) && senhaAtualCorreta(senha)){
                mensagem.innerHTML="";
                var response=await api.put('/userSenha',{
                    usu_cpf:cpf,
                    usu_senha:senhaNova
                })
                alert("Senha alterada");
                setSenhaUsu(senhaNova);
                setSenha('');
                setSenhaNova('');
                setConfSenha('');
                setIsOpen(false);
            }
            else{
                if(!confirmarSenha(senhaNova,confsenha))
                mensagem.innerHTML+="<p>Senhas diferentes</p>";
                if(!senhaAtualCorreta(senha))
                mensagem.innerHTML+="<p>Senha atual incorreta</p>";
            }
        }
        else{
            mensagem.innerHTML="Dados inválidos";
        }
    }

    function cadastrarCont(){
        history.push('/CadastrarContato');
    }
    function visualizarCompra(){
        history.push('/visualizarCredito');
    }
    function alterarPerfil(){
        history.push('/formulario');
    }
    
    return (
        <div id="tela">   
            <Header/>
            
            <div id="app">
                <aside id="formulario" >
                    <h1>Perfil do usuário</h1>
                    <div>
                        <p><strong>Nome do usuário</strong></p>
                        <p>{nome}</p>
                        <p><strong >Email</strong></p>
                        <p>{email}</p>
                    </div>
                    <button type="button" className="estBtn" onClick={formAlterar}>Alterar Senha</button>
                    {isOpen && 
                    <form onSubmit={alterarSenha} id="formSenha">
                        <div className="input-block" id="block-senha">
                            <label htmlFor="senha">Senha atual</label>
                            <input type="password" name="senha" id="senha" value={senha} onChange={e=>setSenha(e.target.value)} required/>
                        </div>
                        <div className="input-block" id="block-confsenha">
                            <label htmlFor="senha2">Senha nova</label>
                            <input type="password" name="senha2" id="senha2" value={senhaNova} onChange={e=>setSenhaNova(e.target.value)} required/>
                        </div>
                        <div className="input-block" id="block-confsenha">
                            <label htmlFor="confsenha">Confirmar senha nova</label>
                            <input type="password" name="confsenha" id="confsenha" value={confsenha} onChange={e=>setConfSenha(e.target.value)} required/>
                        </div>
                        <div id="mensagem">

                        </div>
                        <button type="submit" id="btnFormAlt">Alterar</button>
                    </form>}
                    <button type="button" className="estBtn" onClick={alterarPerfil}>Alterar Perfil</button>
                    <button type="button" className="estBtn" onClick={cadastrarCont}>Cadastrar contatos</button>
                    <button type="button" className="estBtn" onClick={visualizarCompra}>Visualizar Créditos</button>
                </aside>
            </div>
        </div>
    )
}

export default PerfilUsuario;