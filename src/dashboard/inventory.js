import React, {Component} from 'react'
import axios from 'axios'
import QripsSpin from '../other/qripsSpin'
import ViewProduct from '../other/viewProduct'
import ApproveProduct from '../other/approveProduct'
import { Table, Modal, Space, Button } from 'antd'
import { EyeOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons'
import '../stylesheets/inventory.css'

class Inventory extends Component{
    constructor(props){
        super(props)
        this.state={
            products_loading: true,
            products: [],
            productData: null,
            view_product_modal_visible: false,
            approve_product_modal_visible: false,
            pulling_product: false
        }
    }

    componentDidMount(){
        this.fetchProducts()
    }

    fetchProducts = () =>{
        this.setState({
            loading_products: true
        },()=>{
            const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
            axios.get(`${process.env.REACT_APP_BACKEND}/products/inventory`,config)
            .then(res=>{
                this.setState({
                    products: res.data,
                    loading_products: false
                })
            })
        })
    }

    toggleViewProductModal = () => {
        this.setState(prevState=>({
            view_product_modal_visible: !prevState.view_product_modal_visible
        }))
    }

    setProductData = (record) => {
        this.setState({
            productData:record ? record : null
        },()=>{
            this.toggleApproveProductModal()
        })
    }

    toggleApproveProductModal = () => {
        this.setState(prevState=>({
            approve_product_modal_visible: !prevState.approve_product_modal_visible
        }))
    }

    viewProductDetails = (record) => {
        this.setState({
            productData: record
        },()=>{
            this.toggleViewProductModal()
        })
    }

    togglePullingProduct = () => {
        this.setState(prevState=>({
            pulling_product: !prevState.pulling_product
        }))
    }

    render(){
        //VIEW PRODUCT MODAL
        let view_product_modal = <Modal destroyOnClose centered width="35%" title="Supplier Product Details" visible={this.state.view_product_modal_visible} footer={null} onCancel={this.toggleViewProductModal}>
            <ViewProduct data={this.state.productData}/>
        </Modal>

        //APPROVE PRODUCT MODAL
        let approve_product_modal = <Modal destroyOnClose centered width="35%" title="Approve Product" visible={this.state.approve_product_modal_visible} footer={null} onCancel={this.toggleApproveProductModal}>
            <ApproveProduct data={this.state.productData} fetchProducts={this.fetchProducts} toggleModal={this.toggleApproveProductModal}/>
        </Modal>

        let product_columns = [
            {
                title:'Supplier',
                dataIndex: 'supplier',
                key:'supplier'
            },
            {
                title: 'Product Name',
                dataIndex: 'supplier_name',
                key: 'supplier_name'
            },
            {
                title: 'Company',
                dataIndex: 'supplier_company',
                key: 'supplier_company'
            },
            {
                title: 'Supplier Unit Price',
                dataIndex: 'supplier_unit_price',
                key: 'supplier_unit_price'
            },
            {
                title: 'Quantity',
                dataIndex: 'qty',
                key: 'qty'
            },
            {
                title: 'Manufactured',
                dataIndex: 'mfg_date',
                key: 'mfg_date'
            },
            {
                title: 'Expiring',
                dataIndex: 'expiry_date',
                key: 'expiry_date'
            },
            {
                title:'',
                dataIndex:'',
                keyIndex:'',
                render: (text,record) => (
                    <Space>
                        <Button icon={<EyeOutlined/>} onClick={()=>this.viewProductDetails(record)}/>
                        <Button icon={<CheckCircleOutlined/>} onClick={()=>this.setProductData(record)}/>
                        <Button icon={<SettingOutlined/>}/>
                    </Space>
                )
            }
        ]
        let products = <div className="display-suppliers">{this.state.loading_products ? <QripsSpin/> : <Table rowKey={"supplier_name"} columns={product_columns} dataSource={this.state.products}/>}</div>
        return (
            <div>
                {view_product_modal}
                {approve_product_modal}
                <p className="workspace-title">Inventory</p>
                <p className="workspace-subtitle">{this.state.loading_products ? null : `${this.state.products.length} Products in Inventory`}</p>
                {products}
            </div>
        )
    }
}

export default Inventory
