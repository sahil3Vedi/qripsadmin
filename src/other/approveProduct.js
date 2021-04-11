import React, {Component} from 'react'
import { Steps, Button, message, Form, Input, InputNumber, Select, Upload, Space, Tag } from 'antd'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'axios'

const { Step } = Steps
const { TextArea } = Input
const { Option } = Select
const colors = ['#D2E7FF','#FFEDBB','#FFC6C6','#E8FFC6']

class ApproveProduct extends Component{
    constructor(props){
        super(props)
        this.state = {
            current_approve_product_stage: 0,
            approver_img: [],
            basic_details: {},
            pricing_details: {"market_price":props.data.supplier_unit_price,"shop_price":props.data.supplier_unit_price},
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
        let { market_price, shop_price, color } = pricing_details
        let supplier_name = this.props.data.supplier_name
        // Manip supplier_img
        let shop_images = this.state.approver_img.map(d=>d.url)
        let formData = {
            shop_name, shop_company, shop_description, tags,
            market_price, shop_price, shop_images, color,
            supplier_name
        }
        const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
        axios.post(`${process.env.REACT_APP_BACKEND}/products/approve`,formData,config)
        .then(res=>{
            message.success(res.data.message)
            this.toggleApprovingProduct()
            this.props.fetchProducts()
            this.props.toggleModal()
        })
        .catch(err=>{
            message.error(err.res.data.message)
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

    setColor = (color) => {
        let pricing_details = this.state.pricing_details
        pricing_details.color = color
        this.setState({
            pricing_details
        })
    }

    generateImage = (d) => {
        return <p>{d.url}</p>
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
                            let approver_img = this.state.approver_img
                            approver_img.push({
                                url: res.data.secure_url,
                                name: `${res.data.public_id.split('/')[1]}.${res.data.format}`,
                                uid: file.uid
                            })
                            this.setState({
                                    approver_img
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
            accept: ".svg",
            onPreview: this.onPreview,
            onRemove: this.onRemove,
            defaultFileList: this.state.pricing_details.img_upload ? this.state.pricing_details.img_upload.fileList : []
        }

        let basic_form = (
            <Form name="add_basic" onFinish={this.updateBasicDetails} initialValues={this.state.basic_details}>
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

        let pricing_form = (
            <Form name="add_pricing" onFinish={this.updatePricingDetails} initialValues={this.state.pricing_details}>
                <p className="modal-subtitle">Pricing Details</p>
                <div className="supplier-form-2">
                    <div><p className="attribute-key"><b>Supplier Unit Price</b></p><p className="attribute-value">{this.props.data.supplier_unit_price}</p></div>
                    <div><p className="attribute-key"><b>Content Per Unit</b></p><p className="attribute-value">{`${this.props.data.supplier_unit_quantity}${this.props.data.supplier_unit_quantity_type}`}</p></div>
                    <div>
                        <p className="attribute-key"><b>Market Price</b></p>
                        <Form.Item name="market_price" rules={[{ required: true, message: 'Please enter Market Price' }]}>
                            <InputNumber precision={0} placeholder="Market Price" min={this.props.data.supplier_unit_price} max={1500} formatter={value => `₹ ${value}`} step={10} parser={value => value.replace('₹ ', '')}/>
                        </Form.Item>
                    </div>
                    <div>
                        <p className="attribute-key"><b>Shop Price</b></p>
                        <Form.Item name="shop_price" rules={[{ required: true, message: 'Please enter Shop Price' }]}>
                            <InputNumber precision={0} placeholder="Shop Price" min={this.props.data.supplier_unit_price} max={1500} formatter={value => `₹ ${value}`} step={10} parser={value => value.replace('₹ ', '')}/>
                        </Form.Item>
                    </div>
                </div>
                <p className="attribute-key"><b>Upload Image</b></p>
                <Form.Item name="img_upload" rules={[{ required: true, message: 'Please Upload an Image' }]}>
                    <Upload {...approve_img_upload_props}>{this.state.product_img_uploading ? <LoadingOutlined spin /> : <UploadOutlined/>}</Upload>
                </Form.Item>
                <p className="attribute-key"><b>Shopping Color</b></p>
                <div className="supplier-form-2">
                    <Form.Item name="color" rules={[{ required: true, message: 'Please select a Color' }]}>
                        <Select placeholder="Select Color" onChange={this.setColor}>
                            {colors.map(d=><Option value={d} key={d} style={{backgroundColor:d}}>{d}</Option>)}
                        </Select>
                    </Form.Item>
                    <div style={{backgroundColor:this.state.pricing_details.color, width:"100%",height:"32px",borderRadius:"10px"}} ></div>
                </div>
                <Space>
                    <Form.Item>
                       <Button type="danger" onClick={()=>this.setApproveProductStage(0)}>Back</Button>
                    </Form.Item>
                    <Form.Item>
                       <Button type="primary" htmlType="submit">Next</Button>
                    </Form.Item>
                </Space>
            </Form>
        )

        let verification = (
            <div>
                <p className="modal-subtitle">Supplier Product Details</p>
                <div className="supplier-form-2">
                    <div><p className="attribute-key"><b>Supplier Name</b></p><p className="attribute-value">{this.props.data.supplier_name}</p></div>
                    <div><p className="attribute-key"><b>Supplier Company</b></p><p className="attribute-value">{this.props.data.supplier_company}</p></div>
                    <div><p className="attribute-key"><b>Supplier Unit Price</b></p><p className="attribute-value">{this.props.data.supplier_unit_price}</p></div>
                    <div><p className="attribute-key"><b>Expiration Date</b></p><p className="attribute-value">{this.props.data.expiry_date}</p></div>
                    <div><p className="attribute-key"><b>Quantity</b></p><p className="attribute-value">{this.props.data.qty}</p></div>
                    <div><p className="attribute-key"><b>{`${this.props.data.product_id_type} Number`}</b></p><p className="attribute-value">{this.props.data.product_id}</p></div>
                </div>
                <p className="modal-subtitle">Final Product Details</p>
                <div className="supplier-form-2">
                    <div><p className="attribute-key"><b>Product Name</b></p><p className="attribute-value">{this.state.basic_details.shop_name}</p></div>
                    <div><p className="attribute-key"><b>Product Company</b></p><p className="attribute-value">{this.state.basic_details.shop_company}</p></div>
                    <div><p className="attribute-key"><b>Product Price</b></p><p className="attribute-value">{this.state.pricing_details.shop_price}</p></div>
                    <div><p className="attribute-key"><b>Product Market Price</b></p><p className="attribute-value">{this.state.pricing_details.market_price}</p></div>
                </div>
                <div className="view-uploaded-images">
                    {
                        this.state.approver_img.map(d=><div key={d.url}>
                            <img className="approved-image" src={d.url} alt=""/>
                            <div className="image-resting" style={{backgroundColor:this.state.pricing_details.color}}></div>
                        </div>)
                    }
                </div>
                <div><p className="attribute-key"><b>Product Description</b></p><p className="attribute-value">{this.state.basic_details.shop_description}</p></div>
                <div><p className="attribute-key"><b>Tags</b></p><p className="attribute-value">{this.state.basic_details.tags ? this.state.basic_details.tags.map(d=><Tag key={d}>{d}</Tag>) : null}</p></div>
                <Space>
                    <Form.Item>
                        <Button type="danger" onClick={()=>this.setApproveProductStage(1)}>Back</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={this.approveProduct} loading={this.state.approving_product}>Approve</Button>
                    </Form.Item>
                </Space>
            </div>
        )

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
