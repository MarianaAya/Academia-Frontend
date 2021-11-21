import React, { useState } from 'react';
import history from '../../history'
import api from '../../servicos/api'
import './login.css'
function Login(){
  const [user,setUser] = useState('');
    const [senha,setSenha] = useState('');
    
    const validarUsuario = async () => {

      const response= await api.get(`/users/${user}/${senha}`);/*
      if(response.data.length>0){
        return true;
      }
      else{
        return false;
      }*/
      return response.data;
    }

  const logar = async (e) => {
    e.preventDefault();
    let mensagem=document.querySelector("#mensagem");
    mensagem.innerHTML="";
    if(user.length>0 && senha.length>0){
      var res=await validarUsuario();
      if(res.length>0){
        localStorage.setItem('cod',res[0].usu_codigo)
        history.push("/home");
      }
      else
        mensagem.innerHTML='Dados não cadastrados';
    }
    else
      mensagem.innerHTML='Dados vazios';
  }


  function irFormulario(){
    history.push('/formulario');
  }
  return (
      <div id='login'>
          <main>
            <h2>LOGIN</h2>
            <form onSubmit={logar}>
              <div>
                <img src="user.png" alt="icone user" className="avatar"/>
              </div>
              <input type="text" data-user placeholder="Enter Email" id="user" name="user" value={user} onChange={e=>setUser(e.target.value)} required/>
              <input type="password" data-password placeholder="Enter Password" id="password" name="password" value={senha} onChange={e=>setSenha(e.target.value)} required/>
              <div id="mensagem">

              </div>
              <button type="submit">Entrar</button>
                <p onClick={irFormulario}>Não tem um cadastro? Cadraste-se aqui</p>
            </form>
          </main>
      </div>
    );
} 
export default Login;