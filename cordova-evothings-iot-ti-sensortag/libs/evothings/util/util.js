// File: util.js

evothings = window.evothings || {};

/**
 * @namespace
 * @author Aaron Ardiri
 * @author Fredrik Eldh
 * @description Utilities for byte arrays.
 */
evothings.util = {};

;(function()
{
	/**
	 * Interpret byte buffer as little endian 8 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.littleEndianToInt8 = function(data, offset)
	{
		var x = evothings.util.littleEndianToUint8(data, offset)
		if (x & 0x80) x = x - 256
		return x
	}

	/**
	 * Interpret byte buffer as unsigned little endian 8 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.littleEndianToUint8 = function(data, offset)
	{
		return data[offset]
	}

	/**
	 * Interpret byte buffer as little endian 16 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.littleEndianToInt16 = function(data, offset)
	{
		return (evothings.util.littleEndianToInt8(data, offset + 1) << 8) +
			evothings.util.littleEndianToUint8(data, offset)
	}

	/**
	 * Interpret byte buffer as unsigned little endian 16 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.littleEndianToUint16 = function(data, offset)
	{
		return (evothings.util.littleEndianToUint8(data, offset + 1) << 8) +
			evothings.util.littleEndianToUint8(data, offset)
	}

	/**
	 * Interpret byte buffer as unsigned little endian 32 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.littleEndianToUint32 = function(data, offset)
	{
		return (evothings.util.littleEndianToUint8(data, offset + 3) << 24) +
			(evothings.util.littleEndianToUint8(data, offset + 2) << 16) +
			(evothings.util.littleEndianToUint8(data, offset + 1) << 8) +
			evothings.util.littleEndianToUint8(data, offset)
	}


	/**
	 * Interpret byte buffer as signed big endian 16 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.bigEndianToInt16 = function(data, offset)
	{
		return (evothings.util.littleEndianToInt8(data, offset) << 8) +
			evothings.util.littleEndianToUint8(data, offset + 1)
	}

	/**
	 * Interpret byte buffer as unsigned big endian 16 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.bigEndianToUint16 = function(data, offset)
	{
		return (evothings.util.littleEndianToUint8(data, offset) << 8) +
			evothings.util.littleEndianToUint8(data, offset + 1)
	}

	/**
	 * Interpret byte buffer as unsigned big endian 32 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.bigEndianToUint32 = function(data, offset)
	{
		return (evothings.util.littleEndianToUint8(data, offset) << 24) +
			(evothings.util.littleEndianToUint8(data, offset + 1) << 16) +
			(evothings.util.littleEndianToUint8(data, offset + 2) << 8) +
			evothings.util.littleEndianToUint8(data, offset + 3)
	}

	/**
	 * Converts a single Base64 character to a 6-bit integer.
	 * @private
	 */
	function b64ToUint6(nChr) {
		return nChr > 64 && nChr < 91 ?
				nChr - 65
			: nChr > 96 && nChr < 123 ?
				nChr - 71
			: nChr > 47 && nChr < 58 ?
				nChr + 4
			: nChr === 43 ?
				62
			: nChr === 47 ?
				63
			:
				0;
	}

	/**
	 * Decodes a Base64 string. Returns a Uint8Array.
	 * nBlocksSize is optional.
	 * @param {String} sBase64
	 * @param {int} nBlocksSize
	 * @return {Uint8Array}
	 * @public
	 */
	evothings.util.base64DecToArr = function(sBase64, nBlocksSize) {
		var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, "");
		var nInLen = sB64Enc.length;
		var nOutLen = nBlocksSize ?
			Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize
			: nInLen * 3 + 1 >> 2;
		var taBytes = new Uint8Array(nOutLen);

		for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
			nMod4 = nInIdx & 3;
			nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
			if (nMod4 === 3 || nInLen - nInIdx === 1) {
				for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
					taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
				}
				nUint24 = 0;
			}
		}

		return taBytes;
	}

	/**
	 * Returns the integer i in hexadecimal string form,
	 * with leading zeroes, such that
	 * the resulting string is at least byteCount*2 characters long.
	 * @param {int} i
	 * @param {int} byteCount
	 * @public
	 */
	evothings.util.toHexString = function(i, byteCount) {
		var string = (new Number(i)).toString(16);
		while(string.length < byteCount*2) {
			string = '0'+string;
		}
		return string;
	}

	/**
	 * Takes a ArrayBuffer or TypedArray and returns its hexadecimal representation.
	 * No spaces or linebreaks.
	 * @param data
	 * @public
	 */
	evothings.util.typedArrayToHexString = function(data) {
		// view data as a Uint8Array, unless it already is one.
		if(data.buffer) {
			if(!(data instanceof Uint8Array))
				data = new Uint8Array(data.buffer);
		} else if(data instanceof ArrayBuffer) {
			data = new Uint8Array(data);
		} else {
			throw "not an ArrayBuffer or TypedArray.";
		}
		var str = '';
		for(var i=0; i<data.length; i++) {
			str += evothings.util.toHexString(data[i], 1);
		}
		return str;
	}
})();
