import { isString } from './helpers/variableType';

function buildColumnWidths(columns, availableWidth) {
	let autoColumns = [];
	let autoMin = 0;
	let autoMax = 0;
	let starColumns = [];
	let starMaxMin = 0;
	let starMaxMax = 0;
	let totalStars = 0;
	let fixedColumns = [];
	let initial_availableWidth = availableWidth;

	columns.forEach(column => {
		if (isAutoColumn(column)) {
			autoColumns.push(column);
			autoMin += column._minWidth;
			autoMax += column._maxWidth;
		} else if (isStarColumn(column)) {
			starColumns.push(column);
			const stars = numStars(column.width);
			totalStars += stars;
			starMaxMin = Math.min(starMaxMin, column._minWidth/stars);
			starMaxMax = Math.max(starMaxMax, column._maxWidth/stars);
		} else {
			fixedColumns.push(column);
		}
	});

	fixedColumns.forEach(col => {
		if (isPercent(col.width)) {
			col.width = getPercent(col.width) * initial_availableWidth;
		}

		col._calcWidth = col.width < (col._minWidth) && col.elasticWidth? col._minWidth : col.width;
		availableWidth -= col._calcWidth;
	});

	// http://www.freesoft.org/CIE/RFC/1942/18.htm
	// http://www.w3.org/TR/CSS2/tables.html#width-layout
	// http://dev.w3.org/csswg/css3-tables-algorithms/Overview.src.htm
	let minW = autoMin + starMaxMin * totalStars ;
	let maxW = autoMax + starMaxMax * totalStars ;
	if (minW >= availableWidth) {
		// case 1 - there's no way to fit all columns within available width
		// that's actually pretty bad situation with PDF as we have no horizontal scroll
		// no easy workaround (unless we decide, in the future, to split single words)
		// currently we simply use minWidths for all columns
		autoColumns.forEach(col => {
			col._calcWidth = col._minWidth;
		});

		starColumns.forEach(col => {
			col._calcWidth = starMaxMin*numStars(col.width); // starMaxMin already contains padding
		});
	} else {
		if (maxW < availableWidth) {
			// case 2 - we can fit rest of the table within available space
			autoColumns.forEach(col => {
				col._calcWidth = col._maxWidth;
				availableWidth -= col._calcWidth;
			});
		} else {
			// maxW is too large, but minW fits within available width
			let W = availableWidth - minW;
			let D = maxW - minW;

			autoColumns.forEach(col => {
				let d = col._maxWidth - col._minWidth;
				col._calcWidth = col._minWidth + d * W / D;
				availableWidth -= col._calcWidth;
			});
		}

		if (starColumns.length > 0) {
			let starSize = availableWidth / totalStars;

			starColumns.forEach(col => {
				col._calcWidth = starSize*numStars(col.width);
			});
		}
	}
}

function isAutoColumn(column) {
	return column.width === 'auto';
}

function isStarColumn(column) {
	return isStar(column.width);
}

function isStar(width) {
	return (width === null || width === undefined) || (isString(width) && (width.charAt(0) === '*' || width === 'star')) ;
}

function numStars(width) {
	return !width || width === '*' || width === 'star'? 1 : (parseInt(width.slice( 1 ), 10) || 1 );
}


function isPercent(width) {
	return isString(width) && /\d+%/.test(width);
}

function getPercent(width) {
	return parseFloat(width) / 100 ;
}


//TODO: refactor and reuse in measureTable
function measureMinMax(columns) {
	let result = { min: 0, max: 0 };
	let maxStar = { min: 0, max: 0 };
	let starCount = 0;

	for (let i = 0, l = columns.length; i < l; i++) {
		let c = columns[i];

		if (isStarColumn(c)) {
			const stars = numStars(c.width);
			maxStar.min = Math.max(maxStar.min, c._minWidth/stars);
			maxStar.max = Math.max(maxStar.max, c._maxWidth/stars);
			starCount += stars;
		} else if (isAutoColumn(c)) {
			result.min += c._minWidth;
			result.max += c._maxWidth;
		} else {
			result.min += ((c.width !== undefined && c.width) || c._minWidth);
			result.max += ((c.width !== undefined && c.width) || c._maxWidth);
		}
	}

	if (starCount) {
		result.min += starCount * maxStar.min;
		result.max += starCount * maxStar.max;
	}

	return result;
}

/**
 * Calculates column widths
 */
export default {
	buildColumnWidths: buildColumnWidths,
	measureMinMax: measureMinMax,
	isAutoColumn: isAutoColumn,
	isStarColumn: isStarColumn,
	numStars: numStars
};
