import dateFormat from 'dateformat';

const formatDate = (date: Date): string => dateFormat(date, 'dd/mm/yyyy');

export default formatDate;
