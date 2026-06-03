import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetQueryDto {
  @IsOptional()
  @Type(() => Number) // تحويل النص القادم من الـ URL إلى رقم
  @IsInt()
  @Min(1)
  page?: number = 1; // الصفحة الافتراضية الأولى

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // حماية السيرفر من سحب كميات ضخمة دفعة واحدة
  limit?: number = 10; // العدد الافتراضي لكل صفحة
}