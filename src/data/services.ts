import { Service } from '../types/service';

export const services: Service[] = [
    {
        id: 'library',
        title: 'Кітапхана',
        description: 'Кітаптар мен оқу орындары',
        icon: 'book',
    },
    {
        id: 'schedule',
        title: 'Кесте',
        description: 'Сабақтар мен емтихандар',
        icon: 'calendar',
    },
    {
        id: 'transport',
        title: 'Көлік',
        description: 'Маршруттар мен аялдамалар',
        icon: 'bus',
    },
    {
        id: 'support',
        title: 'Студенттік қолдау',
        description: 'Көмек және ресурстар',
        icon: 'help-circle',
    },
];