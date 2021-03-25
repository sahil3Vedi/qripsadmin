import React from 'react'

const ViewApprovedProduct = (props) => {
    return (
        <div>
            <p className="modal-subtitle">Shopping Details</p>
            <div className="supplier-form-2">
                <div><p className="attribute-key"><b>Name</b></p><p className="attribute-value">{props.data.shop_name}</p></div>
                <div><p className="attribute-key"><b>Company</b></p><p className="attribute-value">{props.data.shop_company}</p></div>
            </div>
            <div><p className="attribute-key"><b>Description</b></p><p className="attribute-value">{props.data.shop_description}</p></div>
            <p className="modal-subtitle">Supplier Product Images</p>
            <div className="view-uploaded-images">
                {
                    props.data.shop_images.map(d=><div key={d}>
                        <img className="uploaded-image" src={d} alt=""/>
                    </div>)
                }
            </div>
            <p className="modal-subtitle">Supplier Storage Details</p>
            <div className="supplier-form-2">
                <div><p className="attribute-key"><b>Shop Price</b></p><p className="attribute-value">{`₹ ${props.data.shop_price}`}</p></div>
                <div><p className="attribute-key"><b>Market Price</b></p><p className="attribute-value">{`₹ ${props.data.market_price}`}</p></div>
                <div><p className="attribute-key"><b>Supplier Price</b></p><p className="attribute-value">{`₹ ${props.data.supplier_unit_price}`}</p></div>
                <div><p className="attribute-key"><b>Quantity</b></p><p className="attribute-value">{`${props.data.qty} Units`}</p></div>
                <div><p className="attribute-key"><b>Expiration Date</b></p><p className="attribute-value">{props.data.expiry_date}</p></div>
                <div><p className="attribute-key"><b>Manufacturing Date</b></p><p className="attribute-value">{props.data.mfg_date}</p></div>
                <div><p className="attribute-key"><b>{`${props.data.product_id_type} Number`}</b></p><p className="attribute-value">{props.data.product_id}</p></div>
            </div>
        </div>
    )
}

export default ViewApprovedProduct
