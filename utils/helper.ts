export function formatDate(dateString: string): string {
	const [datePart, timePart] = dateString.split(' ');
	const [day, month, year] = datePart.split('.').map(Number);

	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const monthName = monthNames[month - 1];

	return `${String(day).padStart(2, '0')}-${monthName}-${year}`;
}
