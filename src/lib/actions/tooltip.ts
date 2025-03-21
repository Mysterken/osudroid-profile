export function tooltip(
	node: HTMLElement,
	params: { text: string; direction?: 'top' | 'bottom' | 'left' | 'right' }
) {
	const { text, direction = 'bottom' } = params;

	const tooltip = document.createElement('div');
	tooltip.textContent = text;
	tooltip.className = 'svelte-tooltip';

	tooltip.style.position = 'absolute';
	tooltip.style.background = 'rgba(0, 0, 0, 0.85)';
	tooltip.style.color = 'white';
	tooltip.style.padding = '5px 10px';
	tooltip.style.borderRadius = '4px';
	tooltip.style.fontSize = '12px';
	tooltip.style.whiteSpace = 'nowrap';
	tooltip.style.pointerEvents = 'none';
	tooltip.style.transform = 'translateY(4px)';
	tooltip.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
	tooltip.style.zIndex = '9999';
	tooltip.style.opacity = '0';

	function setPosition() {
		const rect = node.getBoundingClientRect();
		const tipRect = tooltip.getBoundingClientRect();

		const offset = 8;
		const scrollY = window.scrollY;
		const scrollX = window.scrollX;

		switch (direction) {
			case 'bottom':
				tooltip.style.top = `${rect.bottom + offset + scrollY}px`;
				tooltip.style.left = `${rect.left + rect.width / 2 - tipRect.width / 2 + scrollX}px`;
				break;
			case 'left':
				tooltip.style.top = `${rect.top + rect.height / 2 - tipRect.height / 2 + scrollY}px`;
				tooltip.style.left = `${rect.left - tipRect.width - offset + scrollX}px`;
				break;
			case 'right':
				tooltip.style.top = `${rect.top + rect.height / 2 - tipRect.height / 2 + scrollY}px`;
				tooltip.style.left = `${rect.right + offset + scrollX}px`;
				break;
			case 'top':
			default:
				tooltip.style.top = `${rect.top - tipRect.height - offset + scrollY}px`;
				tooltip.style.left = `${rect.left + rect.width / 2 - tipRect.width / 2 + scrollX}px`;
		}
	}

	function show() {
		if (!document.body.contains(tooltip)) {
			document.body.appendChild(tooltip);
		}
		setPosition();
		tooltip.style.opacity = '1';
		tooltip.style.pointerEvents = 'auto';
		tooltip.style.transform = 'translateY(0)';
	}

	function hide() {
		tooltip.style.opacity = '0';
		tooltip.style.pointerEvents = 'none';
		tooltip.remove(); // destroy when hiding
	}

	node.addEventListener('mouseenter', show);
	node.addEventListener('mouseleave', hide);
	node.addEventListener('focus', show);
	node.addEventListener('blur', hide);

	return {
		update(newParams: { text: string; direction?: 'top' | 'bottom' | 'left' | 'right' }) {
			tooltip.textContent = newParams.text;
		},
		destroy() {
			node.removeEventListener('mouseenter', show);
			node.removeEventListener('mouseleave', hide);
			node.removeEventListener('focus', show);
			node.removeEventListener('blur', hide);
			tooltip.remove();
		}
	};
}
