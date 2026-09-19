export type StringValue =
	| `${number}`
	| `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`
	| `${number} ${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

const multipliers = {
	ms: 1,
	s: 1_000,
	m: 60_000,
	h: 3_600_000,
	d: 86_400_000,
	w: 604_800_000,
	y: 31_536_000_000
} as const;

export function ms(value: StringValue): number {
	const match = /^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d|w|y)?$/i.exec(value);

	if (!match) {
		throw new Error(`Invalid time value: ${value}`);
	}

	const amount = Number(match[1]);
	const unit = (match[2]?.toLowerCase() ?? 'ms') as keyof typeof multipliers;

	return amount * multipliers[unit];
}