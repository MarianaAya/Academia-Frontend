import api from '../../servicos/api';
import React,{useState,useEffect} from 'react';
import history from '../../history'
import Header from '../../Componentes/Header'
import './estCompra.css'
import {FiTrash2, FiEdit2,FiShare2} from 'react-icons/fi'
function VisualizarCreditos(){
    const [vendas,setVendas] = useState([]);
    const [filtro,setFiltro] = useState('');

    const carregarVendas = async () => {
        const response= await api.get('/vendausercodigo/'+localStorage.getItem('cod'));
        setVendas(response.data);
    }
    const carregarVendasValidos = async () => {
        const response= await api.get('/vendavalido/'+localStorage.getItem('cod'));
        setVendas(response.data);
    }
    const carregarVendasPeriodo = async () => {
        const response= await api.get('/vendaperiodo/'+localStorage.getItem('cod'));
        console.log(response.data);
        setVendas(response.data);
    }
    useEffect(()=>{
        carregarVendas();
    },[]);
    useEffect(()=>{
      
        if(filtro===null || filtro==="todas")
            carregarVendas();
        else
        {
            if(filtro==="creditos validos"){
       
                carregarVendasValidos();
            }
            else
            {
                if(filtro==="compras dias")
                    carregarVendasPeriodo();
            }
        }
    },[filtro]);
    async function Excluir(codigo)
    {
        const response = await api.delete('/venda/'+codigo);
        setVendas(vendas.filter(vendas=>vendas.ven_codigo!==codigo));
     }
    function Editar(valor)
    {
        localStorage.setItem('ven',valor);
        history.push("/cadastrarVenda"); 
    }
    function voltarPerfil(){
        history.push("/Perfil");
    }
    function mudarEstruturaData(valor){
        var date=new Date(valor);
        let dat="";
        if(date.getDate()<10)
            dat+='0';
        dat+=date.getDate()+"/";
        if(date.getMonth()+1<10)
            dat+='0';
        dat+=(date.getMonth()+1)+"/";
        dat+=date.getFullYear();
        
        
        return dat;
    }
    function FazerReserva(valor){
        localStorage.setItem('ven',valor);
        history.push("/Reservar");
    }
    return (
        <div id='tela'>
            <Header/>
            <div id='app'>
                
                <div id='compraVis'>
                    <h1>COMPRAS EFETUADAS</h1>
                    <div id='filtro'>
                        <select id="select-filtro" value={filtro}  onChange={e=>setFiltro(e.target.value)}>
                            <option value="todas">
                                Todas
                            </option>
                            <option value="creditos validos">
                                Compra com Créditos válidos
                            </option>
                            <option value="compras dias">
                                Compra realizada nos ultimos 30 dias
                            </option>
                        </select>
                    </div>
                    <ul>
                        {vendas.map(ven=>(

                            <li key={ven.ven_codigo} className="venda-Item">
                                <header>
                                    <div className="venda-nome">
                                        <p>{ven.ven_codigo}</p>  
                                    </div>
                                    <div className='venda-valorTotal'>
                                        <p>Valor Total: R$ {ven.ven_valorTotal}</p>
                                    </div>
                                </header>
                                <div className="venda-info">
                                    <p>Quantidade: {ven.ven_qtde}</p>
                                    <p>Quantidade total de créditos: {ven.ven_totalCreditos}</p>
                                    <p>Data da compra: { mudarEstruturaData(ven.ven_dtVenda)}</p>
                                    <p>Data do Vencimento: {mudarEstruturaData(ven.ven_dtExpira)}</p>
                                </div>
                                <div id="acoes">
                                    <button id="btreservar" disabled={ven.ven_status!=="P"} onClick={()=>FazerReserva(ven.ven_codigo)}>
                                      <FiShare2 size={18}/>
                                    </button>
                                    <button id="btexcluir" disabled={ven.ven_status==="P"} onClick={()=>Excluir(ven.ven_codigo)} type="button">
                                        <FiTrash2 size={18} />
                                    </button>
                                    <button id="bteditar" disabled={ven.ven_status==="P"} onClick={()=>Editar(ven.ven_codigo)} type="button">
                                        <FiEdit2 size={18} />
                                    </button>
                                </div>
                                
                            </li>
                        ))}
                    </ul>
                    <button type="button" className="estBtn" onClick={voltarPerfil}>Valtar ao perfil</button>
                </div>
            </div>
        </div>
    )
}
export default VisualizarCreditos;