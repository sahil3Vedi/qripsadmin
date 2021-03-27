import React from 'react'
import { Button, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import axios from 'axios'

const ApprovedProductSettings = (props) => {

    const PullProduct = (supplier_name) => {
        props.togglePullingProduct()
        const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
        let formData = {supplier_name: supplier_name}
        axios.post(`${process.env.REACT_APP_BACKEND}/products/pullshop`,formData,config)
        .then(res=>{
            message.success(res.data.message)
            props.togglePullingProduct()
            props.fetchProducts()
            props.toggleModal()
        })
        .catch(err=>{
            console.log(err)
            props.togglePullingProduct()
        })
    }

    return (
        <div>
            <p className="modal-subtitle">Danger Zone</p>
            <Button type="danger" icon={<DeleteOutlined/>} onClick={()=>PullProduct(props.data.supplier_name)} loading={props.pullingProduct}>Pull Product from Store</Button>
        </div>
    )
}

export default ApprovedProductSettings
