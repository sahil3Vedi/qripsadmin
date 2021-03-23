import React, {Component} from 'react'
import { Steps, Button, message } from 'antd'
import axios from 'axios'

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
            current_product_approve_stage: x
        })
    }

    updateBasicDetails = (values) => {
        this.setState({
            basic_details: values
        }, () => {
            this.setAddProductStage(1)
        })
    }

    updatePricingDetails = (values) => {
        this.setState({
            pricing_details: values
        }, () => {
            this.setAddProductStage(2)
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

        return (
            <p> Hello World </p>
        )
    }
}

export default ApproveProduct
