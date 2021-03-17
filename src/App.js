import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Layout } from 'antd';

import Navbar from './components/Navbar';

import PageSchedule from './pages/PageSchedule';
import PageDashboard from './pages/dashboard/PageDashboard';

import 'antd/dist/antd.css';

import './app.css';

const { Content } = Layout;

function App() {

    return (
        <Router>
            <Layout style={{ backgroundColor: 'white' }}>
                <Navbar />

                <Content style={{ paddingInline: 48, marginTop: 24 }}>
                    <Switch>
                        <Route path="/" exact component={PageSchedule} />
                        <Route path="/dashboard" component={PageDashboard} />
                    </Switch>
                </Content>
            </Layout>
        </Router>
    );
}

export default App;
