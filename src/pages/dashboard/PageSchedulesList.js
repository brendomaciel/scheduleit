import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { Table, Tag, Space, Button, Popconfirm, Input, Tooltip, message } from 'antd';
import { LoadingOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import LoadingIndicator from '../../components/LoadingIndicator';

import scheduleApi from '../../services/schedules.api';

import { formatDate } from '../../utils';

import statusList from '../../constants/scheduleStatusList';

const PageSchedulesList = () => {

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [schedulesBeingRemoved, setSchedulesBeingRemoved] = useState([]);

    const fetchSchedules = async (filters) => {

        setIsLoading(true);

        const response = await scheduleApi.fetchAll(filters);

        if (response.error.length === 0) {

            setData(response.data);
        }
        else {

            message.error('Não foi possível carregar os agendamentos.');
        }

        setIsLoading(false);
    };

    const deleteSchedule = async (id) => {

        markScheduleAsBeingRemoved(id);

        const response = await scheduleApi.delete(id);

        if (response.error.length === 0) {

            fetchSchedules(filters);

            message.success('Agendamento excluído com sucesso.');
        }
        else {

            message.error('Não foi possível excluir o agendamento.');
        }

        await fetchSchedules();

        unmarkScheduleAsBeingRemoved(id);
    };

    const markScheduleAsBeingRemoved = (id) => {

        if (!schedulesBeingRemoved.includes(id)) {

            setSchedulesBeingRemoved([...schedulesBeingRemoved, id]);
        }
    };

    const unmarkScheduleAsBeingRemoved = (id) => {

        const newArray = [...schedulesBeingRemoved];

        const index = newArray.findIndex(item => item == id);

        newArray.splice(index, 1);

        setSchedulesBeingRemoved(newArray);
    };

    useEffect(() => fetchSchedules(filters), [ filters ]);

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
            title: 'Situação',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (statusId) => {

                const status = statusList[statusId];

                return (
                    <Tag color={status.color} key={statusId}>
                        {status.name}
                    </Tag>
                );
            },
        },
        {
            title: 'Agendado para',
            dataIndex: 'scheduledFor',
            key: 'scheduledFor',
            render: (date) => formatDate(date),
        },
        {
            title: 'Proprietário do veículo',
            dataIndex: 'vehicleOwnerName',
            key: 'vehicleOwnerName',
        },
        {
            title: 'Placa do veículo',
            dataIndex: 'vehicleLicensePlate',
            key: 'vehicleLicensePlate',
        },
        {
            title: 'Serviço',
            key: 'service',
            dataIndex: 'service',
            render: (service, record) => (
                <>
                    <div>{service.name}</div>

                    <div style={{ color: '#999' }}>{record.serviceDetails}</div>
                </>
            ),
        },
        {
            title: 'Preço',
            dataIndex: 'service',
            key: 'servicePrice',
            align: 'right',
            render: (service) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.basePrice),
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
                        <Link to={`/dashboard/schedules/edit/${record.id}`}>
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
                        onConfirm={() => deleteSchedule(record.id)}
                    >
                        <Tooltip title="Excluir">
                            <Button
                                shape="circle"
                                size="large"
                                disabled={schedulesBeingRemoved.includes(record.id)}
                            >
                                {schedulesBeingRemoved.includes(record.id) ? <LoadingOutlined /> : <DeleteOutlined />}
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
                    <h2>Agendamentos</h2>

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

                        <Link to="/dashboard/schedules/add">
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

export default PageSchedulesList;