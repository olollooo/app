import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const start = Date.now();

    //リクエストログ
    this.logger.info({ method, url }, 'Incoming request');

    return next.handle().pipe(
      tap((res) => {
        const ms = Date.now() - start;
        //レスポンスログ
        this.logger.info(
          { method, url, duration: ms, status: 200 },
          'Request handled successfully'
        );
      }),
      catchError((err) => {
        const ms = Date.now() - start;

        //HttpExceptionかどうかでステータス取得
        const status = err instanceof HttpException ? err.getStatus() : 500;

        //bodyの内容はあれば取得
        const body =
          err instanceof HttpException
            ? err.getResponse()
            : { message: err.message };

        this.logger.error(
          { method, url, duration: ms, status, body, err },
          'Request failed'
        );

        //エラーはそのまま再スローしてHTTPレスポンスを返す
        throw err;
      })
    );
  }
}
