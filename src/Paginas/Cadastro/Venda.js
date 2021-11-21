import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import {useLocation} from "react-router-dom"
import Header from '../../Componentes/Header'
function Venda()
{
  const [qtde,setQtde] = useState('0');
  const [valorTotal,setValorTotal] = useState('0');
  const [qtdeParcelas,setQtdeParcelas] = useState(0);
  const [formaPgto,setFormaPgto] = useState('A');
  const [pacote,setPacote] = useState({});
  const [isEnableField, setIsEnableField] = useState(true);
  const [venda,setVenda] = useState({});



  async function carregarVenda(valor)
  {
      
    const response = await api.get('/vendacodigo/'+valor);
    setVenda(response.data[0]);
   
   
  }
  async function carregarPacote(valor)
  {
   
    const response = await api.get('/pacscod/'+valor);
    setPacote(response.data[0]);
   
   
  }
  useEffect(() => {
    console.log(localStorage.getItem('ven'));
    if(localStorage.getItem('ven')!=null){
      carregarPacote(venda.pac_codigo);
      preencherDados();
    }
    
    
  }, [venda])
  useEffect(()=>{
    
      if(localStorage.getItem('ven')!=null)
      {
        carregarVenda(localStorage.getItem('ven'));
        
      }
      else{
        carregarPacote(localStorage.getItem('pac'));
      }
  },[]);

  function preencherDados()
  {
 
    setQtdeParcelas(parseInt(venda.ven_qtdeParcelas));
    setValorTotal(''+venda.ven_valorTotal);
    setQtde(''+venda.ven_qtde);
    setFormaPgto(venda.ven_formaPgto);
    formaParcela(venda.ven_formaPgto);

    
 
  }
  function voltarTelaInicial(valor)
  {
    history.push('/visualizarCredito');
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
  function validarQtdeParcela(valor)
  {

    if(validarNumero(valor))
    {
      
      if(valor<=pacote.pac_maxParcelamento){
        
        return true;
      }
      return false;
    }
    return false;
  }
  
  
  async function adicionarVenda(e){
    e.preventDefault();
    let mensagem = document.querySelector("#mensagem");
    
    if(validarNumero(qtde) && validarQtdeParcela(qtdeParcelas))
    {
      if(localStorage.getItem('ven')===null || localStorage.getItem('ven')===undefined){
          const response=await api.post('/venda',{
          ven_qtde: qtde,
          ven_totalCreditos: (pacote.pac_qtdeAulas+pacote.pac_qtdeBonus) * qtde,
          ven_saldo: 0,
          ven_valorTotal: valorTotal,
          ven_qtdeParcelas: qtdeParcelas,
          ven_formaPgto: formaPgto,
          dias: pacote.pac_prazoExpira,
          usu_codigo: localStorage.getItem('cod'),
          pac_codigo: localStorage.getItem('pac')
        })
        localStorage.removeItem('pac');
        setQtde('');
        setQtdeParcelas('');
        setValorTotal('');
        setFormaPgto('');
        alert('Compra realizada com sucesso');
        voltarTelaInicial(localStorage.getItem('cod'));
      }
      else{
        const response=await api.put('/venda',{
          ven_qtde: qtde,
          ven_totalCreditos: (pacote.pac_qtdeAulas+pacote.pac_qtdeBonus) * qtde,
          ven_saldo: 0,
          ven_valorTotal: valorTotal,
          ven_qtdeParcelas: qtdeParcelas,
          ven_formaPgto: formaPgto,
          ven_codigo: venda.ven_codigo
        })
        mensagem.innerHTML="";
        localStorage.removeItem('ven');
        setQtde('');
        setQtdeParcelas('');
        setValorTotal('');
        setFormaPgto('');
        alert('Compra alterada com sucesso');
        voltarTelaInicial(venda.usu_codigo);
      }
      
    }
    else
    {
      
      mensagem.innerHTML="";
      if(!validarNumero(qtde))
        mensagem.innerHTML+="<p>Quantidade tem valor inválido</p>";
      if(!validarNumero(qtdeParcelas))
        mensagem.innerHTML+="<p>Quantidade de parcela tem valor inválido</p>";
      else
      {
      
        if(!validarQtdeParcela(qtdeParcelas)){
        
          mensagem.innerHTML+="<p>Quantidade de parcelas excedeu o limite</p>";
          
        }
      }
    
      
    }
    
  }
  function preencherTotal(valor)
  {
    let v=parseFloat(pacote.pac_valor)
    
    setQtde(valor);
    if(validarNumero(valor))
    setValorTotal(parseInt(valor)*v);
    else
    setValorTotal(0);
  }
  function formaParcela(valor)
  {
    if(valor==='C')
      setIsEnableField(false);
    else
    {
      setQtdeParcelas(0);
      setIsEnableField(true);
    }
    setFormaPgto(valor);

  }
  return (
      <div>
        <Header/>
        <div id="app">
        <aside id="formulario" >
          <h1>Cadastrar Compra</h1>
          <form onSubmit={adicionarVenda} >
       
            <div className="input-block" id="block-qtde">
              <label htmlFor="nome">Quantidade</label>
              <input name="qtde" id="qtde" value={qtde} onChange={e=>preencherTotal(e.target.value)} required/>
            </div>
            <div className="input-block" id="block-valorTotal">
              <label htmlFor="valorTotal">Valor Total</label>
              <input name="valorTotal" id="valorTotal" disabled={true} value={valorTotal} /*onChange={e=>setValorTotal(e.target.value)}*/ required/>
            </div>
        
            <div className="input-block" id="block-formaPgto">
                <label htmlFor="formaPgto">Forma de Pagamento</label>
                <select id="select-formaPgto" onChange={e=>formaParcela(e.target.value)} value={formaPgto}>
                  <option id="op-pgtoA" value="A">Dinheiro</option>
                  <option id="op-pgtoB" value="B">Cartão de débito</option>
                  <option id="op-pgtoC" value="C">Cartão de crédito</option>
                </select>
            </div>
            <div className="input-block" id="block-qtdeParcelas">
              <label htmlFor="qtdeParcelas">Quantidade de parcela</label>
              <input name="qtdeParcelas" id="qtdeParcelas" disabled={isEnableField} value={qtdeParcelas} onChange={e=>setQtdeParcelas(e.target.value)}/>
            </div>

            <div id="mensagem">

            </div>
            <button type="submit" id="btnForm">Salvar</button>
    
          </form>
        </aside>
      </div>
  </div>
  );
}

export default Venda;