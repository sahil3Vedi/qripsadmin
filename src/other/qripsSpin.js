import React from 'react'
import '../stylesheets/qripsSpin.css'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

function QripsSpin(props){
    return <div className="qrips-spinner"><Spin indicator={<LoadingOutlined style={{ fontSize: 50, color:"#205072" }} spin />} tip="Loading..."/></div>
}

export default QripsSpin
