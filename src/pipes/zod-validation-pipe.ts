import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

type ErrorMessage = {
  field?: string;
  message: string;
};

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  private readonly logger = new Logger(ZodValidationPipe.name);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      this.logger.debug(`Validate value with schema: ${JSON.stringify(value)}`);
      const parsedValue = this.schema.parse(value);
      this.logger.debug(
        `Successfully validate the schema. Parsed value is: ${JSON.stringify(parsedValue)}`,
      );
      return parsedValue;
    } catch (error) {
      let errors = error;
      this.logger.debug(`Failed to validate the schema: `, error);

      if (error instanceof ZodError) {
        errors = error.errors.map((err) => {
          const errorMessage: ErrorMessage = {
            field: err.path.join('.'),
            message: err.message,
          };

          return errorMessage;
        });
      }
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }
  }
}

export const ZodValidate = (schema: ZodSchema) =>
  UsePipes(new ZodValidationPipe(schema));
