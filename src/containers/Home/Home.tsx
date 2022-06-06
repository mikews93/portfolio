import { Layout, Menu, Breadcrumb } from 'antd';

// @styles
import styles from './styles.module.scss';

const { Header, Content, Footer } = Layout;

export const Home = () => {
	return (
		<Layout className={styles.home}>
			<Header className={styles.header}>
				<div className={styles.logo} />
				<Menu
					theme='dark'
					mode='horizontal'
					defaultSelectedKeys={['2']}
					items={new Array(15).fill(null).map((_, index) => {
						const key = index + 1;
						return {
							key,
							label: `nav ${key}`,
						};
					})}
				/>
			</Header>
			<Content style={{ padding: '0 50px' }}>
				<Breadcrumb style={{ margin: '16px 0' }}>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item>List</Breadcrumb.Item>
					<Breadcrumb.Item>App</Breadcrumb.Item>
				</Breadcrumb>
				<div className={styles.content}>Content</div>
			</Content>
			<Footer style={{ textAlign: 'center' }}>MB tech ©2022</Footer>
		</Layout>
	);
};
