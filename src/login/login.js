import React, {Component} from 'react'
import { Form, Input, Button, message } from 'antd'
import * as actions from '../actions/auth'
import '../stylesheets/login.css'

class Login extends Component{
    constructor(props){
        super(props)
        this.state={
            signInLoading: false
        }
    }

    toggleSignInLoading = () => {
        this.setState(prevState=>({
            signInLoading: !prevState.signInLoading
        }))
    }

    onFinish = (values: any) => {
        this.toggleSignInLoading()
        actions.authLogin(values,this.toggleSignInLoading,this.props.setLogin)
    };

    onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        message.error("Not Authenticated")
    };

    render(){
        return (
            <div className="login">
                <p className="login-title">Admin Login</p>
                <Form name="basic" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
                    <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                        <Input placeholder="Username"/>
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password placeholder="Password"/>
                    </Form.Item>
                    <Form.Item>
                        <Button loading={this.state.signInLoading} type="primary" htmlType="submit">Sign In</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default Login
