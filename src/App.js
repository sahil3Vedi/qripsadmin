//REACT
import React, {Component} from 'react'
//COMPS
import Login from './login/login'
import Dashboard from './dashboard/dashboard'
//ACTIONS
import * as actions from './actions/auth'
//CSS
import './stylesheets/global.css'
import 'antd/dist/antd.css'

class App extends Component {
    constructor(props){
        super(props)
        this.state={
            loggedIn: false,
        }
    }

    componentDidMount(){
        actions.authCheckState(this.setLogin)
    }

    setLogin = (value) => {
        this.setState({loggedIn: value})
    }

    render(){
        let login = <Login setLogin={this.setLogin}/>
        let dashboard = <Dashboard setLogin={this.setLogin}/>
        return(
            <div>{this.state.loggedIn ? dashboard : login}</div>
        )
    }
}

export default App
