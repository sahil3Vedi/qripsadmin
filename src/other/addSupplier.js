import React, {Component} from 'react'
import { Button, Form, Input, Steps, Space } from 'antd'

const { Step } = Steps

class AddSupplier extends Component{
    constructor(props){
        super(props)
        this.state={
            current_add_supplier_stage: 0,
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
            this.addSupplier()
        })
    }

    addSupplier = () => {
        let {supplier_details,poc_details,owner_details} = this.state
        console.log(supplier_details,poc_details,owner_details)
    }

    render(){

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
                <Form.Item name="poc_id" rules={[{ required: true, message: 'Please upload POC ID' }]}>
                    <Input placeholder="POC ID"/>
                </Form.Item>
                <Space>
                    <Form.Item>
                        <Button type="danger" onClick={()=>{this.setAddSupplierStage(0)}}>Back</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Next</Button>
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
                <Form.Item name="owner_id" rules={[{ required: true, message: 'Please upload Owner ID' }]}>
                    <Input placeholder="Owner ID"/>
                </Form.Item>
                <Space>
                    <Form.Item>
                        <Button type="danger" onClick={()=>{this.setAddSupplierStage(1)}}>Back</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Next</Button>
                    </Form.Item>
                </Space>
            </Form>
        )
        return (
            <div>
                <Steps current={this.state.current_add_supplier_stage}>
                    <Step title="Supplier"/>
                    <Step title="POC"/>
                    <Step title="Owner"/>
                </Steps>
                {this.state.current_add_supplier_stage===0 && supplier_form}
                {this.state.current_add_supplier_stage===1 && poc_form}
                {this.state.current_add_supplier_stage===2 && owner_form}
            </div>
        )
    }
}

export default AddSupplier
