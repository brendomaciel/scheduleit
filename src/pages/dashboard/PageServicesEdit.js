import { useState, useMemo } from 'react';

import { useHistory } from "react-router-dom";

import { Form, Card, Input, Button, InputNumber, message } from 'antd';

import LoadingIndicator from '../../components/LoadingIndicator';

import serviceApi from '../../services/services.api';

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

const PageServicesEdit = ({ match }) => {

    let history = useHistory();

    const [service, setService] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [form] = Form.useForm();

    const fetchService = async () => {

        setIsLoading(true);

        const response = await serviceApi.fetch(match.params.id);

        if (response.error.length === 0) {

            setService(response.data);
        }
        else {

            message.error('Não foi possível carregar o serviço.');
        }

        setIsLoading(false);
    };

    const onFinish = async () => {

        setIsSaving(true);

        const validatedData = await form.validateFields();

        const response = await serviceApi.edit(match.params.id, { ...service, ...validatedData });

        if (response.error.length === 0) {

            message.success('O serviço foi salvo com sucesso!');

            history.push('/dashboard/services');
        }
        else {

            message.error('Não foi possível salvar o serviço.');
        }

        setIsSaving(false);
    };

    useMemo(() => fetchService(), []);

    return (
        <>
            {isLoading && <LoadingIndicator />}
            {!isLoading && (
                <>
                    <h2>Editar tipo de serviço</h2>

                    <Card style={{ marginTop: 48 }}>
                        <Form
                            initialValues={service}
                            {...formItemLayout}
                            form={form}
                            onFinish={onFinish}
                            scrollToFirstError
                            size="large"
                            style={{ marginTop: 24 }}
                        >
                            <Form.Item
                                name="name"
                                label="Nome"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor, informe o nome',
                                    },
                                ]}
                            >
                                <Input ref={(input) => input && input.focus()} />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Descrição"
                                initialValue={''}
                            >
                                <Input.TextArea rows={2} />
                            </Form.Item>

                            <Form.Item
                                name="basePrice"
                                label="Preço base"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor, informe o preço base',
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
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    decimalSeparator=","
                                    parser={value => value.replace(',', '.')}
                                    style={{ width: 120 }}
                                />
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

export default PageServicesEdit;