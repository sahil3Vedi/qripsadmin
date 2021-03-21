import React, {Component} from 'react'
import axios from 'axios'
import QripsSpin from '../other/qripsSpin'
import { Table } from 'antd'

class Inventory extends Component{
    constructor(props){
        super(props)
        this.state={
            products_loading: true,
            products: []
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
            axios.get(`${process.env.REACT_APP_BACKEND}/products/all`,config)
            .then(res=>{
                this.setState({
                    products: res.data,
                    loading_products: false
                })
            })
        })
    }

    render(){
        let product_columns = [
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
                title: 'Unit Price',
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
        ]
        let products = <div className="display-suppliers">{this.state.loading_products ? <QripsSpin/> : <Table rowKey={"supplier_name"} columns={product_columns} dataSource={this.state.products}/>}</div>
        return (
            <div>
                <p className="workspace-title">Inventory</p>
                {products}
            </div>
        )
    }
}

export default Inventory
