import React, { useEffect, useState } from 'react';
import api from './servicos/api'
import history from './history'
function Candidatos(){
    const [candidatos,setCands]=useState([]);
    
    const carregarCandidatos = async () => {
      const response= await api.get('/cands');
      setCands(response.data);
    }
    
    useEffect(()=>{
        carregarCandidatos();
    },[]);
    function voltarCadastro(){
        history.push('/home')
    }
    async function Excluir(cpf)
    {
        const response = await api.delete('/cands/'+cpf);
        setCands(candidatos.filter(candidatos=>candidatos.cpf!=cpf));
     }
     async function Editar(valor)
    {
        history.push("/home",{cpf : valor});
        
     }
    return (
        <div id="listaCand">
            <main>
                <h2>Candidatos</h2>
                <ul>
                {candidatos.map(cand=>(
                    <li key={cand.cpf} className="cand-Item">
                        <header>
                            <img src={cand.foto} alt=" "/>
                            <div className="cand-nome">
                                <p>{cand.nomeCompleto}</p>
                            </div>
                        </header>
                        <div className="cand-info">
                            <p>{cand.cidade},{cand.uf}</p>
                            <p><strong>Data de Nasc:</strong> {cand.dtNasc}</p>
                            <p><strong>Telefone:</strong> {cand.tel}</p>
                            <div id="acoes">
                                <button id="btexcluir" onClick={()=>Excluir(cand.cpf)} type="button"></button>
                                <button id="bteditar" onClick={()=>Editar(cand.cpf)} type="button"></button>
                            </div>
                        </div>
                        
                    </li>
                ))}
                </ul>
            </main>
                <button onClick={voltarCadastro} type="button">Voltar para a tela de cadastro</button>
        </div>

      );
} 

export default Candidatos;