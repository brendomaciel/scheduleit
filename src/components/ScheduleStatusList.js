import { Space, Radio } from 'antd';

import statusList from '../constants/scheduleStatusList';

const ScheduleStatusList = () => {

    return (
        <Space direction="vertical">
            {Object.entries(statusList).map(([id, status]) => (
                <Radio
                    key={id}
                    value={parseInt(id)}
                    style={{ lineHeight: '32px' }}
                >
                    {status.name}
                </Radio>
            ))}
        </Space>
    );
};

export default ScheduleStatusList;