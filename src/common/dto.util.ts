import {
  ClassTransformOptions,
  ClassConstructor,
  plainToInstance,
} from 'class-transformer';

export function toDto<T, V>(
  cls: ClassConstructor<T>,
  plain: V,
  options?: ClassTransformOptions,
): T {
  return plainToInstance(cls, plain, options);
}
