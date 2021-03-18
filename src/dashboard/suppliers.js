import React, {Component} from 'react'
import { Modal, Button, Table, Space } from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import AddSupplier from '../other/addSupplier'
import ViewSupplier from '../other/viewSupplier'
import QripsSpin from '../other/qripsSpin'
import '../stylesheets/suppliers.css'
import axios from 'axios'


class Suppliers extends Component{
    constructor(props){
        super(props)
        this.state = {
            add_supplier_modal_visible: false,
            current_add_supplier_stage: 0,
            suppliers:[],
            loading_suppliers: true,
            supplierData:null,
            view_supplier_modal_visible: false,
        }
    }

    componentDidMount(){
        this.fetchSuppliers()
    }

    fetchSuppliers = () => {
        this.setState({
            loading_suppliers: true
        },()=>{
            const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
            axios.get(`${process.env.REACT_APP_BACKEND}/suppliers`,config)
            .then(res=>{
                this.setState({
                    suppliers: res.data,
                    loading_suppliers: false
                })
            })
        })
    }

    toggleAddSupplierModal = () => {
        this.setState(prevState=>({
            add_supplier_modal_visible: !prevState.add_supplier_modal_visible
        }))
    }

    toggleViewSupplierModal = () => {
        this.setState(prevState=>({
            view_supplier_modal_visible: !prevState.view_supplier_modal_visible
        }))
    }

    viewSupplierDetails = (record) => {
        this.setState({
            supplierData: record
        },()=>{
            this.toggleViewSupplierModal()
        })
    }

    render(){

        //ADD SUPPLIER MODAL
        let add_supplier_modal = <Modal maskClosable={false} destroyOnClose width="35%" title="Add Supplier" visible={this.state.add_supplier_modal_visible} footer={null} onCancel={this.toggleAddSupplierModal}>
            <AddSupplier formStage={this.state.current_add_supplier_stage} setAddSupplierStage={this.setAddSupplierStage} fetchSuppliers={this.fetchSuppliers} toggleModal={this.toggleAddSupplierModal}/>
        </Modal>

        //VIEW SUPPLIER MODAL
        let view_supplier_modal = <Modal destroyOnClose width="35%" title="View Supplier" visible={this.state.view_supplier_modal_visible} footer={null} onCancel={this.toggleViewSupplierModal}>
            <ViewSupplier data={this.state.supplierData}/>
        </Modal>

        // DISPLAY SUPPLIERS
        const supplier_columns = [
            {
                title: 'Supplier Name',
                dataIndex: 'supplier_name',
                key: 'supplier_name',
            },
            {
                title: 'City',
                dataIndex: 'supplier_city',
                key: 'supplier_city',
            },
            {
                title:'',
                dataIndex:'',
                keyIndex:'',
                render: (text,record) => (
                    <Space>
                        <Button icon={<EyeOutlined/>} onClick={()=>this.viewSupplierDetails(record)}/>
                        <Button icon={<DeleteOutlined/>} type="danger"/>
                    </Space>
                )
            }
        ]
        let suppliers = <div className="display-suppliers">{this.state.loading_suppliers ? <QripsSpin/> : <Table rowKey={"supplier_name"} columns={supplier_columns} dataSource={this.state.suppliers}/>}</div>
        return (
            <div>
                {view_supplier_modal}
                {add_supplier_modal}
                <p className="workspace-title">Suppliers</p>
                <Button type="primary" icon={<PlusOutlined/>} onClick={this.toggleAddSupplierModal}>Add Supplier</Button>
                {suppliers}
            </div>
        )
    }
}

export default Suppliers
