import React from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

const ApprovedProductSettings = (props) => {
    return (
        <div>
            <p className="modal-subtitle">Danger Zone</p>
            <Button type="danger" icon={<DeleteOutlined/>}>Pull Product from Store</Button>
        </div>
    )
}

export default ApprovedProductSettings
