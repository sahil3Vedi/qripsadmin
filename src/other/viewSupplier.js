import React, {Component} from 'react'
import { Space, Modal, Button } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import FileViewer from 'react-file-viewer'

class ViewSupplier extends Component{
    constructor(props){
        super(props)
        this.state={
            view_file: {},
            view_file_modal_visible: false,
            poc_id: {"name": props.data.poc_id_name,"url": props.data.poc_id_url},
            owner_id: {"name": props.data.owner_id_name,"url": props.data.owner_id_url},
        }
    }

    toggleViewFileModal = () => {
        this.setState(prevState=>({
            view_file_modal_visible: !prevState.view_file_modal_visible,
            view_file: prevState.view_file_modal_visible ? {} : prevState.view_file
        }))
    }

    setViewUrl = (file) => {
        this.setState({
            view_file: file
        },()=>{
            this.toggleViewFileModal()
        })
    }

    render(){
        // View File Modal
        let view_file_modal = <Modal destroyOnClose centered width="35%" closable={true} onCancel={this.toggleViewFileModal} visible={this.state.view_file_modal_visible} footer={null}>
            <FileViewer
            fileType={this.state.view_file.name ? this.state.view_file.name.split('.')[1]: null}
            filePath={this.state.view_file.url}
            errorComponent={<div><p>Error Loading File</p></div>}
            />
        </Modal>
        return (
            <div>
                {view_file_modal}
                <p className="modal-subtitle">Supplier Details</p>
                <div className="supplier-form-2">
                    <Space><p><b>Supplier Name</b></p><p>{this.props.data.supplier_name}</p></Space>
                    <Space><p><b>Supplier Description</b></p><p>{this.props.data.supplier_description}</p></Space>
                    <Space><p><b>Supplier Address</b></p><p>{this.props.data.supplier_address}</p></Space>
                    <Space><p><b>Supplier City</b></p><p>{this.props.data.supplier_city}</p></Space>
                    <Space><p><b>Supplier Pincode</b></p><p>{this.props.data.supplier_pincode}</p></Space>
                    <Space><p><b>Supplier State</b></p><p>{this.props.data.supplier_state}</p></Space>
                    <Space><p><b>Supplier Country</b></p><p>{this.props.data.supplier_country}</p></Space>
                </div>
                <p className="modal-subtitle">POC Details</p>
                <div className="supplier-form-2">
                    <Space><p><b>POC Name</b></p><p>{this.props.data.poc_name}</p></Space>
                    <Space><p><b>POC Phone</b></p><p>{this.props.data.poc_phone}</p></Space>
                    <Space><p><b>POC Email</b></p><p>{this.props.data.poc_email}</p></Space>
                    <Space><p><b>POC ID</b></p><div className="view-file">
                        <div><Button icon={<EyeOutlined/>} onClick={()=>{this.setViewUrl(this.state.poc_id)}}/></div>
                        <div><p>{`${this.props.data.poc_id_name}`}</p></div>
                    </div></Space>
                </div>
                <p className="modal-subtitle">Owner Details</p>
                <div className="supplier-form-2">
                    <Space><p><b>Owner Name</b></p><p>{this.props.data.owner_name}</p></Space>
                    <Space><p><b>Owner Phone</b></p><p>{this.props.data.owner_phone}</p></Space>
                    <Space><p><b>Owner Email</b></p><p>{this.props.data.owner_email}</p></Space>
                    <Space><p><b>Owner ID</b></p><div className="view-file">
                        <div><Button icon={<EyeOutlined/>} onClick={()=>{this.setViewUrl(this.state.owner_id)}}/></div>
                        <div><p>{`${this.props.data.owner_id_name}`}</p></div>
                    </div></Space>
                </div>
            </div>
        )
    }
}

export default ViewSupplier
