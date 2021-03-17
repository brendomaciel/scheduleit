import { SCHEDULE_SCHEDULED, SCHEDULE_CANCELED, SCHEDULE_FINISHED } from './scheduleStatus';

export default {
    [SCHEDULE_SCHEDULED]: {
        name: 'Agendado',
        color: 'blue',
    },
    [SCHEDULE_CANCELED]: {
        name: 'Cancelado',
        color: 'red',
    },
    [SCHEDULE_FINISHED]: {
        name: 'Finalizado',
        color: 'green',
    },
};