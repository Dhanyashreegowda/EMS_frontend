import { Layout, Typography } from 'antd';

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      <Text type="secondary">
        Employee Management System ©{new Date().getFullYear()}
      </Text>
    </Footer>
  );
};

export default AppFooter;

