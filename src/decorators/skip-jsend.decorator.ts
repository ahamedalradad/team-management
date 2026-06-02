import { SetMetadata } from '@nestjs/common';

// المفتاح المعياري للـ Metadata
export const SKIP_JSEND_KEY = 'skipJsend';

// دالة الـ Decorator التي سنضعها فوق المسارات المستثناة
export const SkipJsend = () => SetMetadata(SKIP_JSEND_KEY, true);