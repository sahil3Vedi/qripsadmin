import React, {Component} from 'react'
import axios from 'axios'
import QripsSpin from '../other/qripsSpin'
import ViewProduct from '../other/viewProduct'
import ApprovedProductSettings from '../other/approvedProductSettings'
import { Table, Modal, Space, Button } from 'antd'
import { EyeOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons'
import '../stylesheets/inventory.css'

class Store extends Component{
    constructor(props){
        super(props)
        this.state={
            products_loading: true,
            products: [],
            productData: null,
            view_product_modal_visible: false,
            approve_product_modal_visible: false,
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
            axios.get(`${process.env.REACT_APP_BACKEND}/products/store`,config)
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

    render(){
        console.log(this.state.products)
        //VIEW PRODUCT MODAL
        let view_product_modal = <Modal destroyOnClose centered width="35%" title="View Product" visible={this.state.view_product_modal_visible} footer={null} onCancel={this.toggleViewProductModal}>
            <ViewProduct data={this.state.productData}/>
        </Modal>

        //APPROVE PRODUCT MODAL
        let approve_product_modal = <Modal destroyOnClose centered width="35%" title="Product Settings" visible={this.state.approve_product_modal_visible} footer={null} onCancel={this.toggleApproveProductModal}>
            <ApprovedProductSettings data={this.state.productData} fetchProducts={this.fetchProducts} toggleModal={this.toggleApproveProductModal}/>
        </Modal>

        let product_columns = [
            {
                title:'Supplier',
                dataIndex: 'supplier',
                key:'supplier'
            },
            {
                title: 'Shop Name',
                dataIndex: 'shop_name',
                key: 'shop_name'
            },
            {
                title: 'Company',
                dataIndex: 'shop_company',
                key: 'shop_company'
            },
            {
                title: 'Shop Price',
                dataIndex: 'shop_price',
                key: 'shop_price'
            },
            {
                title: 'Market Price',
                dataIndex: 'market_price',
                key: 'market_price'
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
                        <Button icon={<SettingOutlined/>} onClick={()=>this.setProductData(record)}/>
                    </Space>
                )
            }
        ]
        let products = <div className="display-suppliers">{this.state.loading_products ? <QripsSpin/> : <Table rowKey={"supplier_name"} columns={product_columns} dataSource={this.state.products}/>}</div>
        return (
            <div>
                {view_product_modal}
                {approve_product_modal}
                <p className="workspace-title">Store</p>
                <p className="workspace-subtitle">{this.state.loading_products ? null : `${this.state.products.length} Products in Store`}</p>
                {products}
            </div>
        )
    }
}

export default Store
