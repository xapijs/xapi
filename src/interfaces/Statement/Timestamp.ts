/**
 * # 4.5 ISO 8601 Timestamps
 *
 * Timestamps are a format type which represent a specific time. They are formatted according to ISO 8601's normal format. Statements sent to an LRS can be expected to keep precision to at least milliseconds
 *
 * ## Requirements
 *
 * - A Timestamp MUST be formatted according to ISO 8601.
 * - A Timestamp SHOULD* be expressed using the format described in RFC 3339, which is a profile of ISO 8601.
 * - A Timestamp MUST preserve precision to at least milliseconds (3 decimal points beyond seconds).
 * - A Timestamp SHOULD* include the time zone.
 * - If the Timestamp includes a time zone, the LRS MAY be return the Timestamp using a different timezone to the one originally used in the Statement so long as the point in time referenced is not affected.
 * - The LRS SHOULD* return the Timestamp in UTC timezone.
 * - A Timestamp MAY be truncated or rounded to a precision of at least 3 decimal digits for seconds.
 *
 * Reference: https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#45-iso-8601-timestamps
 */
export type Timestamp = string;
