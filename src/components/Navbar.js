import { useState, useEffect } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { Layout, Menu } from 'antd';

import { CalendarOutlined, DashboardOutlined, ToolOutlined, CaretDownOutlined } from '@ant-design/icons';

const Navbar = () => {

    const [currentKey, setCurrentKey] = useState('scheduler');

    const location = useLocation();

    useEffect(() => {

        let pathnameParts = location.pathname.split('');

        pathnameParts.splice(0, 1);

        let currentKey = pathnameParts.join('');

        setCurrentKey(currentKey ? currentKey : 'scheduler');
    }, [ location ]);

    const handleNavClick = (event) => {

        setCurrentKey(event.key);
    };

    return (
        <Layout.Header className="header">
            <h3 className="logo">
                Schedule.it
            </h3>

            <Menu theme="dark" onClick={handleNavClick} selectedKeys={[currentKey]} mode="horizontal">
                <Menu.Item key="scheduler" icon={<CalendarOutlined />}>
                    <Link to="/">
                        Agendar serviço
                    </Link>
                </Menu.Item>

                <Menu.SubMenu key="dashboard" icon={<DashboardOutlined />} title={<>Administração <CaretDownOutlined /></>}>
                    <Menu.Item key="dashboard/schedules" icon={<CalendarOutlined />}>
                        <Link to="/dashboard/schedules">
                            Agendamentos
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="dashboard/services" icon={<ToolOutlined />}>
                        <Link to="/dashboard/services">
                            Tipos de serviços
                        </Link>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        </Layout.Header>
    );
};

export default Navbar;