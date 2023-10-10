export const formatDate = (date: Date): string => {
	const options: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	};

	const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('en-GB', options);
	const parts: Intl.DateTimeFormatPart[] = formatter.formatToParts(date);
	const formattedDate: string = parts
		.map((part) => {
			if (part.type === 'day') {
				return getOrdinalSuffix(Number(part.value));
			}
			return part.value;
		})
		.join(' ');

	return formattedDate;
};

export const getOrdinalSuffix = (day: number): string => {
	const suffixes: string[] = ['th', 'st', 'nd', 'rd'];
	const relevantDigits: number = day % 100;
	const suffix: string =
		suffixes[(relevantDigits - 20) % 10] || suffixes[relevantDigits] || suffixes[0];
	return `${day}${suffix}`;
};
