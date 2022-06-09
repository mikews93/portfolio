import { Button, Checkbox, Form, Input, Layout } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// @styles
import styles from './styles.module.scss';
import { ROUTES } from 'shared/routes';

const { Content, Footer } = Layout;

export const Login = () => {
	/**
	 * Hooks
	 */
	const location = useLocation();
	const navigate = useNavigate();
	// @ts-ignore
	const { from } = location.state || { from: { pathname: ROUTES.HOME } };

	/**
	 * Callbacks
	 */
	const onFinish = (values: any) => {
		console.log('Success:', values);
		navigate(from.pathname);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
		console.log({ location, from });
	};
	return (
		<Layout className={styles.login}>
			<Content className='flex'>
				<h1>Login</h1>
				<Form
					name='normal_login'
					className='login-form'
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
				>
					<Form.Item
						name='username'
						rules={[{ required: true, message: 'Please type your Username!' }]}
					>
						<Input
							prefix={<UserOutlined className='site-form-item-icon' />}
							placeholder='Username'
						/>
					</Form.Item>
					<Form.Item
						name='password'
						rules={[{ required: true, message: 'Please type your Password!' }]}
					>
						<Input
							prefix={<LockOutlined className='site-form-item-icon' />}
							type='password'
							placeholder='Password'
						/>
					</Form.Item>
					<Form.Item>
						<Form.Item name='remember' valuePropName='checked' noStyle>
							<Checkbox>Remember me</Checkbox>
						</Form.Item>

						<a className='login-form-forgot' href=''>
							Forgot password
						</a>
					</Form.Item>

					<Form.Item className='flex'>
						<Button type='primary' htmlType='submit' className='full-width' shape='round'>
							Log in
						</Button>
						<span className={styles.registerSection}>
							Or <Link to={ROUTES.REGISTER}>register now!</Link>
						</span>
					</Form.Item>
				</Form>
			</Content>
			<Footer className='center'>MB tech ©2022</Footer>
		</Layout>
	);
};
