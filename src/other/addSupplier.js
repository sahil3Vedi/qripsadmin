import React, {Component} from 'react'
import { Button, Form, Input, Steps, Space, Upload, message, Modal } from 'antd'
import { UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios'
import FileViewer from 'react-file-viewer'

const { Step } = Steps

class AddSupplier extends Component{
    constructor(props){
        super(props)
        this.state={
            current_add_supplier_stage: 0,
            poc_id:{},
            owner_id:{},
            supplier_details: {},
            view_file:{},
            poc_details: {},
            owner_details: {},
            poc_id_uploading: false,
            owner_id_uploading: false,
            view_file_modal_visible: false,
        }
    }

    setAddSupplierStage = (x) => {
        this.setState({
            current_add_supplier_stage: x
        })
    }

    updateSupplier = (values) => {
        this.setState({
            supplier_details: values
        },()=>{
            this.setAddSupplierStage(1)
        })
    }

    updatePOC = (values) => {
        this.setState({
            poc_details: values
        },()=>{
            this.setAddSupplierStage(2)
        })
    }

    updateOwner = (values) => {
        this.setState({
            owner_details: values
        },()=>{
            this.setAddSupplierStage(3)
        })
    }

    addSupplier = () => {
        let {supplier_details,poc_details,owner_details} = this.state
        let {supplier_name,supplier_password,supplier_description,supplier_address,supplier_city,supplier_pincode,supplier_state,supplier_country} = supplier_details
        let {poc_name,poc_email,poc_phone} = poc_details
        let {owner_name,owner_email,owner_phone} = owner_details
        let poc_id_url = this.state.poc_id.url
        let poc_id_name = this.state.poc_id.name
        let owner_id_url = this.state.owner_id.url
        let owner_id_name = this.state.owner_id.name
        let formData = {
            supplier_name,supplier_password,supplier_description,supplier_address,supplier_city,supplier_pincode,supplier_state,supplier_country,
            poc_name,poc_email,poc_phone,
            owner_name,owner_email,owner_phone,
            poc_id_url,owner_id_url,poc_id_name,owner_id_name
        }
        const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
        axios.post(`${process.env.REACT_APP_BACKEND}/suppliers`,formData,config)
        .then(res=>{
            console.log(res.data)
        })
    }

    togglePOCIDUploading = () => {
        this.setState(prevState=>({
            poc_id_uploading: !prevState.poc_id_uploading
        }))
    }

    toggleOwnerIDUploading = () => {
        this.setState(prevState=>({
            owner_id_uploading: !prevState.owner_id_uploading
        }))
    }

    toggleViewFileModal = () => {
        this.setState(prevState=>({
            view_file_modal_visible: !prevState.view_file_modal_visible,
            view_file: prevState.view_file_modal_visible ? {} : prevState.view_file
        }))
    }

    deletePOCID = () => {
        this.setState({
            poc_id:{}
        })
    }

    deleteOwnerID = () => {
        this.setState({
            owner_id:{}
        })
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

        // ID Upload Props
        let poc_id_upload_props = {
            beforeUpload: file => {
                this.togglePOCIDUploading()
                //validating file size
                const isLt3M = file.size / 1024 / 1024 < 3;
                if (!isLt3M) message.error('Image must smaller than 2MB!')
                else {
                    const formData = new FormData()
                    formData.append("file",file)
                    formData.append("upload_preset","k2htrwb5")
                    axios.post("https://api.cloudinary.com/v1_1/dxti6efrg/image/upload",formData)
                    .then(res=>{
                        console.log(res.data)
                        this.setState({
                            poc_id:{
                                url: res.data.secure_url,
                                name: `${res.data.public_id.split('/')[1]}.${res.data.format}`
                            }
                        },()=>{
                            this.togglePOCIDUploading()
                        })
                    })
                }
                return false;
            },
            multiple: false,
            showUploadList: false,
            accept:".png,.jpg"
        }

        let owner_id_upload_props = {
            beforeUpload: file => {
                this.toggleOwnerIDUploading()
                //validating file size
                const isLt3M = file.size / 1024 / 1024 < 3;
                if (!isLt3M) message.error('Image must smaller than 2MB!')
                else {
                    const formData = new FormData()
                    formData.append("file",file)
                    formData.append("upload_preset","k2htrwb5")
                    axios.post("https://api.cloudinary.com/v1_1/dxti6efrg/image/upload",formData)
                    .then(res=>{
                        console.log(res.data)
                        this.setState({
                            owner_id:{
                                url: res.data.secure_url,
                                name: `${res.data.public_id.split('/')[1]}.${res.data.format}`
                            }
                        },()=>{
                            this.toggleOwnerIDUploading()
                        })
                    })
                }
                return false;
            },
            multiple: false,
            showUploadList: false,
            accept:".png,.jpg"
        }

        //Supplier Form
        let supplier_form = (
            <Form name="add_supplier" onFinish={this.updateSupplier} initialValues={this.state.supplier_details}>
                <p className="modal-subtitle">Supplier Details</p>
                <Form.Item name="supplier_name" rules={[{ required: true, message: 'Please enter Supplier Name' }]}>
                    <Input placeholder="Supplier Name"/>
                </Form.Item>
                <Form.Item name="supplier_password" rules={[{ required: true, message: 'Please enter Supplier Password' }]}>
                    <Input placeholder="Supplier Password"/>
                </Form.Item>
                <Form.Item name="supplier_description" rules={[{ required: true, message: 'Please enter Supplier Description' }]}>
                    <Input placeholder="Supplier Description"/>
                </Form.Item>
                <Form.Item name="supplier_address" rules={[{ required: true, message: 'Please enter Supplier Address' }]}>
                    <Input placeholder="Supplier Address"/>
                </Form.Item>
                <div className="supplier-form-2">
                    <Form.Item name="supplier_city" rules={[{ required: true, message: 'Please enter Supplier City' }]}>
                        <Input placeholder="Supplier City"/>
                    </Form.Item>
                    <Form.Item name="supplier_pincode" rules={[{ required: true, message: 'Please enter Supplier Pincode' }]}>
                        <Input placeholder="Supplier Pincode"/>
                    </Form.Item>
                    <Form.Item name="supplier_state" rules={[{ required: true, message: 'Please enter Supplier State' }]}>
                        <Input placeholder="Supplier State"/>
                    </Form.Item>
                    <Form.Item name="supplier_country" rules={[{ required: true, message: 'Please enter Supplier Country' }]}>
                        <Input placeholder="Supplier Country"/>
                    </Form.Item>
                    <Space>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Next</Button>
                        </Form.Item>
                    </Space>
                </div>
            </Form>
        )

        //POC Form
        let poc_form = (
            <Form name="add_poc" onFinish={this.updatePOC} initialValues={this.state.poc_details}>
                <p className="modal-subtitle">POC Details</p>
                <Form.Item name="poc_name" rules={[{ required: true, message: 'Please enter POC Name' }]}>
                    <Input placeholder="POC Name"/>
                </Form.Item>
                <Form.Item name="poc_phone" rules={[{ required: true, message: 'Please enter POC Phone' }]}>
                    <Input placeholder="POC Phone"/>
                </Form.Item>
                <Form.Item name="poc_email" rules={[{ required: true, message: 'Please enter POC Email' }]}>
                    <Input placeholder="POC Email"/>
                </Form.Item>
                {
                    this.state.poc_id.url ?
                    <div className="view-file">
                        <div><Button icon={<EyeOutlined/>} onClick={()=>{this.setViewUrl(this.state.poc_id)}}/></div>
                        <div><p>{`${this.state.poc_id.name} Uploaded`}</p></div>
                        <div><Button icon={<DeleteOutlined/>} type="danger" onClick={this.deletePOCID}/></div>
                    </div>
                    :
                    <Form.Item>
                        <Upload {...poc_id_upload_props}><Button loading={this.state.poc_id_uploading} icon={<UploadOutlined/>}>Upload POC ID</Button></Upload>
                    </Form.Item>
                }
                <Space>
                    <Form.Item>
                        <Button type="danger" onClick={()=>{this.setAddSupplierStage(0)}}>Back</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={!this.state.poc_id.url}>Next</Button>
                    </Form.Item>
                </Space>
            </Form>
        )

        //Owner Form
        let owner_form = (
            <Form name="add_owner" onFinish={this.updateOwner} initialValues={this.state.owner_details}>
                <p className="modal-subtitle">Owner Details</p>
                <Form.Item name="owner_name" rules={[{ required: true, message: 'Please enter Owner Name' }]}>
                    <Input placeholder="Owner Name"/>
                </Form.Item>
                <Form.Item name="owner_phone" rules={[{ required: true, message: 'Please enter Owner Phone' }]}>
                    <Input placeholder="Owner Phone"/>
                </Form.Item>
                <Form.Item name="owner_email" rules={[{ required: true, message: 'Please enter Owner Email' }]}>
                    <Input placeholder="Owner Email"/>
                </Form.Item>
                {
                    this.state.owner_id.url ?
                    <div className="view-file">
                        <div><Button icon={<EyeOutlined/>} onClick={()=>{this.setViewUrl(this.state.owner_id)}}/></div>
                        <div><p>{`${this.state.owner_id.name} Uploaded`}</p></div>
                        <div><Button icon={<DeleteOutlined/>} type="danger" onClick={this.deleteOwnerID}/></div>
                    </div>
                    :
                    <Form.Item>
                        <Upload {...owner_id_upload_props}><Button loading={this.state.owner_id_uploading} icon={<UploadOutlined/>}>Upload Owner ID</Button></Upload>
                    </Form.Item>
                }
                <Space>
                    <Form.Item>
                        <Button type="danger" onClick={()=>{this.setAddSupplierStage(1)}}>Back</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={!this.state.owner_id.url}>Verify</Button>
                    </Form.Item>
                </Space>
            </Form>
        )

        // Verfication of Details
        let verification = (
            <div>
                <p className="modal-subtitle">Supplier Details</p>
                <div className="supplier-form-2">
                    <Space><p><b>Supplier Name</b></p><p>{this.state.supplier_details.supplier_name}</p></Space>
                    <Space><p><b>Supplier Password</b></p><p>{this.state.supplier_details.supplier_password}</p></Space>
                    <Space><p><b>Supplier Description</b></p><p>{this.state.supplier_details.supplier_description}</p></Space>
                    <Space><p><b>Supplier Address</b></p><p>{this.state.supplier_details.supplier_address}</p></Space>
                    <Space><p><b>Supplier City</b></p><p>{this.state.supplier_details.supplier_city}</p></Space>
                    <Space><p><b>Supplier Pincode</b></p><p>{this.state.supplier_details.supplier_pincode}</p></Space>
                    <Space><p><b>Supplier State</b></p><p>{this.state.supplier_details.supplier_state}</p></Space>
                    <Space><p><b>Supplier Country</b></p><p>{this.state.supplier_details.supplier_country}</p></Space>
                </div>
                <p className="modal-subtitle">POC Details</p>
                <div className="supplier-form-2">
                    <Space><p><b>POC Name</b></p><p>{this.state.poc_details.poc_name}</p></Space>
                    <Space><p><b>POC Phone</b></p><p>{this.state.poc_details.poc_phone}</p></Space>
                    <Space><p><b>POC Email</b></p><p>{this.state.poc_details.poc_email}</p></Space>
                    <Space><p><b>POC ID</b></p><p>{this.state.poc_id.name}</p></Space>
                </div>
                <p className="modal-subtitle">Owner Details</p>
                <div className="supplier-form-2">
                    <Space><p><b>Owner Name</b></p><p>{this.state.owner_details.owner_name}</p></Space>
                    <Space><p><b>Owner Phone</b></p><p>{this.state.owner_details.owner_phone}</p></Space>
                    <Space><p><b>Owner Email</b></p><p>{this.state.owner_details.owner_email}</p></Space>
                    <Space><p><b>Owner ID</b></p><p>{this.state.owner_id.name}</p></Space>
                </div>
                <Space>
                    <Button type="danger" onClick={()=>{this.setAddSupplierStage(2)}}>Back</Button>
                    <Button type="primary" onClick={this.addSupplier}>Add Supplier</Button>
                </Space>
            </div>
        )
        return (
            <div>
                {view_file_modal}
                <Steps current={this.state.current_add_supplier_stage}>
                    <Step title="Supplier"/>
                    <Step title="POC"/>
                    <Step title="Owner"/>
                    <Step title="Verify"/>
                </Steps>
                {this.state.current_add_supplier_stage===0 && supplier_form}
                {this.state.current_add_supplier_stage===1 && poc_form}
                {this.state.current_add_supplier_stage===2 && owner_form}
                {this.state.current_add_supplier_stage===3 && verification}
            </div>
        )
    }
}

export default AddSupplier
