import React from 'react'

const ViewProduct = (props) => {
    return (
        <div>
            <p className="modal-subtitle">Supplier Basic Details</p>
            <div className="supplier-form-2">
                <div><p className="attribute-key"><b>Name</b></p><p className="attribute-value">{props.data.supplier_name}</p></div>
                <div><p className="attribute-key"><b>Company</b></p><p className="attribute-value">{props.data.supplier_company}</p></div>
            </div>
            <div><p className="attribute-key"><b>Description</b></p><p className="attribute-value">{props.data.supplier_description}</p></div>
            <p className="modal-subtitle">Supplier Product Images</p>
            <div className="view-uploaded-images">
                {
                    props.data.supplier_images.map(d=><div key={d}>
                        <img className="uploaded-image" src={d} alt=""/>
                    </div>)
                }
            </div>
            <p className="modal-subtitle">Supplier Storage Details</p>
            <div className="supplier-form-2">
                <div><p className="attribute-key"><b>Unit Quantity</b></p><p className="attribute-value">{`${props.data.supplier_unit_quantity} ${props.data.supplier_unit_quantity_type}`}</p></div>
                <div></div>
                <div><p className="attribute-key"><b>Supplier Unit Price</b></p><p className="attribute-value">{`₹ ${props.data.supplier_unit_price}`}</p></div>
                <div><p className="attribute-key"><b>Quantity</b></p><p className="attribute-value">{`${props.data.qty} Units`}</p></div>
                <div><p className="attribute-key"><b>Expiration Date</b></p><p className="attribute-value">{props.data.expiry_date}</p></div>
                <div><p className="attribute-key"><b>Manufacturing Date</b></p><p className="attribute-value">{props.data.mfg_date}</p></div>
                <div><p className="attribute-key"><b>Product ID Type</b></p><p className="attribute-value">{props.data.product_id_type}</p></div>
                <div><p className="attribute-key"><b>Product ID</b></p><p className="attribute-value">{props.data.product_id}</p></div>
            </div>
        </div>
    )
}

export default ViewProduct
