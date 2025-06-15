import { Controller, Get } from '@nestjs/common';

@Controller()
export class DefaultController {
    @Get()
    getHealthCheck(): string {
        return 'live';
    }
}
