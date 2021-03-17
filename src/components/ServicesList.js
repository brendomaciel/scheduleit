import { useState, useEffect } from 'react';

import { Space, Radio, Spin, message } from 'antd';

import serviceApi from '../services/services.api';

import { formatCurrency } from '../utils';

const ServicesList = () => {

    const [data, setData] = useState([]);
    const [isLoadingServices, setIsLoadingServices] = useState(false);

    const fetchServices = async () => {

        setIsLoadingServices(true);

        const response = await serviceApi.fetchAll();

        if (response.error.length === 0) {

            setData(response.data);
        }
        else {

            message.error('Não foi possível carregar os serviços.');
        }

        setIsLoadingServices(false);
    };

    useEffect(() => fetchServices(), []);

    return (
        <Space direction="vertical">
            {isLoadingServices && <Spin />}
            {!isLoadingServices && data.map((service) => (
                <Radio
                    key={service.id}
                    value={service.id}
                    style={{ lineHeight: '32px' }}
                >
                    <div style={{ float: 'right' }}>
                        <div>{service.name}</div>

                        <div style={{ color: '#999', lineHeight: 1 }}>
                            {formatCurrency(service.basePrice)}
                            {service.description ? ' • ' + service.description : ''}
                        </div>
                    </div>
                </Radio>
            ))}
        </Space>
    );
};

export default ServicesList;