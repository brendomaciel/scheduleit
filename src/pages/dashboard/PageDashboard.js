import { Route } from 'react-router-dom';

import { Layout } from 'antd';

import PageSchedulesList from './PageSchedulesList';
import PageSchedulesAdd from './PageSchedulesAdd';
import PageSchedulesEdit from './PageSchedulesEdit';
import PageServicesList from './PageServicesList';
import PageServicesAdd from './PageServicesAdd';
import PageServicesEdit from './PageServicesEdit';

const PageDashboard = () => {

    return (
        <Layout style={{ backgroundColor: 'white' }}>
            <Layout.Content style={{ padding: 24, minHeight: 320 }}>
                <Route path="/dashboard/schedules" exact component={PageSchedulesList} />
                <Route path="/dashboard/schedules/add" component={PageSchedulesAdd} />
                <Route path="/dashboard/schedules/edit/:id" component={PageSchedulesEdit} />

                <Route path="/dashboard/services" exact component={PageServicesList} />
                <Route path="/dashboard/services/add" component={PageServicesAdd} />
                <Route path="/dashboard/services/edit/:id" component={PageServicesEdit} />
            </Layout.Content>
        </Layout>
    );
};

export default PageDashboard;