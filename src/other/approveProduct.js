import React, {Component} from 'react'
import { Steps, Button, message, Form, Input, InputNumber, Select } from 'antd'
import axios from 'axios'

const { Step } = Steps
const { TextArea } = Input

class ApproveProduct extends Component{
    constructor(props){
        super(props)
        this.state = {
            current_approve_product_stage: 0,
            approver_img: [],
            basic_details: {},
            pricing_details: {},
            approver_img_uploading: false,
            approving_product: false
        }
    }

    setApproveProductStage = (x) => {
        this.setState({
            current_approve_product_stage: x
        })
    }

    updateBasicDetails = (values) => {
        this.setState({
            basic_details: values
        }, () => {
            this.setApproveProductStage(1)
        })
    }

    updatePricingDetails = (values) => {
        this.setState({
            pricing_details: values
        }, () => {
            this.setApproveProductStage(2)
        })
    }

    approveProduct = () => {
        this.toggleApprovingProduct()
        let { basic_details, pricing_details } = this.state
        let { shop_name, shop_company, shop_description, tags } = basic_details
        let { market_price, shop_price, shop_images, color } = pricing_details
        let supplier_name = this.props.data.supplier_name
        // Manip supplier_img
        let approver_images = this.state.approver_img.map(d=>d.url)
        let formData = {
            shop_name, shop_company, shop_description, tags,
            market_price, shop_price, shop_images, color,
            supplier_name, approver_images
        }
        console.log(formData)
        const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
        axios.post(`${process.env.REACT_APP_BACKEND}/products/approve`,formData,config)
        .then(res=>{
            console.log(res.data)
            this.toggleApprovingProduct()
            this.props.fetchProducts()
            this.props.toggleModal()
        })
        .catch(err=>{
            console.log(err)
            this.toggleApprovingProduct()
        })
    }

    toggleApproveImgUploading = () => {
        this.setState(prevState => ({
            product_img_uploading: !prevState.product_img_uploading
        }))
    }

    toggleApprovingProduct = () => {
        this.setState(prevState => ({
            adding_product: !prevState.adding_product
        }))
    }

    onPreview = (file) => {
        for (var img in this.state.approver_img){
            if (file.uid===this.state.approver_img[img].uid){
                this.setViewUrl(this.state.approver_img[img])
            }
        }
    }

    onRemove = (file) => {
        let temp_img = []
        for (var img in this.state.approve_img){
            if (file.uid!==this.state.approve_img[img].uid){
                temp_img.push(this.state.approve_img[img])
            }
        }
        this.setState({product_img: temp_img})
    }

    render() {
        // Approver Image Upload Props
        let approve_img_upload_props = {
            beforeUpload: file => {
                this.toggleApproveImgUploading()
                //validating file size
                const isLt3M = file.size / 1024 / 1024 < 3;
                if (!isLt3M) message.error('Image must smaller than 2MB!')
                else {
                    const formData = new FormData()
                    formData.append("file", file)
                    formData.append("upload_preset", "msiuxpoc")
                    axios.post("https://api.cloudinary.com/v1_1/dxti6efrg/image/upload", formData)
                        .then(res => {
                            let approve_img = this.state.approve_img
                            approve_img.push({
                                url: res.data.secure_url,
                                name: `${res.data.public_id.split('/')[1]}.${res.data.format}`,
                                uid: file.uid
                            })
                            this.setState({
                                    approve_img
                            }, () => {
                                this.toggleApproveImgUploading()
                            })
                        })
                }
                return false;
            },
            loading:true,
            listType:"picture-card",
            multiple: false,
            showUploadList: true,
            accept: ".png,.jpg",
            onPreview: this.onPreview,
            onRemove: this.onRemove,
            defaultFileList: this.state.pricing_details.img_upload ? this.state.pricing_details.img_upload.fileList : []
        }

        let basic_form = (
            <Form name="add_supplier" onFinish={this.updateBasicDetails} initialValues={this.state.basic_details}>
                <p className="modal-subtitle">Supplier Basic Details</p>
                <div className="supplier-form-2">
                    <div><p className="attribute-key"><b>Name</b></p><p className="attribute-value">{this.props.data.supplier_name}</p></div>
                    <div><p className="attribute-key"><b>Company</b></p><p className="attribute-value">{this.props.data.supplier_company}</p></div>
                </div>
                <div><p className="attribute-key"><b>Description</b></p><p className="attribute-value">{this.props.data.supplier_description}</p></div>
                <p className="modal-subtitle">Shopping Details</p>
                <Form.Item name="shop_name" rules={[{ required: true, message: 'Please enter Shop Name' }]}>
                    <Input placeholder="Shop Name"/>
                </Form.Item>
                <Form.Item name="shop_company" rules={[{ required: true, message: 'Please enter Shop Company' }]}>
                    <Input placeholder="Shop Company"/>
                </Form.Item>
                <Form.Item name="shop_description" rules={[{ required: true, message: 'Please enter Shop Description' }]}>
                    <TextArea rows={4} placeholder="Shop Description"/>
                </Form.Item>
                <Form.Item name="tags" rules={[{required: true, message: 'Please enter tags'}]}>
                    <Select
                        mode="tags"
                        placeholder="Enter Tags"
                        style={{ width: '100%' }}
                        open={false}
                    >
                    </Select>
                </Form.Item>
                <Form.Item>
                   <Button type="primary" htmlType="submit">Next</Button> 
                </Form.Item>
                
            </Form>
        )

        let pricing_form = <p>Pricing Form</p>
        let verification = <p>Verification</p>

        return (
            <div>
                <Steps current={this.state.current_approve_product_stage}>
                    <Step title="Basic"/>
                    <Step title="Pricing"/>
                    <Step title="Verify"/>
                </Steps>
                {this.state.current_approve_product_stage===0 && basic_form}
                {this.state.current_approve_product_stage===1 && pricing_form}
                {this.state.current_approve_product_stage===2 && verification}

            </div>
        )
    }
}

export default ApproveProduct
