import api from './api';

import { delay } from '../utils';

export default (endpoint, methods = [`add`, `edit`, `delete`, `fetch`, `fetchAll`]) => {

    const _api = {};

    if (methods.includes(`add`)) {

        _api.add = async (data) => {

            let error = [];

            try {

                data.createdAt = (new Date).toJSON();

                await api.post(`${endpoint}`, data);

                // Adding some delay in order to user see the animation
                await delay(500);
            }
            catch (exception) {

                error = exception;
            }

            return {
                data,
                error,
            };
        };
    }

    if (methods.includes(`edit`)) {

        _api.edit = async (id, data) => {

            let error = [];

            let _endpoint = endpoint.split('?')[0];

            try {

                await api.put(`${_endpoint}/${id}`, data);

                // Adding some delay in order to user see the animation
                await delay(500);
            }
            catch (exception) {

                error = exception;
            }

            return {
                data,
                error,
            };
        };
    }

    if (methods.includes(`delete`)) {

        _api.delete = async (id) => {

            let error = [];

            let _endpoint = endpoint.split('?')[0];

            try {

                await api.delete(`${_endpoint}/${id}`);

                await delay(500);
            }
            catch (exception) {

                error = exception;
            }

            return {
                error,
            };
        };
    }

    if (methods.includes(`fetch`)) {

        _api.fetch = async (id) => {

            let data = [];
            let error = [];

            let _endpoint = endpoint.split('?')[0];

            try {

                const response = await api.get(`${_endpoint}/${id}`);

                data = response.data;

                // Adding some delay in order to user see the animation
                await delay(500);
            }
            catch (exception) {

                error = exception;
            }

            return {
                data,
                error,
            };
        };
    }

    if (methods.includes(`fetchAll`)) {

        _api.fetchAll = async (params = {}) => {

            let data = [];
            let error = [];

            const query = {
                params,
            };

            try {

                const response = await api.get(`${endpoint}`, query);

                data = response.data;

                // Adding some delay in order to user see the animation
                await delay(500);
            }
            catch (exception) {

                error = exception;
            }

            return {
                data,
                error,
            };
        };
    }

    return _api;
};