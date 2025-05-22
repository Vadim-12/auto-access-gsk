import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { GarageService } from './garage.service';
import { AuthHttpGuard } from 'src/modules/auth/guards/auth-http.guard';
import { CreateGarageDto } from './dto/create-garage.dto';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

@Controller('garages')
@UseGuards(AuthHttpGuard)
export class GarageController {
  constructor(private readonly garageService: GarageService) {}

  @Post()
  @UseGuards(AdminGuard)
  async createGarage(@Request() req, @Body() createGarageDto: CreateGarageDto) {
    const admin = await this.garageService.findUserById(req.user.userId);
    return this.garageService.createGarage({
      ...createGarageDto,
      admin,
    });
  }

  @Get('my')
  async getMyGarages(@Request() req) {
    return this.garageService.findMyGarages(req.user.userId);
  }

  @Get('available')
  async getAvailableGarages() {
    return this.garageService.findAvailableGarages();
  }

  @Get('access-requests')
  async getAccessRequests(@Request() req) {
    return this.garageService.findAccessRequests(req.user.userId);
  }

  @Post('access-requests')
  async createAccessRequest(
    @Request() req,
    @Body() body: { garageId: string },
  ) {
    return this.garageService.createAccessRequest(
      req.user.userId,
      body.garageId,
    );
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteGarage(@Request() req, @Param('id') id: string) {
    return this.garageService.deleteGarage(req.user.userId, id);
  }

  @Patch(':id/camera')
  @UseGuards(AdminGuard)
  async updateCameraSettings(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { ip: string; port: number },
  ) {
    console.log('Controller: updateCameraSettings called with:', {
      userId: req.user.userId,
      garageId: id,
      settings: body,
    });

    const result = await this.garageService.updateCameraSettings(
      req.user.userId,
      id,
      body,
    );

    console.log('Controller: updateCameraSettings result:', result);
    return result;
  }

  @Patch(':id/gate')
  @UseGuards(AdminGuard)
  async updateGateSettings(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { ip: string; port: number },
  ) {
    return this.garageService.updateGateSettings(req.user.userId, id, body);
  }
}
