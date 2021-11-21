import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import './estFormulario.css'
import Header from '../../Componentes/Header'
function Formulario()
{
  const [cpf,setCPF] = useState('');
  const [nome,setNome] = useState('');
  const [dtNasc,setDtNasc] = useState('');
  const [fone,setFone] = useState('');
  const [email,setEmail] = useState('');
  const [sexo,setSexo] = useState('');
  const [peso,setPeso] = useState('');
  const [altura,setAltura] = useState('');
  const [senha,setSenha] = useState('');
  const [confsenha,setConfSenha] = useState(''); 
  const [unidade,setUnidade] = useState('');
  const [unidades,setUnidades] = useState([]);
  const [isOpen,setIsOpen]=useState(true);
  const [button,setButton] = useState("Salvar");
  const [titulo,setTitulo] = useState("Cadastrar Usuário");
  const [emailAtual,setEmailAtual] = useState('');
  
  const [verContatos,setContatos]=useState([]);
  const [nomeContato,setNomeContato] = useState('');
  const [parentesco,setParentesco] = useState('');
  const [celular,setCelular] = useState('');

  const carregarUnidades = async () => {
    const response= await api.get('/unidades');
    setUnidades(response.data);
  }
  useEffect(()=>{
    console.log(localStorage.getItem('cod'));
    if(localStorage.getItem('cod')!==null && localStorage.getItem('cod'))
    {
      alterarCandidato();
    }
    carregarUnidades();
  },[]);
  
  async function alterarCandidato(){
    setTitulo("Alterar Perfil");
    setButton("Alterar");
    const cpf_input =  document.querySelector("#cpf");
    cpf_input.disabled=true;
  
    setIsOpen(false);
    const response = await api.get(`/usersprocuraCod/${localStorage.getItem('cod')}`);
    var date=new Date(response.data[0].usu_dtNasc);
    var dat=date.getFullYear()+"-";
    if(date.getMonth()+1<10)
      dat+='0';
    dat+=(date.getMonth()+1)+"-";
    if(date.getDate()<10)
      dat+='0';
    dat+=date.getDate();

    setCPF(response.data[0].usu_cpf);
    setNome(response.data[0].usu_nome);
    setDtNasc(dat);
    setFone(response.data[0].usu_fone);
    setEmail(response.data[0].usu_email);
    setSexo(response.data[0].usu_sexo)
    setPeso(response.data[0].usu_peso);
    setAltura(response.data[0].usu_altura);
    setSenha(response.data[0].usu_senha);
    setUnidade(response.data[0].uni_codigo);
    setConfSenha(response.data[0].usu_senha);

    setEmailAtual(response.data[0].usu_email);
  }
  
  function vazio(valor)
  {
    let v=''+valor;
    if(v.length>0)
      return true;
    return false;
  }
  function validarCPF(valor)
  {
    if(/[0-9]{3}[\.][0-9]{3}[\.][0-9]{3}[\-][0-9]{2}/.test(valor))
      return true;
    return false;
  }
  function validarEmail(valor)
  {
      var exp = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]/i;
      if(exp.test(valor))
          return true;
      return false;
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
  function confirmarSenha(valor1,valor2)
  {
    if(valor1===valor2)
      return true;
    else
      return false;
  }
  function validarTexto(valor)
  {
    if(!/[0-9]/.test(valor))
      return true;
    else
      return false;
  }
  function validarNumero(valor){
    if(/[0-9]/.test(valor))
      return true;
    return false;
  }

  function validarSexo(valor){
    if(valor==='M' || valor==='F')
      return true;
    return false;
  }
  async function validarCPFRepetido(valor){
    const response = await api.get('/users/'+valor).then((resp)=>{
      
      if(resp.data.length>0)
        return false;
      else
        return true;
    })
    return response;
  }
  
  async function validarEmailRepetido(valor){
    const response = await api.get('/usersEmail/'+valor).then((resp)=>{
  
      if(resp.data.length>0)
        return false;
      else
        return true;
    })
    return response;

  }
  function voltarLogin(){
    history.push('/');
  }
  function voltarPerfil(){
    history.push('/Perfil');
  }
  async function addLista(){
  
    //deixei os valores fixos, mas poderiam ser os estados
    //se os estados tiverem o mesmo nome, pode ser simplificado assim 
    /*const data= {
      nome,
      celular,
      parentesco,
      };*/
    let mensagem = document.querySelector("#mensagemContato");
    mensagem.innerHTML="";
    console.log( validarTelefone(celular));
    if(vazio(nomeContato) && vazio(parentesco) && validarTelefone(celular))
    {
      
      let tam=verContatos.length;
      const data= {
          codigo: tam,
          nome: nomeContato,
          celular: celular,
          parentesco:parentesco
          };
      setNomeContato('');
      setCelular('');
      setParentesco('');
      setContatos([...verContatos, data]); //contatos é um estado (do tipo vetor)    
    }
    else
    {
        if(!validarTelefone(celular))
          mensagem.innerHTML+="<p>Celular não válido</p>";
        if(!vazio(parentesco))
          mensagem.innerHTML+="<p>Relação vazia</p>";
        if(!vazio(nomeContato))
          mensagem.innerHTML+="<p>Unidade vazia</p>";
    }
  }
  async function adicionarUsers(e){
    e.preventDefault();
    let mensagem = document.querySelector("#mensagem");
    
    const respCPF= await validarCPFRepetido(cpf);
    const respEmail= await validarEmailRepetido(email);
    var confere=false;

    if( vazio(unidade)  && confirmarSenha(senha,confsenha) && validarCPF(cpf) && validarEmail(email) && validarSexo(sexo) && validarTelefone(fone))
    {
      if(button==="Salvar")
      {
        mensagem.innerHTML="";
        if(respCPF && respEmail)
        {
            let codUser;
            const response=await api.post('/users',{
                usu_cpf:cpf,
                usu_nome:nome,
                usu_email:email,
                usu_dtNasc:dtNasc,
                usu_fone:fone,
                usu_sexo:sexo,
                usu_peso:peso,
                usu_altura:altura,
                usu_senha:senha,
                uni_codigo:unidade
            })

            codUser=response.data.lastId;
            for(let i=0;i<verContatos.length;i++)
            {
         
              const response=await api.post('/contatos',{
                usu_codigo:codUser,
                con_codigo:verContatos[i].codigo,
                con_nome:verContatos[i].nome,
                con_celular:verContatos[i].celular,
                con_relacao:verContatos[i].parentesco
              })
              
            }
            alert('Usuário cadastrado');
            setCPF("");
            setNome("");
            setDtNasc("");
            setFone("");
            setEmail("");
            setSexo("")
            setPeso("");
            setAltura("");
            setSenha("");
            setUnidade("");
            setConfSenha("");
            history.push('/');
        }
        else
        {
          if(!respCPF)
          mensagem.innerHTML+="<p>CPF já cadastrado</p>";
          
          if(!respEmail)
          mensagem.innerHTML+="<p>Email já cadastrado</p>";
        }
          
      }
      else
      {
      
        if(email!==emailAtual)
        {
          if(!respEmail)
            confere=false;
          else
            confere=true;
        }
        if(email===emailAtual || confere)
        {
          mensagem.innerHTML="";
          var response=await api.put('/userAlt',{
            usu_cpf:cpf,
            usu_nome:nome,
            usu_email:email,
            usu_dtNasc:dtNasc,
            usu_fone:fone,
            usu_sexo:sexo,
            usu_peso:peso,
            usu_altura:altura,
            usu_senha:senha,
            uni_codigo:unidade

            
          })

          mensagem.innerHTML="";
          alert('Perfil alterado');
          setCPF("");
          setNome("");
          setDtNasc("");
          setFone("");
          setEmail("");
          setSexo("")
          setPeso("");
          setAltura("");
          setSenha("");
          setUnidade("");
          history.push('/Perfil');
        }
        else
        {
          mensagem.innerHTML="<p>Email já cadastrado</p>";
        }
      }
    }
    else
    {
      mensagem.innerHTML="";
      if(!validarTexto(nome))
        mensagem.innerHTML+="<p>Nome inválido</p>";
      if(!validarCPF(cpf))
        mensagem.innerHTML+="<p>CPF inválido</p>";
      if(!confirmarSenha(senha,confsenha))
        mensagem.innerHTML+="<p>Senhas diferentes</p>"
      if(!validarEmail(email))
        mensagem.innerHTML+="<p>Email não válido</p>";
      if(!validarTelefone(fone))
        mensagem.innerHTML+="<p>Telefone não válido</p>";
      if(!validarNumero(peso))
        mensagem.innerHTML+="<p>Peso não válido</p>";
      if(!validarNumero(altura))
        mensagem.innerHTML+="<p>Altura não válido</p>";
      if(!validarSexo(sexo))
        mensagem.innerHTML+="<p>Não foi escolhida qual é o sexo</p>";
      if(!vazio(unidade))
      mensagem.innerHTML+="<p>Unidade vazia</p>";
    }
  }
    


  return (
    <div id="tela">
      {(!isOpen) && <Header/>}
      <div id='app'>
        <aside id="formulario" >
          <h1 id="titulo">{titulo}</h1>
          <form onSubmit={adicionarUsers} >
            <div className="input-block" id="block-nome">
              <label htmlFor="nome">Nome</label>
              <input name="nome" id="nome" value={nome} onChange={e=>setNome(e.target.value)} required/>
            </div>
            <div className="input-block" id="block-dtNasc">
              <label htmlFor="dtNasc">Data de nascimento</label>
              <input name="dtNasc" id="dtNasc" type="date" required value={dtNasc} onChange={e=>setDtNasc(e.target.value)} required/>
            </div>
            <div className="input-block" id="block-cpf">
              <label htmlFor="cpf">CPF</label>
              <input name="cpf" id="cpf" value={cpf} onChange={e=>setCPF(e.target.value)} placeholder="xxx.xxx.xxx-xx" required/>
            </div>
            <div className="input-block" id="block-email">
              <label htmlFor="email">Email</label>
              <input name="email" id="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
            </div>
            <div className="input-block" id="block-fone">
              <label htmlFor="fone">Telefone</label>
              <input name="fone" id="fone" value={fone} onChange={e=>setFone(e.target.value)} placeholder="(xx) xxxxx-xxxx" required/>
            </div>
            <div className="input-block" id="block-peso">
              <label htmlFor="peso">Peso</label>
              <input type ="number" name="peso" id="peso" value={peso} onChange={e=>setPeso(e.target.value)} required/>
            </div>
            <div className="input-block" id="block-altura">
              <label htmlFor="altura">Altura (em cm)</label>
              <input type ="number" name="altura" id="altura" value={altura} onChange={e=>setAltura(e.target.value)} required/>
            </div>
            <div className="input-block" id="block-sexo">
              <label htmlFor="Sexo">Sexo</label>
              <label className="input-block">Feminino
                <input type="radio" name="Sexo" id="Sexo" value="F" checked={sexo==='F'} onClick={e=>setSexo(e.target.value)} onChange={e=>setSexo(e.target.value)}/>
              </label>
              <label className="input-block">Masculino
                <input type="radio" name="Sexo" id="Sexo" value="M" checked={sexo==='M'} onClick={e=>setSexo(e.target.value)} onChange={e=>setSexo(e.target.value)}/>
              </label>
            </div>
            <div className="input-block" id="block-unidade">
                <label htmlFor="unidade">Unidade</label>
                <select id="select-unidade" value={unidade} onChange={e=>setUnidade(e.target.value)}>
                  <option id="op-selecione" value="">
                      Selecione uma opcao
                  </option>
                  {unidades.map(uni=>(
                      <option key={uni.uni_codigo} value={uni.uni_codigo} >
                          {uni.uni_descricao}
                      </option>
                  ))}
                  </select>
            </div>
            {isOpen &&
              <> 
              <div className="input-block" id="block-senha">
                <label htmlFor="senha">Senha</label>
                <input type="password" name="senha" id="senha" value={senha} onChange={e=>setSenha(e.target.value)} required/>
              </div>
              <div className="input-block" id="block-confsenha">
                <label  htmlFor="senha">Confirmar Senha</label>
                <input type="password" name="confsenha" id="confsenha" value={confsenha} onChange={e=>setConfSenha(e.target.value)} required/>
              </div>
              </>
            }
              <div id="mensagem">

              </div>
              {isOpen &&
              <div id="cadastroContato">
                <h1>Cadastrar Contato</h1>
      
                    <div className="input-block" id="block-nomeContato">
                        <label htmlFor="nome">Nome</label>
                        <input name="nome" id="nome" value={nomeContato} onChange={e=>setNomeContato(e.target.value)} />
                    </div>
                    <div className="input-block" id="block-foneContato">
                        <label htmlFor="celular">Celular</label>
                        <input name="celular" id="celular" value={celular} onChange={e=>setCelular(e.target.value)} placeholder="(xx) xxxxx-xxxx" />
                    </div>
                    <div className="input-block" id="block-relacao">
                        <label htmlFor="relacao">Relação</label>
                        <input name="relacao" id="relacao" value={parentesco} onChange={e=>setParentesco(e.target.value)} />
                    </div>
                    <div id="mensagemContato">

                    </div>
                    <button type="button" onClick={addLista} id="btnFormContato">Cadastrar</button>
                    <div id="divTable">
                          <table id="tabela">
                              <thead>
                                  <tr>
                                      <td>Nome</td>
                                      <td>Celular</td>
                                      <td>Relação</td>
                                  </tr>
                              </thead>
                              <tbody>
                                  {verContatos.map(contato=>(
                                      <tr key={contato.codigo}>
                                          <td>{contato.nome}</td>
                                          <td>{contato.celular}</td>
                                          <td>{contato.parentesco}</td>
                                        
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                    
         
                
              </div>

            }
            <button type="submit" id="btnForm">{button}</button>
             
            {isOpen && <button type="button" onClick={voltarLogin}>Voltar a tela do login</button>}
            {(!isOpen) && 
              <button type="button" onClick={voltarPerfil}>Voltar ao perfil</button>
            }
          </form>
          
            
        </aside>    
      </div>
  </div>
  );
}

export default Formulario;