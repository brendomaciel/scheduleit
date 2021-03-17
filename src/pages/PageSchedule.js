import { useState } from 'react';

import { Row, Col, Steps, Form, Input, Radio, Button, Modal, Result, message } from 'antd';

import ServicesList from '../components/ServicesList';
import DateTimePicker from '../components/DateTimePicker';

import scheduleApi from '../services/schedules.api';

import { SCHEDULE_SCHEDULED } from '../constants/scheduleStatus';

const steps = [
    {
        title: 'Informações do veículo',
    },
    {
        title: 'Serviços',
    },
    {
        title: 'Agendamento',
    },
];

const Page = () => {

    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const [form] = Form.useForm();

    const next = async () => {

        let currentStepFieldsNames = [];

        switch (currentStep) {

            case 0: currentStepFieldsNames = ['vehicleLicensePlate', 'vehicleOwnerName']; break;
            case 1: currentStepFieldsNames = ['serviceId', 'serviceDetails']; break;
            case 2: currentStepFieldsNames = ['date', 'hour']; break;
        }

        try {

            await form.validateFields(currentStepFieldsNames);
        }
        catch {

            return;
        }

        setCurrentStep(currentStep + 1);
    };

    const prev = () => {

        setCurrentStep(currentStep - 1);
    };

    const finish = async () => {

        setIsSaving(true);

        const validatedData = await form.validateFields();

        validatedData.status = SCHEDULE_SCHEDULED;
        validatedData.createdAt = (new Date).toJSON();

        const response = await scheduleApi.add(validatedData);

        if (response.error.length === 0) {

            form.resetFields();

            setCurrentStep(0);

            setIsSuccessModalVisible(true);
        }
        else {

            message.error('Não foi possível salvar o agendamento.');
        }

        setIsSaving(false);
    };

    return (
        <section style={{ padding: 24 }}>
            <div style={{ maxWidth: 768, marginTop: 48, marginInline: 'auto' }}>
                <Steps current={currentStep}>
                    {steps.map((item) => (
                        <Steps.Step
                            key={item.title}
                            title={item.title}
                        />
                    ))}
                </Steps>

                <div className="steps-content">
                    <Form
                        form={form}
                        name="schedule"
                        layout="horizontal"
                        labelCol={{ span: 9 }}
                        size="large"
                    >
                        <Row style={{ display: (currentStep !== 0 ? 'none' : '') }}>
                            <Col
                                span={14}
                                offset={5}
                            >
                                <Form.Item
                                    name="vehicleLicensePlate"
                                    label="Placa"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor, informe a placa do veículo',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="vehicleOwnerName"
                                    label="Nome do proprietário"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor, informe o nome do proprietário do veículo',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ display: (currentStep !== 1 ? 'none' : '') }}>
                            <Col
                                span={14}
                                offset={5}
                            >
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
                                    initialValue={''}
                                >
                                    <Input.TextArea rows={2} placeholder="Ex.: O motor está com um barulho estranho" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ display: (currentStep !== 2 ? 'none' : ''), marginBottom: 24 }}>
                            <Col
                                span={14}
                                offset={5}
                            >
                                <Form.Item
                                    name="scheduledFor"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor, selecione a data e hora do agendamento',
                                        },
                                    ]}
                                >
                                    <DateTimePicker />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    <Modal
                        visible={isSuccessModalVisible}
                        footer={null}
                        closable={false}
                    >
                        <Result
                            status="success"
                            title="Pronto!"
                            subTitle="O seu agendamento foi realizado com sucesso."
                            extra={[
                                <Button
                                    type="primary"
                                    key="done"
                                    onClick={() => setIsSuccessModalVisible(false)}
                                >
                                    Concluir
                                </Button>,
                            ]}
                        />
                    </Modal>
                </div>

                <div style={{ marginTop: 24 }}>
                    {currentStep > 0 && (
                        <Button
                            size="large"
                            style={{ marginInline: 8 }}
                            onClick={() => prev()}
                        >
                            Voltar
                        </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                        <Button
                            size="large"
                            type="primary"
                            style={{ float: 'right' }}
                            loading={isSaving}
                            onClick={() => finish()}
                        >
                            Agendar
                        </Button>
                    )}
                    {currentStep < steps.length - 1 && (
                        <Button
                            size="large"
                            style={{ float: 'right' }}
                            type="primary"
                            onClick={() => next()}
                        >
                            Continuar
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Page;