import dayjs from 'dayjs';
import 'dayjs/locale/id';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.locale('id');

export function formatDate(date: string | Date, format: string) {
    return dayjs.utc(date).tz('Asia/Makassar').format(format);
}

export function witaToUtc(date: string | Date) {
    return dayjs.tz(`${date} 00:00`, 'DD-MM-YYYY HH:mm', 'Asia/Makassar').utc().format('YYYY-MM-DDTHH:mm:ss[.000000Z]');
}
