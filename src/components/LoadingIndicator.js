import { Space, Spin } from 'antd';

const LoadingIndicator = () => {

    return (
        <Space
            align="center"
            style={{ width: '100%', minHeight: 320, justifyContent: 'center' }}
        >
            <Spin size="large" />
        </Space>
    );
};

export default LoadingIndicator;