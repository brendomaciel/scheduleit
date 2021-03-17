import { useState, useMemo } from 'react';

import { useHistory } from "react-router-dom";

import { Form, Card, Input, Radio, Button, message } from 'antd';

import LoadingIndicator from '../../components/LoadingIndicator';
import ServicesList from '../../components/ServicesList';
import ScheduleStatusList from '../../components/ScheduleStatusList';
import DateTimePicker from '../../components/DateTimePicker';

import scheduleApi from '../../services/schedules.api';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 8 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            offset: 0,
            span: 24,
        },
        sm: {
            offset: 8,
            span: 16,
        },
        md: {
            offset: 8,
            span: 8,
        },
    },
};

const PageSchedulesEdit = ({ match }) => {

    let history = useHistory();

    const [schedule, setSchedule] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [form] = Form.useForm();

    const fetchSchedule = async () => {

        setIsLoading(true);

        const response = await scheduleApi.fetch(match.params.id);

        if (response.error.length === 0) {

            setSchedule(response.data);
        }
        else {

            message.error('Não foi possível carregar o agendamento.');
        }

        setIsLoading(false);
    };

    const onFinish = async () => {

        setIsSaving(true);

        const validatedData = await form.validateFields();

        const response = await scheduleApi.edit(match.params.id, { ...schedule, ...validatedData });

        if (response.error.length === 0) {

            message.success('O agendamento foi salvo com sucesso!');

            history.push('/dashboard/schedules');
        }
        else {

            message.error('Não foi possível salvar o agendamento.');
        }

        setIsSaving(false);
    };

    useMemo(() => fetchSchedule(), []);

    return (
        <>
            {isLoading && <LoadingIndicator />}
            {!isLoading && (
                <>
                    <h2>Editar agendamento</h2>

                    <Card style={{ marginTop: 48 }}>
                        <Form
                            initialValues={schedule}
                            {...formItemLayout}
                            form={form}
                            onFinish={onFinish}
                            scrollToFirstError
                            size="large"
                            style={{ marginTop: 24 }}
                        >
                            <Form.Item
                                name="vehicleLicensePlate"
                                label="Placa do veículo"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor, informe a placa do veículo',
                                    },
                                ]}
                                wrapperCol={{
                                    xs: {
                                        span: 16,
                                    },
                                    sm: {
                                        span: 8,
                                    },
                                    md: {
                                        span: 3,
                                    },
                                }}
                            >
                                <Input ref={(input) => input && input.focus()} />
                            </Form.Item>

                            <Form.Item
                                name="vehicleOwnerName"
                                label="Proprietário do veículo"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor, informe o nome do proprietário do veículo',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="serviceId"
                                label="Serviço"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor, escolha ao menos um serviço',
                                    },
                                ]}
                            >
                                <Radio.Group>
                                    <ServicesList />
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                name="serviceDetails"
                                label="Detalhes"
                            >
                                <Input.TextArea rows={2} placeholder="Ex.: O motor está com um barulho estranho" />
                            </Form.Item>

                            <Form.Item
                                name="scheduledFor"
                                label="Data e hora"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor, selecione a data e hora do agendamento',
                                    },
                                ]}
                            >
                                <DateTimePicker />
                            </Form.Item>

                            <Form.Item
                                name="status"
                                label="Situação"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor, escolha ao menos uma situação',
                                    },
                                ]}
                            >
                                <Radio.Group>
                                    <ScheduleStatusList />
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item {...tailFormItemLayout}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSaving}
                                >
                                    Salvar
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </>
            )}
        </>
    );
};

export default PageSchedulesEdit;