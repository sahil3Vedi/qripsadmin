//REACT
import React, {Component} from 'react'
//ANT
import { Menu } from 'antd'
//COMPS
import Settings from './settings'
import Inventory from './inventory'
import Suppliers from './suppliers'
//CSS
import '../stylesheets/dashboard.css'
//ACTIONS
import * as actions from '../actions/auth'

class Dashboard extends Component{
    constructor(props){
        super(props)
        this.state={
            current: "suppliers"
        }
    }

    handleMenuChange = e => {
        this.setState({
            current: e.key
        })
    }

    render(){
        let display = <p>{this.state.current}</p>
        switch (this.state.current){
            case "settings":
                display = <Settings logout={()=>{actions.logout(this.props.setLogin)}}/>
                break
            case "suppliers":
                display = <Suppliers/>
                break
            case "inventory":
                display = <Inventory/>
                break
            default:
                display = <p>{this.state.current}</p>
                break
        }
        return (
            <div className="admin-panel-layout">
                <div>
                    <Menu style={{ width: 256 }} mode="inline" selectedKeys={[this.state.current]} onClick={this.handleMenuChange}>
                        <Menu.Item key="dashboard">Dashboard</Menu.Item>
                        <Menu.Item key="store">Store</Menu.Item>
                        <Menu.Item key="inventory">Inventory</Menu.Item>
                        <Menu.Item key="orders">Orders</Menu.Item>
                        <Menu.Item key="deliveries">Deliveries</Menu.Item>
                        <Menu.Item key="customers">Customers</Menu.Item>
                        <Menu.Item key="suppliers">Suppliers</Menu.Item>
                        <Menu.Item key="sales">Sales</Menu.Item>
                        <Menu.Item key="settings">Settings</Menu.Item>
                    </Menu>
                </div>
                <div className="admin-workspace">
                    {display}
                </div>
            </div>
        )
    }
}

export default Dashboard
