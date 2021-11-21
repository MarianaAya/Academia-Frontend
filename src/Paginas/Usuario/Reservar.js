import api from '../../servicos/api';
import React,{useState,useEffect} from 'react';
import {useLocation} from "react-router-dom"
import history from '../../history'
import Header from '../../Componentes/Header'
import './estAgenda.css'
import {FiX} from 'react-icons/fi'
function Reservar(){
    const [cod,setCod]=useState('');
    const [codA,setCodA]=useState('');
    const [codV,setCodV]=useState('');
    const [credito,setCredito]=useState('');
    const [observacao,setObservacao]=useState('');
    const [capacidade,setCapacidade]=useState('');
    const [agendas,setAgendas]=useState([]);
    const [reservados,setReservados]=useState([]);
    useEffect(()=>{
        
        setCod(localStorage.getItem('cod'));
        setCodV(localStorage.getItem('ven'));
        carregarAgendas();
        carregarUser();
    },[]);
    /*
    useEffect(()=>{
        //carregarReservados();
        carregarUser();
    },[agendas]);
    const carregarReservados = async () => {
        const response= await api.get('/reservavend/'+localStorage.getItem('ven')).then((resp)=>{
            setReservados(resp.data);
        });
    }
    */
    const carregarUser = async () => {
        const response = await api.get(`/vendacodigo/${localStorage.getItem('ven')}`);
        setCredito(response.data[0].ven_totalCreditos);
    }
    const carregarAgendas = async () => {
        
        const response= await api.get('/agenda').then((response)=>{
            setAgendas(response.data);
        }).then(async ()=>{
            const response= await api.get('/reservavend/'+localStorage.getItem('ven')).then((resp)=>{
                setReservados(resp.data);
            });
        });
    }
    function mudarFormato(valor){
        var agendaDat;

        agendaDat=new Date(valor);
        valor="";
        /*
        valor+=agendaDat.getDate()+"/"+(agendaDat.getMonth()+1)+"/"+agendaDat.getFullYear()+
                " Horário: "+agendaDat.getHours()+":"+agendaDat.getMinutes()+":"+agendaDat.getSeconds();*/
        
        if(agendaDat.getDate()<10)
            valor+='0';
        valor+=agendaDat.getDate()+"/";
        if(agendaDat.getMonth()+1<10)
            valor+='0';
        valor+=(agendaDat.getMonth()+1)+"/";
        valor+=agendaDat.getFullYear();
        valor+=" Horário:";
        if(agendaDat.getHours()<10)
            valor+='0';
        valor+=agendaDat.getHours()+":";
        if(agendaDat.getMinutes()<10)
            valor+='0';
        valor+=agendaDat.getMinutes()+":";
        if(agendaDat.getSeconds()<10)
            valor+='0';
        valor+=agendaDat.getSeconds();
   
        return valor;
    }
    function diaAula(valor){
        let i=0;

        while(agendas[i].age_codigo!==valor)
            i++;

        return mudarFormato(agendas[i].age_dataHora);
    }
    function voltarPerfil(){
        history.push("/Perfil",{cod:cod});
    }
    function diferencaHoras(valor){
        var i=0;
        var diff=0;
        if(agendas.length>0){
        while(i<agendas.length && valor!==agendas[i].age_codigo)
            i++;
            var atual=new Date();
            var horaAula=new Date(agendas[i].age_dataHora);
            diff = Math.abs((atual - horaAula) / 3600000);
        }
        if(diff>5)
        return false
            else
        return true;
    }
    const cancelarReserva = async (codAgen,codVenda) => {
        for(var i=0;codAgen!==agendas[i].age_codigo;i++);

        const response3=await api.delete(`/reserva/${codVenda}/${codAgen}`)
        const response2=await api.put('/vendaCredito',{
            ven_codigo:codV,
            ven_totalCreditos:credito+1
        });
        const response=await api.put('/agenda',{
            cod:agendas[i].age_codigo,
            qtde:agendas[i].age_capacidade+1
        })
        setCredito(credito+1);
        carregarAgendas();
    }
    const reservarHora = async (valor,capacidade) => {
        const resp= await api.get(`/reserva/${codV}/${valor}`);
        if(credito>0){
            if(resp.data.length!==0){
                alert('Já foi reservado uma aula nesse dia e horário');
                setCodA('');
                setCapacidade('');
            }
            else
            {
                setCodA(valor);
                setCapacidade(capacidade);
                window.scrollTo(0,0);
            }
        }
        else
        {
            alert('Você não possui créditos');
        }
    }
    async function reservarAula(e){
        e.preventDefault();
        let mensagem=document.querySelector("#mensagem");
        mensagem.innerHTML='';
        if(codA!==''){
            const response=await api.post('/reserva',{
                Acod:codA,
                Vcod:codV,
                obs:observacao
            })
            const response2=await api.put('/agenda',{
                cod:codA,
                qtde:capacidade-1
                
            })
            const response3=await api.put('/vendaCredito',{
                ven_codigo:codV,
                ven_totalCreditos:credito-1
            });
            setCredito(credito-1);
            setCodA('');
            setCapacidade('');
            setObservacao('');
            carregarAgendas();
        }
        else
        {
            mensagem.innerHTML='Escolha em horário';
        }
    }
    return( 
        <div id='tela'>
            <Header/>
            <div id='app'>
                
                <div id='listAgenda'>
                    <div id="formulario">
                        <form onSubmit={reservarAula}>
                            <div className="input-block" id="block-codigo">
                                <label htmlFor="codVen">Código da Venda</label>
                                <input type="text" name="codVen" id="codVen" value={codV} disabled="disabled" required/>
                            </div>
                            <div className="input-block" id="block-codigo">
                                <label htmlFor="codAge">Código Agenda</label>
                                <input type="text" name="codAge" id="codAge" value={codA} disabled="disabled" onChange={e=>setCodA(e.target.value)} required/>
                            </div>
                            <div className="input-block"id="block-observacao">
                                <label htmlFor="observacao">Observação</label>
                                <input type="observacao" name="observacao" id="observacao" value={observacao} onChange={e=>setObservacao(e.target.value)}/>
                            </div>
                            <div id="mensagem">

                            </div>
                            <button type="submit">Confirmar reserva</button>
                        </form>
                    </div>
                    <h1>Reservar</h1>
                    <ul>
                        {agendas.map(age=>(
                            <li key={age.age_codigo} className="agenda-Item">
                                <header>
                                    {mudarFormato(age.age_dataHora)}                           
                                </header>
                                <div className="agenda-info">
                                    <p>Código da Agenda: {age.age_codigo}</p>
                                    <p>Capacidade: {age.age_capacidade}</p> 
                                    <button type='button' className="estBtn" disabled={age.age_capacidade===0 || credito<=0} onClick={()=>reservarHora(age.age_codigo,age.age_capacidade)}>Reservar</button>   
                                </div>
                            </li>
                        ))}
                    </ul>
                        <h1>Reservados</h1>
                        <h1>Créditos disponíveis: {credito}</h1>
                    <ul>
                        {reservados.map(res=>(
                            <li key={res.res_codigo} className="agenda-Item">
                                <header>
                                    {mudarFormato(res.res_dtReserva)}                           
                                </header>
                                <div className="agenda-info">
                                    <p>Codigo Venda: {res.ven_codigo}</p>
                                    <p>Codigo Agenda: {(res.age_codigo)}</p>
                                    <p>Dia: {diaAula(res.age_codigo)}</p>
                                    <div id="textEsq">
                                        <button type='button' disabled={diferencaHoras(res.age_codigo)} onClick={()=>cancelarReserva(res.age_codigo,res.ven_codigo)}>
                                            <FiX size={19}/>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button type="button" className="estBtn" onClick={voltarPerfil}>Voltar ao perfil</button>
                </div>
            </div>
        </div>
    )
}
export default Reservar;