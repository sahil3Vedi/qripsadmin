import React, {Component} from 'react'
import { Modal, Button, Table, Space, message } from 'antd'
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
            loading_products: true,
            supplierData:null,
            view_supplier_modal_visible: false,
            products:[],
        }
    }

    componentDidMount(){
        this.fetchProducts(()=>{this.fetchSuppliers()})
    }

    getProductCount = (supplier) => {
        let count  = 0
        for (var product in this.state.products){
            if (this.state.products[product].supplier===supplier){
                count += 1
            }
        }
        console.log(supplier,count)
        return `${count}`
    }

    fetchSuppliers = () => {
        this.setState({
            loading_suppliers: true
        },()=>{
            const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
            axios.get(`${process.env.REACT_APP_BACKEND}/suppliers`,config)
            .then(res=>{
                let result = res.data
                let temp = []
                for (var supplier in result){
                    result[supplier].product_count = this.getProductCount(result[supplier].supplier_name)
                    result[supplier].deleteLoading = false
                    temp.push(result[supplier])
                }
                this.setState({
                    suppliers: temp,
                    loading_suppliers: false
                })
            })
        })
    }

    fetchProducts = (callback) => {
        this.setState({
            loading_products: true
        },()=>{
            const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
            axios.get(`${process.env.REACT_APP_BACKEND}/products/all`,config)
            .then(res=>{
                this.setState({
                    products: res.data,
                    loading_products: false
                },()=>{
                    callback()
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

    removeSupplier = (supplier_id) => {
        let temp_suppliers = []
        for (var supplier in this.state.suppliers){
            let temp_supplier = this.state.suppliers[supplier]
            let temp_loading = temp_supplier.deleteLoading
            if (temp_supplier._id === supplier_id){
                temp_supplier.deleteLoading = !temp_loading
            }
            temp_suppliers.push(temp_supplier)
        }
        this.setState({
            suppliers: temp_suppliers
        },()=>{
            const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
            let formData = {"supplier_id":supplier_id}
            axios.delete(`${process.env.REACT_APP_BACKEND}/suppliers/${supplier_id}`,config)
            .then(res=>{
                message.success(res.data.message)
                this.fetchProducts(()=>{this.fetchSuppliers()})
            })
            .catch(err=>{
                message.error(err.response.data.message)
                let temp_suppliers = []
                for (var supplier in this.state.suppliers){
                    let temp_supplier = this.state.suppliers[supplier]
                    let temp_loading = temp_supplier.deleteLoading
                    if (temp_supplier._id === supplier_id){
                        temp_supplier.deleteLoading = !temp_loading
                    }
                    temp_suppliers.push(temp_supplier)
                }
                this.setState({
                    suppliers: temp_suppliers
                })
            })
        })
    }

    render(){
        console.log(this.state.suppliers)
        console.log(this.state.products)
        //ADD SUPPLIER MODAL
        let add_supplier_modal = <Modal maskClosable={false} destroyOnClose width="35%" title="Add Supplier" visible={this.state.add_supplier_modal_visible} footer={null} onCancel={this.toggleAddSupplierModal}>
            <AddSupplier formStage={this.state.current_add_supplier_stage} setAddSupplierStage={this.setAddSupplierStage} fetchSuppliers={()=>{this.fetchProducts(()=>{this.fetchSuppliers()})}} toggleModal={this.toggleAddSupplierModal}/>
        </Modal>

        //VIEW SUPPLIER MODAL
        let view_supplier_modal = <Modal destroyOnClose width="50%" title="View Supplier" visible={this.state.view_supplier_modal_visible} footer={null} onCancel={this.toggleViewSupplierModal}>
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
                title: 'Location',
                dataIndex: 'supplier_city',
                key: 'supplier_city',
                render: (text,record) => (
                    `${text}, ${record.supplier_state}`
                )
            },
            {
                title: 'POC',
                dataIndex: 'poc_name',
                key: 'poc_name',
            },
            {
                title: 'Owner',
                dataIndex: 'owner_name',
                key: 'owner_name',
            },
            {
                title: 'Products',
                dataIndex: 'product_count',
                key: 'product_count',
            },
            {
                title:'',
                dataIndex:'',
                keyIndex:'',
                render: (text,record) => (
                    <Space>
                        <Button icon={<EyeOutlined/>} onClick={()=>this.viewSupplierDetails(record)}/>
                        <Button icon={<DeleteOutlined/>} loading={record["deleteLoading"]} onClick={()=>{this.removeSupplier(record["_id"])}} type="danger"/>
                    </Space>
                )
            }
        ]
        let suppliers = <div className="display-suppliers">{(this.state.loading_suppliers || this.state.loading_products) ? <QripsSpin/> : <Table rowKey={"supplier_name"} columns={supplier_columns} dataSource={this.state.suppliers}/>}</div>
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
