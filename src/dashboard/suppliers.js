import React, {Component} from 'react'
import { Modal, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import AddSupplier from '../other/addSupplier'
import '../stylesheets/suppliers.css'
import axios from 'axios'


class Suppliers extends Component{
    constructor(props){
        super(props)
        this.state = {
            add_supplier_modal_visible: false,
            current_add_supplier_stage: 0
        }
    }

    componentDidMount(){
        const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
        axios.get(`${process.env.REACT_APP_BACKEND}/suppliers`,config)
        .then(res=>{
            console.log(res.data)
        })
    }

    toggleAddSupplierModal = () => {
        this.setState(prevState=>({
            add_supplier_modal_visible: !prevState.add_supplier_modal_visible
        }))
    }

    render(){

        //ADD SUPPLIER MODAL
        let add_supplier_modal = <Modal maskClosable={false} destroyOnClose width="35%" title="Add Supplier" visible={this.state.add_supplier_modal_visible} footer={null} onCancel={this.toggleAddSupplierModal}>
            <AddSupplier formStage={this.state.current_add_supplier_stage} setAddSupplierStage={this.setAddSupplierStage}/>
        </Modal>

        return (
            <div>
                {add_supplier_modal}
                <p className="workspace-title">Suppliers</p>
                <Button type="primary" icon={<PlusOutlined/>} onClick={this.toggleAddSupplierModal}>Add Supplier</Button>
            </div>
        )
    }
}

export default Suppliers
