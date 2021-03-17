import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { Table, Space, Button, Popconfirm, Input, Tooltip, message } from 'antd';
import { LoadingOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import LoadingIndicator from '../../components/LoadingIndicator';

import serviceApi from '../../services/services.api';

import { formatCurrency, formatDate } from '../../utils';

const PageServicesList = () => {

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [servicesBeingRemoved, setServicesBeingRemoved] = useState([]);

    const fetchServices = async (filters) => {

        setIsLoading(true);

        const response = await serviceApi.fetchAll(filters);

        if (response.error.length === 0) {

            setData(response.data);
        }
        else {

            message.error('Não foi possível carregar os agendamentos.');
        }

        setIsLoading(false);
    };

    const deleteService = async (id) => {

        markServiceAsBeingRemoved(id);

        const response = await serviceApi.delete(id);

        if (response.error.length === 0) {

            fetchServices(filters);

            message.success('Serviço excluído com sucesso.');
        }
        else {

            message.error('Não foi possível excluir o serviço.');
        }

        unmarkServiceAsBeingRemoved(id);
    };

    const markServiceAsBeingRemoved = (id) => {

        if (!servicesBeingRemoved.includes(id)) {

            setServicesBeingRemoved([...servicesBeingRemoved, id]);
        }
    };

    const unmarkServiceAsBeingRemoved = (id) => {

        const newArray = [...servicesBeingRemoved];

        const index = newArray.findIndex(item => item == id);

        newArray.splice(index, 1);

        setServicesBeingRemoved(newArray);
    };

    useEffect(() => fetchServices(filters), [ filters ]);

    useEffect(() => {

        const timer = setTimeout(() => {

            setFilters({
                q: searchTerm,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [ searchTerm ]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'right',
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Preço base',
            dataIndex: 'basePrice',
            key: 'basePrice',
            align: 'right',
            render: (basePrice) => formatCurrency(basePrice),
        },
        {
            title: 'Data de cadastro',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => formatDate(date),
        },
        {
            title: '',
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Editar">
                        <Link to={`/dashboard/services/edit/${record.id}`}>
                            <Button
                                shape="circle"
                                size="large"
                            >
                                <EditOutlined />
                            </Button>
                        </Link>
                    </Tooltip>

                    <Popconfirm
                        title="Operação irreversível. Continuar?"
                        okText="Sim, excluir"
                        cancelText="Cancelar"
                        onConfirm={() => deleteService(record.id)}
                    >
                        <Tooltip title="Excluir">
                            <Button
                                shape="circle"
                                size="large"
                                disabled={servicesBeingRemoved.includes(record.id)}
                            >
                                {servicesBeingRemoved.includes(record.id) ? <LoadingOutlined /> : <DeleteOutlined />}
                            </Button>
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            {isLoading && <LoadingIndicator />}
            {!isLoading && (
                <>
                    <h2>Tipos de serviços</h2>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space direction="vertical">
                            <Input
                                ref={(input) => input && input.focus()}
                                size="large"
                                placeholder="Procurar..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </Space>

                        <Link to="/dashboard/services/add">
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                size="large"
                            >
                                Adicionar
                            </Button>
                        </Link>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={data}
                        style={{ marginTop: 24 }}
                    />
                </>
            )}
        </>
    );
};

export default PageServicesList;