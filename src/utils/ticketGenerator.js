/**
 * Unique ticket booking reference generator
 * Format: TKT-AIMLD1-<TIMESTAMP_SUFFIX>-<RANDOM_CHARS>
 */

export const generateBookingReference = () => {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-5);
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKT-D1-${timestamp}-${randomChars}`;
};

/**
 * Generate a deterministic QR verification payload
 */
export const generateQRPayload = (bookingReference, eventId, attendeeId) => {
  return JSON.stringify({
    ref: bookingReference,
    evt: eventId,
    att: attendeeId,
    sys: 'AIML-D1-VERIFIED',
    ts: new Date().toISOString()
  });
};
