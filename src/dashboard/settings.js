import React, {Component} from 'react'
import { Button } from 'antd'

class Settings extends Component{
    render(){
        return (
            <div>
                <p className="workspace-title">Inventory</p>
                <Button type="danger" onClick={this.props.logout}>Logout</Button>
            </div>
        )
    }
}

export default Settings
