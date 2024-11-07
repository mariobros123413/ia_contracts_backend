import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openAiService: OpenaiService) { }

    @Post('generate-document')
    async generateDocument(@Body() body: { type: string; data: string }) {
        const { type, data } = body;

        if (!type || !data) {
            throw new HttpException(
                'El tipo de documento y los datos son necesarios',
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            return await this.openAiService.generateDocument(type, data);
        } catch (error) {
            throw new HttpException(
                'Error al generar el documento',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
