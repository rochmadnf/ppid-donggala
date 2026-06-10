type SpoofMethod = 'PUT' | 'PATCH' | 'DELETE';

/**
 * Menghasilkan transformer untuk form.transform() dengan HTTP method spoofing.
 * Laravel membutuhkan _method untuk PUT/PATCH/DELETE via POST.
 *
 * @example
 * form.transform(withMethod('PUT'));
 * form.transform(withMethod('PATCH', { submitted_at: new Date() }));
 */
export function withMethod<T extends object>(method: SpoofMethod, extra?: Record<string, unknown>) {
    return (data: T) => ({
        ...data,
        _method: method,
        ...extra,
    });
}

/** Untuk router — mengembalikan data langsung */
export function spoofMethod<T extends object>(data: T, method: SpoofMethod, extra?: Record<string, unknown>) {
    return { ...data, _method: method, ...extra };
}
