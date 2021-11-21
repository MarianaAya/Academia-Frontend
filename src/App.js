import React from 'react'
import './css/global.css'
import './css/app.css'
import './user.png'
import { Route,Router,Switch } from 'react-router-dom'
import Formulario from './Paginas/Cadastro/Formulario'
import Login from './Paginas/Login/Login'
import history from './history'
import Candidatos from './Candidatos'
import TelaInicial from './Paginas/TelaInicial/TelaInicial'
import PerfilUsuario from './Paginas/Usuario/PerfilUsuario'
import CadastroContatos from './Paginas/Cadastro/CadastroContatos'
import VisualizarCreditos from './Paginas/Usuario/visualizarCreditos'
import Venda from './Paginas/Cadastro/Venda'
import Reservar from './Paginas/Usuario/Reservar'
function App() {
  return(
    <Router history={history}>
      <Switch>
        <Route path="/" exact={true} component={Login}/>
        <Route path="/home" exact={true} component={TelaInicial}/>
        <Route path="/formulario" exact={true} component={Formulario}/>
        <Route path="/Candidatos" exact={true} component={Candidatos}/>
        <Route path="/Perfil" exact={true} component={PerfilUsuario}/>
        <Route path="/CadastrarContato" exact={true} component={CadastroContatos}/>
        <Route path="/visualizarCredito" exact={true} component={VisualizarCreditos}/>
        <Route path="/CadastrarVenda" exact={true} component={Venda}/>
        <Route path="/Reservar" exact={true} component={Reservar}/>
      </Switch>
    </Router>
  );
}

export default App;
